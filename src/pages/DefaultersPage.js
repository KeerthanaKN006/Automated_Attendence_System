import React, { useState, useEffect } from 'react';
import axios from 'axios';

const DefaultersPage = () => {
  const [defaulters, setDefaulters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [month, setMonth] = useState(1);
  const [year, setYear] = useState(2025);
  const [subjectCode, setSubjectCode] = useState('CS670'); // Default subject

  useEffect(() => {
    fetchDefaulters();
  }, [month, year, subjectCode]);

  const fetchDefaulters = async () => {
    try {
      setLoading(true);
      const url = `http://localhost:4000/defaulters/${subjectCode}/${month}/${year}`;
      console.log('🔍 Fetching from URL:', url);
      
      const response = await axios.get(url);
      console.log('📊 Response received:', response.data);
      
      if (response.data.success) {
        setDefaulters(response.data.defaulters);
        console.log('✅ Defaulters set:', response.data.defaulters);
      } else {
        setDefaulters([]);
        console.log('❌ No success in response');
      }
    } catch (error) {
      console.error('❌ Error fetching defaulters:', error);
      setDefaulters([]);
    } finally {
      setLoading(false);
    }
  };

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h2>📊 Defaulters Report</h2>

      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
        <div>
          <label>Month: </label>
          <select value={month} onChange={(e) => setMonth(parseInt(e.target.value))}>
            {monthNames.map((m, i) => (
              <option key={i} value={i + 1}>{m}</option>
            ))}
          </select>
        </div>

        <div>
          <label>Year: </label>
          <select value={year} onChange={(e) => setYear(parseInt(e.target.value))}>
            {[2023, 2024, 2025].map((yr) => (
              <option key={yr} value={yr}>{yr}</option>
            ))}
          </select>
        </div>

        <div>
          <label>Subject Code: </label>
          <input
            type="text"
            value={subjectCode}
            onChange={(e) => setSubjectCode(e.target.value.toUpperCase())}
            placeholder="e.g. CS670"
          />
        </div>
      </div>

      {loading ? (
        <p>Loading defaulters...</p>
      ) : defaulters.length === 0 ? (
        <p>No defaulters found for selected filters.</p>
      ) : (
        <table border="1" cellPadding="10" style={{ borderCollapse: 'collapse', width: '100%' }}>
          <thead>
            <tr>
              <th>Student ID</th>
              <th>Present Days</th>
              <th>Total Days</th>
              <th>Attendance (%)</th>
            </tr>
          </thead>
          <tbody>
            {defaulters.map((student) => (
              <tr key={student.student_id}>
                <td>{student.student_id}</td>
                <td>{student.present_days}</td>
                <td>{student.total_days}</td>
                <td style={{
                  color:
                    student.attendance_percentage < 50
                      ? 'red'
                      : student.attendance_percentage < 75
                      ? 'orange'
                      : 'green'
                }}>
                  {student.attendance_percentage}%
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default DefaultersPage;