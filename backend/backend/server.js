const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mysql = require('mysql');
const attendanceRoutes = require('./routes/attendanceRoutes');

const app = express();
const PORT = 4000;

// Middleware setup
app.use(cors());
app.use(bodyParser.json());

// MySQL connection setup
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'attendance_system',
});

// Connect to MySQL
db.connect((err) => {
  if (err) {
    console.error('Error connecting to database:', err);
  } else {
    console.log('Connected to MySQL database');
  }
});

// Login route
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  const query = 'SELECT * FROM users WHERE username = ? AND password = ?';

  db.query(query, [username, password], (err, results) => {
    if (err) {
      console.error('Error executing query:', err);
      return res.status(500).json({ success: false, message: 'Something went wrong.' });
    }
    if (results.length > 0) {
      res.json({ success: true });
    } else {
      res.json({ success: false, message: 'Invalid username or password' });
    }
  });
});

// Get attendance for a subject and specific date
app.get('/attendance/:subjectCode/:date', (req, res) => {
  const { subjectCode, date } = req.params;
  const query = `
    SELECT s.id, s.gr_no, s.roll_no, s.name, 
           COALESCE(ar.attendance, 0) AS attendance
    FROM students s
    JOIN student_subjects ss ON s.id = ss.student_id
    LEFT JOIN attendance_records ar ON ar.student_id = s.id AND ar.subject_code = ss.subject_code AND ar.date = ?
    WHERE ss.subject_code = ?
  `;

  db.query(query, [date, subjectCode], (err, results) => {
    if (err) {
      console.error('Error fetching attendance data:', err);
      return res.status(500).json({ success: false, message: 'Something went wrong.' });
    }
    res.json({ success: true, students: results });
  });
});

// Submit attendance data
app.post('/attendance/:subjectCode/:date', (req, res) => {
  const { subjectCode, date } = req.params;
  const { students } = req.body;

  students.forEach(student => {
    const { id, attendance } = student;

    const checkQuery = `
      SELECT * FROM attendance_records WHERE student_id = ? AND subject_code = ? AND date = ?
    `;

    db.query(checkQuery, [id, subjectCode, date], (err, results) => {
      if (err) {
        return res.status(500).json({ success: false, message: 'Error checking attendance record' });
      }

      if (results.length > 0) {
        const updateQuery = `
          UPDATE attendance_records SET attendance = ? WHERE id = ?
        `;
        db.query(updateQuery, [attendance, results[0].id], (err) => {
          if (err) {
            return res.status(500).json({ success: false, message: 'Error updating attendance' });
          }
        });
      } else {
        const insertQuery = `
          INSERT INTO attendance_records (student_id, subject_code, attendance, date) 
          VALUES (?, ?, ?, ?)
        `;
        db.query(insertQuery, [id, subjectCode, attendance, date], (err) => {
          if (err) {
            return res.status(500).json({ success: false, message: 'Error inserting attendance' });
          }
        });
      }
    });
  });

  res.status(200).json({ success: true, message: 'Attendance updated successfully' });
});

// External attendance routes
app.use('/api', attendanceRoutes);

// ✅ Defaulters route - Fixed to use attendance field (0/1)
app.get('/defaulters/:subjectCode/:month/:year', (req, res) => {
  const { subjectCode, month, year } = req.params;

  // First, let's check what data exists in the table
  const debugQuery = `
    SELECT student_id, subject_code, date, attendance
    FROM attendance_records 
    WHERE MONTH(date) = ? AND YEAR(date) = ? AND subject_code = ?
    LIMIT 5;
  `;

  db.query(debugQuery, [month, year, subjectCode], (debugErr, debugResults) => {
    if (debugErr) {
      console.error('❌ Debug query error:', debugErr);
    } else {
      console.log('🔍 Sample data for debugging:', {
        subjectCode,
        month,
        year,
        sampleRecords: debugResults
      });
    }

    // Main query - using attendance field (1 = present, 0 = absent)
    const query = `
      SELECT 
        ar.student_id,
        SUM(CASE WHEN ar.attendance = 1 THEN 1 ELSE 0 END) AS present_days,
        COUNT(*) AS total_days,
        ROUND(SUM(CASE WHEN ar.attendance = 1 THEN 1 ELSE 0 END) / COUNT(*) * 100, 2) AS attendance_percentage
      FROM attendance_records ar
      WHERE MONTH(ar.date) = ? AND YEAR(ar.date) = ? AND ar.subject_code = ?
      GROUP BY ar.student_id
      ORDER BY attendance_percentage ASC;
    `;

    db.query(query, [month, year, subjectCode], (err, results) => {
      if (err) {
        console.error('❌ Error fetching defaulters:', err);
        return res.status(500).json({ success: false, message: 'Error fetching defaulters' });
      }

      console.log('📊 All students with attendance:', results);

      // Filter defaulters (< 75%)
      const defaulters = results.filter(row => row.attendance_percentage < 75);
      
      console.log('🚨 Defaulters found:', defaulters);

      const responseData = defaulters.map(row => ({
        student_id: row.student_id,
        present_days: row.present_days,
        total_days: row.total_days,
        attendance_percentage: row.attendance_percentage
      }));

      res.json({ success: true, defaulters: responseData });
    });
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});