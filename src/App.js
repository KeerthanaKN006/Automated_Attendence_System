import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import DivisionCat from './pages/DivisionCat';
import Attendance from './pages/Attendance';
import DefaultersPage from './pages/DefaultersPage'
import AnalyticsDashboard from './pages/AnalyticsDashboard';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/division" element={<DivisionCat />} />
        <Route path="/attendance/:subjectCode" element={<Attendance />} />
        <Route path="/analytics/:subjectCode" element={<AnalyticsDashboard />} />
        <Route path="/defaulters" element={<DefaultersPage />} />
      </Routes>
    </Router>
  );
}

export default App;
