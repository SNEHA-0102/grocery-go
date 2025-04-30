import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { ref, set } from 'firebase/database';
import { db } from '../../firebaseConfig';
import './SignUp.css';  // typo corrected

const SignUp = ({ isOpen, onClose, onSwitch }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signup } = useAuth();

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      return setError('Passwords do not match!');
    }

    if (password.length < 6) {
      return setError('Password must be at least 6 characters.');
    }

    if (!name.trim()) {
      return setError('Full name is required.');
    }

    try {
      setError('');
      setLoading(true);

      // Create user in Firebase Auth
      const userCredential = await signup(email, password);
      const user = userCredential.user;

      // Create user profile in Realtime DB
      await set(ref(db, 'users/' + user.uid), {
        name: name,          // save name (not username)
        email: email,
        phone: '',           // initially empty, user can edit later
        address: '',
        createdAt: new Date().toISOString(),
        lastLogin: new Date().toISOString(),
        isOnline: true
      });

      onClose(); // Close modal
    } catch (error) {
      setError('Failed to create an account: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleOutsideClick = (e) => {
    if (e.target.className === 'signup-modal-overlay') {
      onClose();
    }
  };

  return (
    <div className="signup-modal-overlay" onClick={handleOutsideClick}>
      <div className="signup-modal-container">
        <div className="signup-modal-content">
          <button className="close-btn" onClick={onClose}>×</button>

          <div className="signup-panel">
            <h2>Sign Up</h2>

            {error && <div className="error-message">{error}</div>}

            <form onSubmit={handleSubmit}>
              <div className="input-group">
                <input
                  type="text"
                  placeholder="Full Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div className="input-group">
                <input
                  type="email"
                  placeholder="Email Address"
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

              <div className="input-group">
                <input
                  type="password"
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>

              <button
                type="submit"
                className="signup-button"
                disabled={loading}
              >
                {loading ? 'Creating Account...' : 'Sign Up'}
              </button>

              <p className="login-prompt">
                Already have an account? <button type="button" onClick={onSwitch} className="switch-link">Login</button>
              </p>

              <p className="terms-text">
                By signing up, you agree to our <a href="#">Terms</a> and <a href="#">Privacy Policy</a>.
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;






