import React, { useState, useEffect } from 'react';
import axios from 'axios';

const DefaultersPage = () => {
  const [defaulters, setDefaulters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [month, setMonth] = useState(1); // Default: January
  const [year, setYear] = useState(2025); // Default: 2025

  useEffect(() => {
    const fetchDefaulters = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`/defaulters/${month}/${year}`);
        console.log('Defaulters fetched:', response.data); // Check API response in console
        if (response.data.success) {
          setDefaulters(response.data.defaulters);
        } else {
          setDefaulters([]);
        }
      } catch (error) {
        console.error('Error fetching defaulters:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDefaulters();
  }, [month, year]);

  return (
    <div style={{ padding: '20px' }}>
      <h1>Defaulter List</h1>
      
      {/* Month and Year Selectors */}
      <div style={{ marginBottom: '20px' }}>
        <label style={{ marginRight: '10px' }}>Select Month: </label>
        <select
          value={month}
          onChange={(e) => setMonth(Number(e.target.value))}
          style={{ padding: '5px' }}
        >
          {[...Array(12)].map((_, i) => (
            <option key={i} value={i + 1}>
              {new Date(0, i).toLocaleString('default', { month: 'long' })}
            </option>
          ))}
        </select>

        <label style={{ marginLeft: '20px', marginRight: '10px' }}>Select Year: </label>
        <input
          type="number"
          value={year}
          onChange={(e) => setYear(Number(e.target.value))}
          style={{ padding: '5px' }}
        />
      </div>

      {/* Loading State */}
      {loading ? (
        <p>Loading...</p>
      ) : defaulters.length === 0 ? (
        <p>No defaulters found for this month/year.</p>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={{ border: '1px solid #ddd', padding: '8px' }}>Student ID</th>
              <th style={{ border: '1px solid #ddd', padding: '8px' }}>GR No.</th>
              <th style={{ border: '1px solid #ddd', padding: '8px' }}>Roll No.</th>
              <th style={{ border: '1px solid #ddd', padding: '8px' }}>Name</th>
              <th style={{ border: '1px solid #ddd', padding: '8px' }}>Present Days</th>
              <th style={{ border: '1px solid #ddd', padding: '8px' }}>Total Days</th>
              <th style={{ border: '1px solid #ddd', padding: '8px' }}>Attendance Percentage</th>
            </tr>
          </thead>
          <tbody>
            {defaulters.map((defaulter) => (
              <tr key={defaulter.id} style={{ textAlign: 'center', border: '1px solid #ddd' }}>
                <td>{defaulter.id}</td>
                <td>{defaulter.gr_no}</td>
                <td>{defaulter.roll_no}</td>
                <td>{defaulter.name}</td>
                <td>{defaulter.present_days}</td>
                <td>{defaulter.total_days}</td>
                <td>{defaulter.attendance_percentage ? defaulter.attendance_percentage.toFixed(2) : '0.00'}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default DefaultersPage;
