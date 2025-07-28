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

  return (
    <div className="attendance-container">
      <h1>B.Tech AIDS - 2nd Year</h1>
      <h2>{subjectCode} - Attendance</h2>
      <div className="date-section">
        <label>Select Date: </label>
        <input type="date" value={date} onChange={handleDateChange} />
      </div>
      <table>
        <thead>
          <tr>
            <th>GR No</th>
            <th>Roll No</th>
            <th>Student Name</th>
            <th>Attendance</th>
          </tr>
        </thead>
        <tbody>
          {students.map((student, index) => (
            <tr key={index}>
              <td>{`${GR_PREFIX}${String(index + 1).padStart(2, '0')}`}</td>
              <td>{student.roll_no}</td>
              <td>{student.name}</td>
              <td>
                <input
                  type="checkbox"
                  checked={student.attendance === 1}
                  onChange={(e) => handleAttendanceChange(index, e.target.checked)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button onClick={handleAttendanceSubmit}>Submit Attendance</button>

      {/* Button to navigate to the Defaulter List */}
      <button onClick={goToDefaulterPage}>Defaulters List</button>
    </div>
  );
};

export default Attendance;
