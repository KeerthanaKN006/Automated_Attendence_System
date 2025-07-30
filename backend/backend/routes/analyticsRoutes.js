const express = require('express');

function analyticsRoutes(db) {
  const router = express.Router();

  router.get('/:subjectCode', (req, res) => {
    const sc = req.params.subjectCode;

    const queries = {
      totalStudents: `SELECT COUNT(*) AS count FROM student_subjects WHERE subject_code = ?`,
      classesHeld: `SELECT COUNT(DISTINCT date) AS count FROM attendance_records WHERE subject_code = ?`,
      averageAttendance: `SELECT AVG(attendance) AS avg FROM attendance_records WHERE subject_code = ?`,
      defaultersCount: `
        SELECT COUNT(*) AS count FROM (
          SELECT student_id, AVG(attendance) AS avg FROM attendance_records
          WHERE subject_code = ? GROUP BY student_id HAVING avg < 0.75
        ) AS sub
      `,
      attendanceTrends: `
        SELECT date, AVG(attendance)*100 AS percentage FROM attendance_records
        WHERE subject_code = ? GROUP BY date ORDER BY date
      `,
      topPerformers: `
        SELECT s.name, s.roll_no, AVG(ar.attendance)*100 AS percentage FROM students s
        JOIN attendance_records ar ON s.id = ar.student_id
        WHERE ar.subject_code = ? GROUP BY s.id ORDER BY percentage DESC LIMIT 5
      `,
      defaulters: `
        SELECT s.name, s.roll_no, AVG(ar.attendance)*100 AS percentage FROM students s
        JOIN attendance_records ar ON s.id = ar.student_id
        WHERE ar.subject_code = ? GROUP BY s.id HAVING percentage < 75
      `,
      attendanceDistribution: `
        SELECT
          CASE
            WHEN avg_att >= 90 THEN '90-100'
            WHEN avg_att >= 75 THEN '75-89'
            WHEN avg_att >= 60 THEN '60-74'
            ELSE '<60'
          END AS \`range\`, COUNT(*) AS count
        FROM (
          SELECT student_id, AVG(attendance)*100 AS avg_att
          FROM attendance_records WHERE subject_code = ? GROUP BY student_id
        ) AS grouped
        GROUP BY \`range\`
      `,
      weeklyTrends: `
        SELECT WEEK(date) AS week,
          SUM(attendance = 1) AS present,
          SUM(attendance = 0) AS absent
        FROM attendance_records
        WHERE subject_code = ?
        GROUP BY WEEK(date)
      `
    };

    const keys = Object.keys(queries);
    const results = {};
    let done = 0;

    keys.forEach(key => {
      db.query(queries[key], [sc], (err, rows) => {
        if (err) {
          console.error(`Error ${key}:`, err);
          return res.status(500).json({ success: false, message: `Error ${key}` });
        }
        results[key] = rows;
        done++;
        if (done === keys.length) {
          res.json({
            success: true,
            data: {
              overallStats: {
                totalStudents: results.totalStudents[0]?.count ?? 0,
                classesHeld: results.classesHeld[0]?.count ?? 0,
                averageAttendance: parseFloat(results.averageAttendance[0]?.avg || 0).toFixed(2),
                defaultersCount: results.defaultersCount[0]?.count ?? 0
              },
              attendanceTrends: results.attendanceTrends,
              topPerformers: results.topPerformers.map(s => ({
                name: s.name,
                rollNo: s.roll_no,
                percentage: parseFloat(s.percentage).toFixed(2),
                status: s.percentage >= 75 ? '✅ Good' : '⚠️ Low'
              })),
              defaulters: results.defaulters.map(s => ({
                name: s.name,
                rollNo: s.roll_no,
                percentage: parseFloat(s.percentage).toFixed(2),
                status: s.percentage < 60 ? '🚨 Critical' : '⚠️ Low'
              })),
              attendanceDistribution: results.attendanceDistribution.map(r => ({
                range: r.range,
                count: r.count
              })),
              weeklyTrends: results.weeklyTrends
            }
          });
        }
      });
    });
  });

  return router;
}

module.exports = analyticsRoutes;
