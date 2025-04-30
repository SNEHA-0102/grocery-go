// src/components/ForgotPassword.js
import React, { useState, useEffect } from 'react';
import './ForgotPassword.css';
import { useAuth } from '../context/AuthContext';

const ForgotPassword = ({ isOpen, onClose, onSuccess, initialEmail = '' }) => {
  const { resetPassword } = useAuth();
  const [email, setEmail] = useState(initialEmail);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Update email when initialEmail prop changes
  useEffect(() => {
    setEmail(initialEmail);
  }, [initialEmail]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email.trim()) {
      setError('Please enter your email address');
      return;
    }
    
    try {
      setError('');
      setLoading(true);
      await resetPassword(email);
      
      // Call the success callback if provided
      if (onSuccess) {
        onSuccess();
      } else {
        // Default behavior if no success callback
        alert('Password reset email sent!');
        onClose();
      }
    } catch (error) {
      setError('Failed to send password reset email: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleOutsideClick = (e) => {
    if (e.target.className === 'forgot-modal-overlay') {
      onClose();
    }
  };

  return (
    <div className="forgot-modal-overlay" onClick={handleOutsideClick}>
      <div className="forgot-modal-container">
        <div className="forgot-modal-content">
          <button className="close-btn" onClick={onClose}>×</button>
          
          <div className="forgot-panel">
            <h2>Reset Password</h2>
            
            {error && <div className="error-message">{error}</div>}
            
            <p className="reset-instructions">
              Enter your email address and we'll send you a link to reset your password.
            </p>
            
            <form onSubmit={handleSubmit}>
              <div className="input-group">
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              
              <button 
                type="submit" 
                className="reset-button"
                disabled={loading}
              >
                {loading ? 'Sending...' : 'Send Reset Link'}
              </button>
              
              <button 
                type="button" 
                className="cancel-button"
                onClick={onClose}
              >
                Cancel
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;