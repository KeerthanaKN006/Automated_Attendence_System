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
    navigate(`/attendance/${subjectCode}`); // Corrected to use a string template literal
  };

  return (
    <div className="division-container">
      <h1>Branch: Artificial Intelligence and Data Science</h1>
      <div className="form-section">
        <label htmlFor="semester">Select Semester:</label>
        <select id="semester">
          <option>2024-Odd-Semester</option>
        </select>

        <label htmlFor="class">Select Class:</label>
        <select id="class">
          <option>D6ADA</option>
        </select>
      </div>
      <div className="button-section">
        <button onClick={() => handleSubjectClick('CO321')}>CO321</button>
        <button onClick={() => handleSubjectClick('CO215')}>CO215</button>
        <button onClick={() => handleSubjectClick('CS670')}>CS670</button>
      </div>
    </div>
  );
};

export default DivisionCat;
