// components/Login.jsx
import React, { useState } from 'react';
import './Login.css';

const Login = ({ isOpen, onClose }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [keepLoggedIn, setKeepLoggedIn] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Login submitted', { username, password, keepLoggedIn });
  };

  const handleOutsideClick = (e) => {
    if (e.target.className === 'login-modal-overlay') {
      onClose();
    }
  };

  return (
    <div className="login-modal-overlay" onClick={handleOutsideClick}>
      <div className="login-modal-container">
        <div className="login-modal-content">
          <button className="close-btn" onClick={onClose}>×</button>

          <div className="login-panel">
            <h2>Login</h2>

            <form onSubmit={handleSubmit}>
              <div className="input-group">
                <input 
                  type="text" 
                  placeholder="Email"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>

              <div className="input-group">
                <input 
                  type="password" 
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <div className="remember-me">
                <label>
                  <input 
                    type="checkbox" 
                    checked={keepLoggedIn}
                    onChange={(e) => setKeepLoggedIn(e.target.checked)}
                  />
                  <span>Keep me logged in</span>
                </label>
                <a href="#" className="forgot-password">Forgot Password?</a>
              </div>

              <button type="submit" className="login-button">Login</button>

              <p className="signup-prompt">
                Don't have an account yet? <a href="#">Sign Up</a>
              </p>

              <p className="terms-text">
                By continuing, you accept our <a href="#">Terms</a> and <a href="#">Privacy Policy</a>.
              </p>
            </form>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Login;
