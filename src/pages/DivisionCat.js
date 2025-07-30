import React from 'react';
import { useNavigate } from 'react-router-dom';
import './styles/DivisionCat.css';
import axios from 'axios';
import { useEffect, useState } from 'react';

const DivisionCat = () => {
  const navigate = useNavigate();
  const [semesterData, setSemesterData] = useState([]);
  const [classData, setClassData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const semesterResponse = await axios.get('/semesters');
        const classResponse = await axios.get('/classes');
        setSemesterData(semesterResponse.data);
        setClassData(classResponse.data);
      } catch (error) {
        console.error('Error fetching data', error);
      }
    };
    fetchData();
  }, []);

  const handleSubjectClick = (subjectCode) => {
    navigate(`/attendance/${subjectCode}`);
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '2rem',
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
    }}>
      <div style={{
        maxWidth: '800px',
        margin: '0 auto',
        background: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(10px)',
        borderRadius: '20px',
        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1), 0 15px 12px rgba(0, 0, 0, 0.08)',
        overflow: 'hidden',
        transition: 'transform 0.3s ease, box-shadow 0.3s ease'
      }}>
        <div style={{
          background: 'linear-gradient(135deg, #fefefeff 0%, #ffffffff 100%)',
          color: 'white',
          padding: '2.5rem 2rem',
          textAlign: 'center'
        }}>
          <h1 style={{
            fontSize: '2.2rem',
            fontWeight: '700',
            margin: '0',
            textShadow: '0 2px 4px rgba(255, 255, 255, 0.3)',
            letterSpacing: '-0.5px'
          }}>
            Branch: Artificial Intelligence and Data Science
          </h1>
        </div>
        
        <div style={{ padding: '3rem 2rem' }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: window.innerWidth > 768 ? '1fr 1fr' : '1fr',
            gap: '2rem',
            marginBottom: '3rem'
          }}>
            <div>
              <label style={{
                display: 'block',
                fontWeight: '600',
                color: '#2d3748',
                marginBottom: '0.75rem',
                fontSize: '1.1rem',
                letterSpacing: '0.025em'
              }}>
                Select Semester:
              </label>
              <select style={{
                width: '100%',
                padding: '1rem 1.25rem',
                border: '2px solid #e2e8f0',
                borderRadius: '12px',
                fontSize: '1rem',
                background: 'white',
                color: '#2d3748',
                transition: 'all 0.3s ease',
                appearance: 'none',
                backgroundImage: "url(\"data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6,9 12,15 18,9'%3e%3c/polyline%3e%3c/svg%3e\")",
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'right 1rem center',
                backgroundSize: '1rem',
                cursor: 'pointer'
              }}>
                <option>2024-Odd-Semester</option>
              </select>
            </div>
            
            <div>
              <label style={{
                display: 'block',
                fontWeight: '600',
                color: '#081c3fff',
                marginBottom: '0.75rem',
                fontSize: '1.1rem',
                letterSpacing: '0.025em'
              }}>
                Select Class:
              </label>
              <select style={{
                width: '100%',
                padding: '1rem 1.25rem',
                border: '2px solid #e2e8f0',
                borderRadius: '12px',
                fontSize: '1rem',
                background: 'white',
                color: '#2d3748',
                transition: 'all 0.3s ease',
                appearance: 'none',
                backgroundImage: "url(\"data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6,9 12,15 18,9'%3e%3c/polyline%3e%3c/svg%3e\")",
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'right 1rem center',
                backgroundSize: '1rem',
                cursor: 'pointer'
              }}>
                <option>D6ADA</option>
              </select>
            </div>
          </div>
          
          <div style={{ textAlign: 'center' }}>
            <h2 style={{
              fontSize: '1.5rem',
              fontWeight: '600',
              color: '#250f50ff',
              marginBottom: '2rem',
              position: 'relative',
              display: 'inline-block'
            }}>
              Subjects
              <span style={{
                content: '""',
                position: 'absolute',
                bottom: '-8px',
                left: '50%',
                transform: 'translateX(-50%)',
                width: '60px',
                height: '3px',
                background: 'linear-gradient(90deg, #667eea, #764ba2)',
                borderRadius: '2px',
                display: 'block'
              }}></span>
            </h2>
            
            <div style={{
              display: 'grid',
              gridTemplateColumns: window.innerWidth > 640 ? 'repeat(auto-fit, minmax(200px, 1fr))' : '1fr',
              gap: '1.5rem',
              marginTop: '2rem'
            }}>
              <button 
                onClick={() => handleSubjectClick('CO321')}
                style={{
                  padding: '1.5rem 2rem',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '15px',
                  fontSize: '1.1rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  position: 'relative',
                  overflow: 'hidden',
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                  boxShadow: '0 4px 15px rgba(102, 126, 234, 0.3)'
                }}
                onMouseEnter={(e) => {
                  e.target.style.transform = 'translateY(-3px) scale(1.05)';
                  e.target.style.boxShadow = '0 8px 25px rgba(102, 126, 234, 0.4)';
                  e.target.style.background = 'linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'translateY(0) scale(1)';
                  e.target.style.boxShadow = '0 4px 15px rgba(102, 126, 234, 0.3)';
                  e.target.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
                }}
              >
                CO321
              </button>
              
              <button 
                onClick={() => handleSubjectClick('CO215')}
                style={{
                  padding: '1.5rem 2rem',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '15px',
                  fontSize: '1.1rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  position: 'relative',
                  overflow: 'hidden',
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                  boxShadow: '0 4px 15px rgba(102, 126, 234, 0.3)'
                }}
                onMouseEnter={(e) => {
                  e.target.style.transform = 'translateY(-3px) scale(1.05)';
                  e.target.style.boxShadow = '0 8px 25px rgba(102, 126, 234, 0.4)';
                  e.target.style.background = 'linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'translateY(0) scale(1)';
                  e.target.style.boxShadow = '0 4px 15px rgba(102, 126, 234, 0.3)';
                  e.target.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
                }}
              >
                CO215
              </button>
              
              <button 
                onClick={() => handleSubjectClick('CS670')}
                style={{
                  padding: '1.5rem 2rem',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '15px',
                  fontSize: '1.1rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  position: 'relative',
                  overflow: 'hidden',
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                  boxShadow: '0 4px 15px rgba(102, 126, 234, 0.3)'
                }}
                onMouseEnter={(e) => {
                  e.target.style.transform = 'translateY(-3px) scale(1.05)';
                  e.target.style.boxShadow = '0 8px 25px rgba(102, 126, 234, 0.4)';
                  e.target.style.background = 'linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'translateY(0) scale(1)';
                  e.target.style.boxShadow = '0 4px 15px rgba(102, 126, 234, 0.3)';
                  e.target.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
                }}
              >
                CS670
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DivisionCat;