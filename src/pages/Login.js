import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';


const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate(); // Uncomment when using with React Router

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    try {
      const response = await axios.post('http://localhost:4000/login', { username, password });
      console.log('API Response:', response.data);
      if (response.data.success) {
         navigate('/division');
       } else {
         setErrorMessage(response.data.message || 'Invalid username or password');
       }
      
      // Demo for preview
      console.log('Login attempt:', { username, password });
    } catch (error) {
      console.error('Login failed:', error);
       if (error.response && error.response.data) {
         setErrorMessage(error.response.data.message || 'Something went wrong.');
       } else {
         setErrorMessage('Unable to connect to the server. Please try again.');
       }
    }
  };

  return (
    <>
      <style jsx>{`
       .login-background {
  min-height: 100vh;
  background: linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)),
              url('/vesit.jpg'); /* Correct path if in public/ folder */
  background-size: cover;
  background-position: center;
  background-attachment: fixed;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}


        .login-container {
          background: rgba(255, 255, 255, 0.95);
          padding: 3rem 2.5rem;
          border-radius: 20px;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
          width: 100%;
          max-width: 550px;
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          transform: translateY(0);
          transition: all 0.3s ease;
        }

        .login-container:hover {
          transform: translateY(-5px);
          box-shadow: 0 25px 50px rgba(0, 0, 0, 0.4);
        }

        .login-container h1 {
          text-align: center;
          color: #2c3e50;
          font-size: 2.5rem;
          margin-bottom: 2rem;
          font-weight: 700;
          text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
        }

        .form-group {
          margin-bottom: 1.5rem;
        }

        .form-group label {
          display: block;
          margin-bottom: 0.5rem;
          color: #34495e;
          font-weight: 600;
          font-size: 1rem;
        }

        .form-group input {
          width: 90%;
          padding: 1rem 1.2rem;
          border: 2px solid #e0e0e0;
          border-radius: 12px;
          font-size: 1rem;
          transition: all 0.3s ease;
          background: rgba(255, 255, 255, 0.9);
          color: #2c3e50;
        }

        .form-group input:focus {
          outline: none;
          border-color: #3498db;
          box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.2);
          transform: translateY(-2px);
        }

        .password-input {
          position: relative;
        }

        .password-input input {
          padding-right: 3rem;
        }

        .password-toggle {
          position: absolute;
          right: 1rem;
          top: 50%;
          transform: translateY(-50%);
          cursor: pointer;
          color: #7f8c8d;
          font-size: 1.2rem;
          transition: color 0.3s ease;
        }

        .password-toggle:hover {
          color: #3498db;
        }

        .error-message {
          background: linear-gradient(135deg, #e74c3c, #c0392b);
          color: white;
          padding: 1rem;
          border-radius: 10px;
          margin-bottom: 1rem;
          text-align: center;
          font-weight: 500;
          box-shadow: 0 4px 15px rgba(231, 76, 60, 0.3);
          animation: shake 0.5s ease-in-out;
        }

        .login-button {
          width: 100%;
          padding: 1rem;
          background: linear-gradient(135deg, #3498db, #2980b9);
          color: white;
          border: none;
          border-radius: 12px;
          font-size: 1.1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 4px 15px rgba(52, 152, 219, 0.3);
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        .login-button:hover {
          background: linear-gradient(135deg, #2980b9, #1f4e79);
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(52, 152, 219, 0.4);
        }

        .login-button:active {
          transform: translateY(0);
        }

        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-10px); }
          75% { transform: translateX(10px); }
        }

        @media (max-width: 480px) {
          .login-container {
            margin: 1rem;
            padding: 2rem 1.5rem;
          }
          
          .login-container h1 {
            font-size: 2rem;
          }
        }
      `}</style>

      <div className="login-background">
        <div className="login-container">
          <h1>Login</h1>
          <div onSubmit={handleLogin}>
            <div className="form-group">
              <label htmlFor="username">Username</label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <div className="password-input">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <span className="password-toggle" onClick={togglePasswordVisibility}>
                  {showPassword ? (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 7c2.76 0 5 2.24 5 5 0 .65-.13 1.26-.36 1.83l2.92 2.92c1.51-1.26 2.7-2.89 3.43-4.75-1.73-4.39-6-7.5-11-7.5-1.4 0-2.74.25-3.98.7l2.16 2.16C10.74 7.13 11.35 7 12 7zM2 4.27l2.28 2.28.46.46C3.08 8.3 1.78 10.02 1 12c1.73 4.39 6 7.5 11 7.5 1.55 0 3.03-.3 4.38-.84l.42.42L19.73 22 21 20.73 3.27 3 2 4.27zM7.53 9.8l1.55 1.55c-.05.21-.08.43-.08.65 0 1.66 1.34 3 3 3 .22 0 .44-.03.65-.08l1.55 1.55c-.67.33-1.41.53-2.2.53-2.76 0-5-2.24-5-5 0-.79.2-1.53.53-2.2zm4.31-.78l3.15 3.15.02-.16c0-1.66-1.34-3-3-3l-.17.01z"/>
                    </svg>
                  ) : (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
                    </svg>
                  )}
                </span>
              </div>
            </div>
            {errorMessage && <div className="error-message">{errorMessage}</div>}
            <button type="submit" className="login-button" onClick={handleLogin}>
              Login
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;