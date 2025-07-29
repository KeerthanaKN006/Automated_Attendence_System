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

  const downloadCSV = () => {
    if (defaulters.length === 0) return;

    const headers = ['Student ID', 'Present Days', 'Total Days', 'Attendance (%)'];
    const csvContent = [
      headers.join(','),
      ...defaulters.map(student => [
        student.student_id,
        student.present_days,
        student.total_days,
        student.attendance_percentage
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `defaulters_${subjectCode}_${monthNames[month-1]}_${year}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #231367ff 0%, #231367ff 100%)',
      padding: '2rem',
      fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        background: 'rgba(255, 255, 255, 0.95)',
        borderRadius: '20px',
        padding: '2rem',
        boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
        backdropFilter: 'blur(10px)'
      }}>
        <div style={{
          textAlign: 'center',
          marginBottom: '2rem',
          background: 'linear-gradient(45deg, #ff6b6b, #ee5a24)',
          backgroundClip: 'text',
          WebkitBackgroundClip: 'text',
          color: 'transparent',
          fontSize: '2.5rem',
          fontWeight: 'bold',
          marginBottom: '0.5rem'
        }}>
          📊 Defaulters Report
        </div>
        
        <div style={{
          textAlign: 'center',
          color: '#666',
          fontSize: '1.1rem',
          marginBottom: '2rem'
        }}>
          Students with attendance below 75%
        </div>

        <div style={{
          display: 'flex',
          gap: '1.5rem',
          marginBottom: '2rem',
          flexWrap: 'wrap',
          justifyContent: 'center',
          background: '#f8f9fa',
          padding: '1.5rem',
          borderRadius: '15px',
          border: '2px solid #e9ecef'
        }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label style={{ fontWeight: '600', color: '#495057' }}>Month:</label>
            <select 
              value={month} 
              onChange={(e) => setMonth(parseInt(e.target.value))}
              style={{
                padding: '10px 15px',
                borderRadius: '10px',
                border: '2px solid #dee2e6',
                fontSize: '16px',
                background: 'white',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                outline: 'none'
              }}
              onFocus={(e) => e.target.style.borderColor = '#667eea'}
              onBlur={(e) => e.target.style.borderColor = '#dee2e6'}
            >
              {monthNames.map((m, i) => (
                <option key={i} value={i + 1}>{m}</option>
              ))}
            </select>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label style={{ fontWeight: '600', color: '#495057' }}>Year:</label>
            <select 
              value={year} 
              onChange={(e) => setYear(parseInt(e.target.value))}
              style={{
                padding: '10px 15px',
                borderRadius: '10px',
                border: '2px solid #dee2e6',
                fontSize: '16px',
                background: 'white',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                outline: 'none'
              }}
              onFocus={(e) => e.target.style.borderColor = '#667eea'}
              onBlur={(e) => e.target.style.borderColor = '#dee2e6'}
            >
              {[2023, 2024, 2025].map((yr) => (
                <option key={yr} value={yr}>{yr}</option>
              ))}
            </select>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label style={{ fontWeight: '600', color: '#495057' }}>Subject Code:</label>
            <input
              type="text"
              value={subjectCode}
              onChange={(e) => setSubjectCode(e.target.value.toUpperCase())}
              placeholder="e.g. CS670"
              style={{
                padding: '10px 15px',
                borderRadius: '10px',
                border: '2px solid #dee2e6',
                fontSize: '16px',
                background: 'white',
                transition: 'all 0.3s ease',
                outline: 'none',
                minWidth: '150px'
              }}
              onFocus={(e) => e.target.style.borderColor = '#667eea'}
              onBlur={(e) => e.target.style.borderColor = '#dee2e6'}
            />
          </div>
        </div>

        {loading ? (
          <div style={{
            textAlign: 'center',
            padding: '3rem',
            fontSize: '1.2rem',
            color: '#667eea'
          }}>
            <div style={{
              display: 'inline-block',
              width: '50px',
              height: '50px',
              border: '5px solid #f3f3f3',
              borderTop: '5px solid #667eea',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
              marginBottom: '1rem'
            }}></div>
            <div>Loading defaulters...</div>
            <style>
              {`
                @keyframes spin {
                  0% { transform: rotate(0deg); }
                  100% { transform: rotate(360deg); }
                }
              `}
            </style>
          </div>
        ) : defaulters.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '3rem',
            background: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
            borderRadius: '15px',
            fontSize: '1.2rem',
            color: '#495057'
          }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🎉</div>
            <div style={{ fontWeight: '600' }}>Great News!</div>
            <div>No defaulters found for the selected filters.</div>
            <div style={{ fontSize: '1rem', marginTop: '0.5rem', opacity: 0.8 }}>
              All students have attendance ≥ 75%
            </div>
          </div>
        ) : (
          <div>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '1.5rem',
              flexWrap: 'wrap',
              gap: '1rem'
            }}>
              <div style={{
                background: 'linear-gradient(45deg, #ff6b6b, #ee5a24)',
                color: 'white',
                padding: '10px 20px',
                borderRadius: '25px',
                fontWeight: '600',
                fontSize: '1.1rem'
              }}>
                {defaulters.length} Defaulter{defaulters.length !== 1 ? 's' : ''} Found
              </div>
              
              <button
                onClick={downloadCSV}
                style={{
                  background: 'linear-gradient(45deg, #2ecc71, #27ae60)',
                  color: 'white',
                  border: 'none',
                  padding: '12px 24px',
                  borderRadius: '25px',
                  fontSize: '1rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 4px 15px rgba(46, 204, 113, 0.3)'
                }}
                onMouseOver={(e) => {
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.boxShadow = '0 6px 20px rgba(46, 204, 113, 0.4)';
                }}
                onMouseOut={(e) => {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = '0 4px 15px rgba(46, 204, 113, 0.3)';
                }}
              >
                📥 Download CSV
              </button>
            </div>

            <div style={{
              background: 'white',
              borderRadius: '15px',
              overflow: 'hidden',
              boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
              border: '1px solid #e9ecef'
            }}>
              <table style={{
                width: '100%',
                borderCollapse: 'collapse',
                fontSize: '1rem'
              }}>
                <thead>
                  <tr style={{
                    background: 'linear-gradient(45deg, #000000ff,  #000000ff)',
                    color: 'white'
                  }}>
                    <th style={{
                      padding: '20px 15px',
                      textAlign: 'left',
                      fontWeight: '600',
                      fontSize: '1.1rem'
                    }}>Student ID</th>
                    <th style={{
                      padding: '20px 15px',
                      textAlign: 'left',
                      fontWeight: '600',
                      fontSize: '1.1rem'
                    }}>Present Days</th>
                    <th style={{
                      padding: '20px 15px',
                      textAlign: 'left',
                      fontWeight: '600',
                      fontSize: '1.1rem'
                    }}>Total Days</th>
                    <th style={{
                      padding: '20px 15px',
                      textAlign: 'left',
                      fontWeight: '600',
                      fontSize: '1.1rem'
                    }}>Attendance (%)</th>
                  </tr>
                </thead>
                <tbody>
                  {defaulters.map((student, index) => (
                    <tr 
                      key={student.student_id}
                      style={{
                        background: index % 2 === 0 ? '#f8f9fa' : 'white',
                        transition: 'all 0.3s ease'
                      }}
                      onMouseOver={(e) => {
                        e.currentTarget.style.background = '#e3f2fd';
                        e.currentTarget.style.transform = 'scale(1.01)';
                      }}
                      onMouseOut={(e) => {
                        e.currentTarget.style.background = index % 2 === 0 ? '#f8f9fa' : 'white';
                        e.currentTarget.style.transform = 'scale(1)';
                      }}
                    >
                      <td style={{
                        padding: '15px',
                        fontWeight: '600',
                        color: '#495057'
                      }}>{student.student_id}</td>
                      <td style={{
                        padding: '15px',
                        color: '#495057'
                      }}>{student.present_days}</td>
                      <td style={{
                        padding: '15px',
                        color: '#495057'
                      }}>{student.total_days}</td>
                      <td style={{
                        padding: '15px',
                        fontWeight: '600',
                        fontSize: '1.1rem'
                      }}>
                        <span style={{
                          background: student.attendance_percentage < 50
                            ? 'linear-gradient(45deg, #ff6b6b, #ee5a24)'
                            : 'linear-gradient(45deg, #ffa726, #ff9800)',
                          color: 'white',
                          padding: '5px 12px',
                          borderRadius: '20px',
                          fontSize: '0.9rem'
                        }}>
                          {student.attendance_percentage}%
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DefaultersPage;