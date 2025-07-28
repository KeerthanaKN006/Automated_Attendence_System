// App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './pages/Login';
import DivisionCat from './pages/DivisionCat';
import Attendance from './pages/Attendance';
import DefaultersPage from './pages/DefaultersPage';  // Import DefaulterPage component
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/division" element={<DivisionCat />} />
        <Route path="/attendance/:subjectCode" element={<Attendance />} />
        
        {/* Add a route for the DefaulterPage */}
        <Route path="/defaulters" element={<DefaultersPage />} />
      </Routes>
    </Router>
  );
}

export default App;
