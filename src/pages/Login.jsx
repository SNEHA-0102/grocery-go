import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { ref, update } from 'firebase/database';
import { db } from '../../firebaseConfig';
import ForgotPassword from './ForgotPassword'; // <-- Import it
import './Login.css';

const Login = ({ isOpen, onClose, onSwitch }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [forgotOpen, setForgotOpen] = useState(false); // <-- New: control Forgot Password modal
  const { login } = useAuth();

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setError('');
      setLoading(true);
      
      // Login with Firebase Authentication
      const userCredential = await login(email, password);
      const user = userCredential.user;
      
      // Update user status in Realtime Database
      await update(ref(db, 'users/' + user.uid), {
        lastLogin: new Date().toISOString(),
        isOnline: true
      });
      
      onClose(); // Close modal after successful login
    } catch (error) {
      setError('Failed to log in: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleOutsideClick = (e) => {
    if (e.target.className === 'login-modal-overlay') {
      onClose();
    }
  };

  const openForgotPassword = (e) => {
    e.preventDefault();
    setForgotOpen(true); // <-- Open ForgotPassword modal
  };

  return (
    <>
      <div className="login-modal-overlay" onClick={handleOutsideClick}>
        <div className="login-modal-container">
          <div className="login-modal-content">
            <button className="close-btn" onClick={onClose}>×</button>
            
            <div className="login-panel">
              <h2>Login</h2>
              
              {error && <div className="error-message">{error}</div>}
              
              <form onSubmit={handleSubmit}>
                <div className="input-group">
                  <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
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
                
                <div className="remember-forgot">
                  <label>
                    <input type="checkbox" /> Remember me
                  </label>
                  <a href="#" className="forgot-link" onClick={openForgotPassword}>
                    Forgot Password?
                  </a>
                </div>
                
                <button
                  type="submit"
                  className="login-button"
                  disabled={loading}
                >
                  {loading ? 'Logging In...' : 'Login'}
                </button>
                
                <p className="signup-prompt">
                  Don't have an account? <button type="button" onClick={onSwitch} className="switch-link">Sign Up</button>
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* ForgotPassword Modal */}
      <ForgotPassword 
        isOpen={forgotOpen}
        onClose={() => setForgotOpen(false)}
        initialEmail={email} // prefill email if already typed
      />
    </>
  );
};

export default Login;
