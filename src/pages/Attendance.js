import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './styles/Attendance.css';
import axios from 'axios';

const Attendance = () => {
  const { subjectCode } = useParams();
  const [students, setStudents] = useState([]);
  const [date, setDate] = useState(''); // State to store the selected date
  const GR_PREFIX = "AIDS2023"; // Prefix for GR numbers
  const navigate = useNavigate(); // To navigate to DefaulterPage

  // Fetch student data for the selected date
  useEffect(() => {
    if (date) {
      const fetchAttendance = async () => {
        try {
          const response = await axios.get(`/attendance/${subjectCode}/${date}`);
          if (response.data.success) {
            setStudents(response.data.students);
          } else {
            alert('Failed to load student data');
          }
        } catch (error) {
          console.error('Error fetching attendance data', error);
          alert('Something went wrong. Please try again later.');
        }
      };
      fetchAttendance();
    }
  }, [subjectCode, date]);

  // Handle the date change
  const handleDateChange = (e) => {
    setDate(e.target.value); // Update date state
  };

  // Handle changes in attendance (mark attendance)
  const handleAttendanceChange = (index, isChecked) => {
    const updatedStudents = [...students];
    updatedStudents[index].attendance = isChecked ? 1 : 0; // 1 for present, 0 for absent
    setStudents(updatedStudents);
  };

  // Submit attendance data to the backend
  const handleAttendanceSubmit = async () => {
    if (!date) {
      alert('Please select a date');
      return;
    }

    try {
      const response = await axios.post(`/attendance/${subjectCode}/${date}`, {
        students,
        date, // Send the selected date
      });
      if (response.data.success) {
        alert('Attendance updated successfully');
      } else {
        alert('Failed to update attendance');
      }
    } catch (error) {
      console.error('Error updating attendance', error);
      alert('Something went wrong. Please try again later.');
    }
  };

  // Navigate to Defaulter Page
  const goToDefaulterPage = () => {
    navigate('/defaulters');  // This will route to the DefaultersPage
  };

  const presentCount = students.filter(student => student.attendance === 1).length;
  const absentCount = students.filter(student => student.attendance === 0).length;

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #231367ff 0%, #231367ff 100%)',
      padding: '2rem',
      fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif'
    }}>
      <div style={{
        maxWidth: '1400px',
        margin: '0 auto',
        background: 'rgba(255, 255, 255, 0.95)',
        borderRadius: '20px',
        padding: '2rem',
        boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
        backdropFilter: 'blur(10px)'
      }}>
        {/* Header Section */}
        <div style={{
          textAlign: 'center',
          marginBottom: '2rem'
        }}>
          <h1 style={{
            background: 'linear-gradient(45deg, #667eea, #764ba2)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            color: 'transparent',
            fontSize: '2.5rem',
            fontWeight: 'bold',
            margin: '0 0 0.5rem 0'
          }}>
            🎓 B.Tech AIDS - 2nd Year
          </h1>
          <h2 style={{
            background: 'linear-gradient(45deg, #ff6b6b, #ee5a24)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            color: 'transparent',
            fontSize: '2rem',
            fontWeight: '600',
            margin: '0'
          }}>
            {subjectCode} - Attendance
          </h2>
        </div>

        {/* Date Selection and Stats */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '2rem',
          flexWrap: 'wrap',
          gap: '1rem',
          background: '#f8f9fa',
          padding: '1.5rem',
          borderRadius: '15px',
          border: '2px solid #e9ecef'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1rem'
          }}>
            <label style={{
              fontSize: '1.2rem',
              fontWeight: '600',
              color: '#495057'
            }}>
              📅 Select Date:
            </label>
            <input 
              type="date" 
              value={date} 
              onChange={handleDateChange}
              style={{
                padding: '12px 15px',
                borderRadius: '10px',
                border: '2px solid #dee2e6',
                fontSize: '16px',
                background: 'white',
                transition: 'all 0.3s ease',
                outline: 'none',
                minWidth: '180px'
              }}
              onFocus={(e) => e.target.style.borderColor = '#667eea'}
              onBlur={(e) => e.target.style.borderColor = '#dee2e6'}
            />
          </div>

          {students.length > 0 && (
            <div style={{
              display: 'flex',
              gap: '1rem'
            }}>
              <div style={{
                background: 'linear-gradient(45deg, #2ecc71, #27ae60)',
                color: 'white',
                padding: '10px 20px',
                borderRadius: '25px',
                fontWeight: '600',
                fontSize: '1rem'
              }}>
                ✅ Present: {presentCount}
              </div>
              <div style={{
                background: 'linear-gradient(45deg, #e74c3c, #c0392b)',
                color: 'white',
                padding: '10px 20px',
                borderRadius: '25px',
                fontWeight: '600',
                fontSize: '1rem'
              }}>
                ❌ Absent: {absentCount}
              </div>
              <div style={{
                background: 'linear-gradient(45deg, #3498db, #2980b9)',
                color: 'white',
                padding: '10px 20px',
                borderRadius: '25px',
                fontWeight: '600',
                fontSize: '1rem'
              }}>
                👥 Total: {students.length}
              </div>
            </div>
          )}
        </div>

        {/* Students Table */}
        {students.length > 0 ? (
          <div style={{
            background: 'white',
            borderRadius: '15px',
            overflow: 'hidden',
            boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
            border: '1px solid #e9ecef',
            marginBottom: '2rem'
          }}>
            <table style={{
              width: '100%',
              borderCollapse: 'collapse',
              fontSize: '1rem'
            }}>
              <thead>
                <tr style={{
                  background: 'linear-gradient(45deg, #667eea, #764ba2)',
                  color: 'white'
                }}>
                  <th style={{
                    padding: '20px 15px',
                    textAlign: 'left',
                    fontWeight: '600',
                    fontSize: '1.1rem'
                  }}>GR No</th>
                  <th style={{
                    padding: '20px 15px',
                    textAlign: 'left',
                    fontWeight: '600',
                    fontSize: '1.1rem'
                  }}>Roll No</th>
                  <th style={{
                    padding: '20px 15px',
                    textAlign: 'left',
                    fontWeight: '600',
                    fontSize: '1.1rem'
                  }}>Student Name</th>
                  <th style={{
                    padding: '20px 15px',
                    textAlign: 'center',
                    fontWeight: '600',
                    fontSize: '1.1rem'
                  }}>Attendance</th>
                </tr>
              </thead>
              <tbody>
                {students.map((student, index) => (
                  <tr 
                    key={index}
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
                    }}>
                      {`${GR_PREFIX}${String(index + 1).padStart(2, '0')}`}
                    </td>
                    <td style={{
                      padding: '15px',
                      color: '#495057',
                      fontWeight: '500'
                    }}>
                      {student.roll_no}
                    </td>
                    <td style={{
                      padding: '15px',
                      color: '#495057',
                      fontWeight: '500'
                    }}>
                      {student.name}
                    </td>
                    <td style={{
                      padding: '15px',
                      textAlign: 'center'
                    }}>
                      <label style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        cursor: 'pointer',
                        position: 'relative'
                      }}>
                        <input
                          type="checkbox"
                          checked={student.attendance === 1}
                          onChange={(e) => handleAttendanceChange(index, e.target.checked)}
                          style={{
                            appearance: 'none',
                            width: '24px',
                            height: '24px',
                            border: '2px solid #dee2e6',
                            borderRadius: '6px',
                            background: student.attendance === 1 
                              ? 'linear-gradient(45deg, #2ecc71, #27ae60)' 
                              : 'white',
                            cursor: 'pointer',
                            transition: 'all 0.3s ease',
                            position: 'relative'
                          }}
                        />
                        {student.attendance === 1 && (
                          <span style={{
                            position: 'absolute',
                            left: '4px',
                            top: '2px',
                            color: 'white',
                            fontSize: '16px',
                            fontWeight: 'bold',
                            pointerEvents: 'none'
                          }}>
                            ✓
                          </span>
                        )}
                      </label>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : date ? (
          <div style={{
            textAlign: 'center',
            padding: '3rem',
            background: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
            borderRadius: '15px',
            fontSize: '1.2rem',
            color: '#495057',
            marginBottom: '2rem'
          }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📚</div>
            <div style={{ fontWeight: '600' }}>No student data found</div>
            <div style={{ fontSize: '1rem', marginTop: '0.5rem', opacity: 0.8 }}>
              Please check if the date and subject are correct
            </div>
          </div>
        ) : (
          <div style={{
            textAlign: 'center',
            padding: '3rem',
            background: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)',
            borderRadius: '15px',
            fontSize: '1.2rem',
            color: '#495057',
            marginBottom: '2rem'
          }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📅</div>
            <div style={{ fontWeight: '600' }}>Please select a date</div>
            <div style={{ fontSize: '1rem', marginTop: '0.5rem', opacity: 0.8 }}>
              Choose a date to view and mark attendance
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div style={{
          display: 'flex',
          gap: '1rem',
          justifyContent: 'center',
          flexWrap: 'wrap'
        }}>
          <button
            onClick={handleAttendanceSubmit}
            disabled={!date || students.length === 0}
            style={{
              background: (!date || students.length === 0) 
                ? '#6c757d' 
                : 'linear-gradient(45deg, #667eea, #764ba2)',
              color: 'white',
              border: 'none',
              padding: '15px 30px',
              borderRadius: '25px',
              fontSize: '1.1rem',
              fontWeight: '600',
              cursor: (!date || students.length === 0) ? 'not-allowed' : 'pointer',
              transition: 'all 0.3s ease',
              boxShadow: '0 4px 15px rgba(102, 126, 234, 0.3)',
              minWidth: '200px'
            }}
            onMouseOver={(e) => {
              if (date && students.length > 0) {
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 6px 20px rgba(102, 126, 234, 0.4)';
              }
            }}
            onMouseOut={(e) => {
              if (date && students.length > 0) {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 4px 15px rgba(102, 126, 234, 0.3)';
              }
            }}
          >
            💾 Submit Attendance
          </button>

          <button
            onClick={goToDefaulterPage}
            style={{
              background: 'linear-gradient(45deg, #ff6b6b, #ee5a24)',
              color: 'white',
              border: 'none',
              padding: '15px 30px',
              borderRadius: '25px',
              fontSize: '1.1rem',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              boxShadow: '0 4px 15px rgba(255, 107, 107, 0.3)',
              minWidth: '200px'
            }}
            onMouseOver={(e) => {
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.boxShadow = '0 6px 20px rgba(255, 107, 107, 0.4)';
            }}
            onMouseOut={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = '0 4px 15px rgba(255, 107, 107, 0.3)';
            }}
          >
            📊 Defaulters List
          </button>
        </div>
      </div>
    </div>
  );
};

export default Attendance;