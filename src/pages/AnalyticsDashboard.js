import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import {
  LineChart, Line, PieChart, Pie, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell
} from 'recharts';

const AnalyticsDashboard = () => {
  const { subjectCode } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`/api/analytics/${subjectCode}`)
      .then(res => {
        if (res.data.success) {
          setData(res.data.data);
        } else {
          console.error('API error', res.data);
        }
      })
      .catch(err => console.error('Fetch error', err))
      .finally(() => setLoading(false));
  }, [subjectCode]);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading analytics...</p>
      </div>
    );
  }
  
  if (!data) {
    return (
      <div className="no-data-container">
        <div className="no-data-icon">📊</div>
        <h3>No Analytics Available</h3>
        <p>Unable to fetch analytics data for this subject.</p>
      </div>
    );
  }

  const {
    overallStats = {},
    attendanceTrends = [],
    topPerformers = [],
    defaulters = [],
    attendanceDistribution = [],
    weeklyTrends = []
  } = data;

  const COLORS = ['#4f46e5', '#06b6d4', '#10b981', '#f59e0b', '#ef4444'];
  const GRADIENT_COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#f97316'];

  // Custom tooltip for better data display
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-tooltip">
          <p className="tooltip-label">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} className="tooltip-value" style={{ color: entry.color }}>
              {entry.name}: {entry.value}
              {entry.dataKey === 'percentage' ? '%' : ''}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1 className="dashboard-title">Attendance Analytics</h1>
        <div className="subject-badge">{subjectCode}</div>
      </div>

      <div className="stats-section">
        <div className="stat-card primary">
          <div className="stat-icon">👥</div>
          <div className="stat-content">
            <div className="stat-number">{overallStats.totalStudents ?? '-'}</div>
            <div className="stat-label">Total Students</div>
          </div>
        </div>
        <div className="stat-card secondary">
          <div className="stat-icon">📅</div>
          <div className="stat-content">
            <div className="stat-number">{overallStats.classesHeld ?? '-'}</div>
            <div className="stat-label">Classes Held</div>
          </div>
        </div>
        <div className="stat-card accent">
          <div className="stat-icon">📈</div>
          <div className="stat-content">
            <div className="stat-number">{overallStats.averageAttendance ?? '0.00'}%</div>
            <div className="stat-label">Avg Attendance</div>
          </div>
        </div>
        <div className="stat-card warning">
          <div className="stat-icon">⚠️</div>
          <div className="stat-content">
            <div className="stat-number">{overallStats.defaultersCount ?? '-'}</div>
            <div className="stat-label">Defaulters</div>
          </div>
        </div>
      </div>

      <div className="charts-grid">
        {!!attendanceTrends.length && (
          <div className="chart-card full-width">
            <div className="chart-header">
              <h3 className="chart-title">Daily Attendance Trends</h3>
              <div className="chart-subtitle">Track attendance patterns over time</div>
            </div>
            <ResponsiveContainer width="100%" height={320}>
              <LineChart data={attendanceTrends} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                <defs>
                  <linearGradient id="attendanceGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis 
                  dataKey="date" 
                  stroke="#64748b"
                  fontSize={12}
                  tickLine={false}
                />
                <YAxis 
                  stroke="#64748b"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="percentage" 
                  stroke="#6366f1" 
                  strokeWidth={3}
                  dot={{ fill: '#6366f1', strokeWidth: 2, r: 6 }}
                  activeDot={{ r: 8, stroke: '#6366f1', strokeWidth: 2 }}
                  name="Attendance %"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}

        <div className="charts-row">
          {!!attendanceDistribution.length && (
            <div className="chart-card">
              <div className="chart-header">
                <h3 className="chart-title">Attendance Distribution</h3>
                <div className="chart-subtitle">Student performance ranges</div>
              </div>
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <defs>
                    {COLORS.map((color, index) => (
                      <linearGradient key={index} id={`pieGradient${index}`} x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0%" stopColor={color} stopOpacity={0.8}/>
                        <stop offset="100%" stopColor={color} stopOpacity={0.6}/>
                      </linearGradient>
                    ))}
                  </defs>
                  <Pie
                    data={attendanceDistribution}
                    dataKey="count"
                    nameKey="range"
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={2}
                    label={({ range, percent }) => `${range}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {attendanceDistribution.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={`url(#pieGradient${index % COLORS.length})`}
                        stroke="#fff"
                        strokeWidth={2}
                      />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}

          {!!weeklyTrends.length && (
            <div className="chart-card">
              <div className="chart-header">
                <h3 className="chart-title">Weekly Trends</h3>
                <div className="chart-subtitle">Present vs Absent comparison</div>
              </div>
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={weeklyTrends} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                  <defs>
                    <linearGradient id="presentGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0.6}/>
                    </linearGradient>
                    <linearGradient id="absentGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ef4444" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#ef4444" stopOpacity={0.6}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis 
                    dataKey="week" 
                    stroke="#64748b"
                    fontSize={12}
                    tickLine={false}
                  />
                  <YAxis 
                    stroke="#64748b"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Bar 
                    dataKey="present" 
                    fill="url(#presentGradient)" 
                    name="Present"
                    radius={[4, 4, 0, 0]}
                  />
                  <Bar 
                    dataKey="absent" 
                    fill="url(#absentGradient)" 
                    name="Absent"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        {!!topPerformers.length && (
          <div className="chart-card">
            <div className="chart-header">
              <h3 className="chart-title">Top Performers</h3>
              <div className="chart-subtitle">Students with highest attendance</div>
            </div>
            <div className="table-container">
              <table className="data-table modern">
                <thead>
                  <tr>
                    <th>Rank</th>
                    <th>Name</th>
                    <th>Roll No</th>
                    <th>Attendance</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {topPerformers.map((s, i) => (
                    <tr key={i} className="performer-row">
                      <td>
                        <div className="rank-badge">{i + 1}</div>
                      </td>
                      <td className="student-name">{s.name}</td>
                      <td className="roll-number">{s.rollNo}</td>
                      <td>
                        <div className="percentage-cell">
                          <div className="percentage-bar">
                            <div 
                              className="percentage-fill good" 
                              style={{ width: `${s.percentage}%` }}
                            ></div>
                          </div>
                          <span className="percentage-text">{s.percentage}%</span>
                        </div>
                      </td>
                      <td>
                        <span className={`status-badge ${s.percentage >= 75 ? 'good' : 'warning'}`}>
                          {s.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {!!defaulters.length && (
          <div className="chart-card critical">
            <div className="chart-header">
              <h3 className="chart-title">Defaulters (Below 75%)</h3>
              <div className="chart-subtitle">Students requiring attention</div>
            </div>
            <div className="table-container">
              <table className="data-table modern critical-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Roll No</th>
                    <th>Attendance</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {defaulters.map((s, i) => (
                    <tr key={i} className="defaulter-row">
                      <td className="student-name">{s.name}</td>
                      <td className="roll-number">{s.rollNo}</td>
                      <td>
                        <div className="percentage-cell">
                          <div className="percentage-bar">
                            <div 
                              className={`percentage-fill ${s.percentage < 60 ? 'critical' : 'warning'}`}
                              style={{ width: `${s.percentage}%` }}
                            ></div>
                          </div>
                          <span className="percentage-text">{s.percentage}%</span>
                        </div>
                      </td>
                      <td>
                        <span className={`status-badge ${s.percentage < 60 ? 'critical' : 'warning'}`}>
                          {s.status}
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

      <style jsx>{`
        .dashboard-container {
          padding: 2rem;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          min-height: 100vh;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }

        .dashboard-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 2rem;
          padding: 1.5rem 0;
        }

        .dashboard-title {
          color: white;
          font-size: 2.5rem;
          font-weight: 700;
          margin: 0;
          text-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }

        .subject-badge {
          background: rgba(255,255,255,0.2);
          color: white;
          padding: 0.75rem 1.5rem;
          border-radius: 50px;
          font-weight: 600;
          font-size: 1.1rem;
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255,255,255,0.3);
        }

        .loading-container, .no-data-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 50vh;
          color: white;
          text-align: center;
        }

        .loading-spinner {
          width: 50px;
          height: 50px;
          border: 4px solid rgba(255,255,255,0.3);
          border-top: 4px solid white;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin-bottom: 1rem;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .no-data-icon {
          font-size: 4rem;
          margin-bottom: 1rem;
        }

        .stats-section {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 1.5rem;
          margin-bottom: 2rem;
        }

        .stat-card {
          background: rgba(255,255,255,0.95);
          padding: 2rem;
          border-radius: 16px;
          display: flex;
          align-items: center;
          gap: 1rem;
          box-shadow: 0 8px 32px rgba(0,0,0,0.1);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255,255,255,0.2);
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }

        .stat-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 40px rgba(0,0,0,0.15);
        }

        .stat-icon {
          font-size: 2.5rem;
          opacity: 0.8;
        }

        .stat-content {
          flex: 1;
        }

        .stat-number {
          font-size: 2rem;
          font-weight: 700;
          color: #1e293b;
          line-height: 1;
        }

        .stat-label {
          font-size: 0.9rem;
          color: #64748b;
          font-weight: 500;
          margin-top: 0.25rem;
        }

        .stat-card.primary .stat-number { color: #4f46e5; }
        .stat-card.secondary .stat-number { color: #06b6d4; }
        .stat-card.accent .stat-number { color: #10b981; }
        .stat-card.warning .stat-number { color: #f59e0b; }

        .charts-grid {
          display: flex;
          flex-direction: column;
          gap: 2rem;
        }

        .charts-row {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
          gap: 2rem;
        }

        .chart-card {
          background: rgba(255,255,255,0.95);
          border-radius: 16px;
          padding: 2rem;
          box-shadow: 0 8px 32px rgba(0,0,0,0.1);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255,255,255,0.2);
          transition: transform 0.3s ease;
        }

        .chart-card:hover {
          transform: translateY(-2px);
        }

        .chart-card.full-width {
          grid-column: 1 / -1;
        }

        .chart-card.critical {
          border-left: 4px solid #ef4444;
        }

        .chart-header {
          margin-bottom: 1.5rem;
        }

        .chart-title {
          font-size: 1.25rem;
          font-weight: 600;
          color: #1e293b;
          margin: 0 0 0.25rem 0;
        }

        .chart-subtitle {
          font-size: 0.875rem;
          color: #64748b;
        }

        .custom-tooltip {
          background: rgba(0,0,0,0.8);
          border: none;
          border-radius: 8px;
          padding: 0.75rem;
          color: white;
          font-size: 0.875rem;
          box-shadow: 0 4px 16px rgba(0,0,0,0.2);
        }

        .tooltip-label {
          font-weight: 600;
          margin: 0 0 0.25rem 0;
        }

        .tooltip-value {
          margin: 0.125rem 0;
        }

        .table-container {
          overflow-x: auto;
          border-radius: 8px;
          border: 1px solid #e2e8f0;
        }

        .data-table {
          width: 100%;
          border-collapse: collapse;
          background: white;
        }

        .data-table.modern th {
          background: #f8fafc;
          padding: 1rem;
          text-align: left;
          font-weight: 600;
          color: #374151;
          border-bottom: 2px solid #e5e7eb;
          font-size: 0.875rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .data-table.modern td {
          padding: 1rem;
          border-bottom: 1px solid #f1f5f9;
          vertical-align: middle;
        }

        .data-table.modern tr:hover {
          background: #f8fafc;
        }

        .rank-badge {
          width: 2rem;
          height: 2rem;
          background: linear-gradient(135deg, #6366f1, #8b5cf6);
          color: white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 600;
          font-size: 0.875rem;
        }

        .student-name {
          font-weight: 600;
          color: #1e293b;
        }

        .roll-number {
          color: #64748b;
          font-family: monospace;
        }

        .percentage-cell {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .percentage-bar {
          flex: 1;
          height: 8px;
          background: #e2e8f0;
          border-radius: 4px;
          overflow: hidden;
        }

        .percentage-fill {
          height: 100%;
          border-radius: 4px;
          transition: width 0.3s ease;
        }

        .percentage-fill.good {
          background: linear-gradient(90deg, #10b981, #34d399);
        }

        .percentage-fill.warning {
          background: linear-gradient(90deg, #f59e0b, #fbbf24);
        }

        .percentage-fill.critical {
          background: linear-gradient(90deg, #ef4444, #f87171);
        }

        .percentage-text {
          font-weight: 600;
          font-size: 0.875rem;
          min-width: 3rem;
          text-align: right;
        }

        .status-badge {
          padding: 0.375rem 0.75rem;
          border-radius: 20px;
          font-size: 0.75rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .status-badge.good {
          background: #dcfce7;
          color: #166534;
        }

        .status-badge.warning {
          background: #fef3c7;
          color: #92400e;
        }

        .status-badge.critical {
          background: #fee2e2;
          color: #991b1b;
        }

        .critical-table tr {
          background: rgba(254, 226, 226, 0.3);
        }

        .critical-table tr:hover {
          background: rgba(254, 226, 226, 0.5);
        }

        @media (max-width: 768px) {
          .dashboard-container {
            padding: 1rem;
          }
          
          .dashboard-title {
            font-size: 2rem;
          }
          
          .stats-section {
            grid-template-columns: 1fr;
          }
          
          .charts-row {
            grid-template-columns: 1fr;
          }
          
          .stat-card {
            padding: 1.5rem;
          }
          
          .chart-card {
            padding: 1.5rem;
          }
        }
      `}</style>
    </div>
  );
};

export default AnalyticsDashboard;