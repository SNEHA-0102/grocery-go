// src/components/Navbar.js
import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom'; // ✅ Added useNavigate
import { useAuth } from '../context/AuthContext';
import AuthModals from './AuthModals';
import './Navbar.css';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSticky, setIsSticky] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState('login');
  const [cartItemCount, setCartItemCount] = useState(0);
  const { currentUser, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate(); // ✅

  useEffect(() => {
    const handleScroll = () => {
      setIsSticky(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const updateCartCount = () => {
      const cart = JSON.parse(localStorage.getItem('cart')) || [];
      const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
      setCartItemCount(totalItems);
    };
    updateCartCount();
    window.addEventListener('storage', updateCartCount);
    window.addEventListener('cartUpdated', updateCartCount);
    return () => {
      window.removeEventListener('storage', updateCartCount);
      window.removeEventListener('cartUpdated', updateCartCount);
    };
  }, []);

  useEffect(() => {
    setIsMenuOpen(false); // Close mobile menu on route change
  }, [location]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleOpenLogin = () => {
    setAuthMode('login');
    setShowAuthModal(true);
    setIsMenuOpen(false);
  };

  const handleOpenSignup = () => {
    setAuthMode('signup');
    setShowAuthModal(true);
    setIsMenuOpen(false);
  };

  const handleCloseAuthModal = () => {
    setShowAuthModal(false);
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Failed to log out', error);
    }
  };

  const handleProfileClick = () => {
    navigate('/profile'); // ✅ Redirect to profile page
  };

  return (
    <>
      <header className={`navbar ${isSticky ? 'sticky' : ''}`}>
        <div className="navbar-container">
          <Link to="/" className="navbar-logo">
            GroceryGo
          </Link>

          {/* Hamburger for Mobile */}
          <div className="hamburger" onClick={toggleMenu}>
            <span className={`bar ${isMenuOpen ? 'active' : ''}`}></span>
            <span className={`bar ${isMenuOpen ? 'active' : ''}`}></span>
            <span className={`bar ${isMenuOpen ? 'active' : ''}`}></span>
          </div>

          {/* Nav Menu */}
          <nav className={`nav-menu ${isMenuOpen ? 'active' : ''}`}>
            <ul className="nav-list">
              <li className="nav-item">
                <Link to="/" className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}>Home</Link>
              </li>
              <li className="nav-item">
                <Link to="/categories" className={`nav-link ${location.pathname === '/categories' ? 'active' : ''}`}>Categories</Link>
              </li>
              <li className="nav-item">
                <Link to="/offers" className={`nav-link ${location.pathname === '/offers' ? 'active' : ''}`}>Offers</Link>
              </li>
              <li className="nav-item">
                <Link to="/contact" className={`nav-link ${location.pathname === '/contact' ? 'active' : ''}`}>Contact</Link>
              </li>
            </ul>
          </nav>

          {/* Navbar Actions */}
          <div className="nav-actions">
            {/* Profile button only if logged in */}
            {currentUser && (
              <button 
                className="action-btn profile-btn" 
                onClick={handleProfileClick} // ✅
              >
                <svg className="profile-icon" viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
              </button>
            )}

            {/* Cart button (always visible) */}
            <Link to="/cart" className="action-btn cart-btn">
              <svg className="cart-icon" viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none">
                <circle cx="9" cy="21" r="1"></circle>
                <circle cx="20" cy="21" r="1"></circle>
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
              </svg>
              <span className="cart-count">{cartItemCount}</span>
            </Link>

            {/* Auth Buttons */}
            <div className="auth-buttons">
              {currentUser ? (
                <>
                  <span className="welcome-text">Welcome, {currentUser.email}</span>
                  <button className="login-btn" onClick={handleLogout}>Logout</button>
                </>
              ) : (
                <>
                  <button className="login-btn" onClick={handleOpenLogin}>Login</button>
                  <button className="signup-btn" onClick={handleOpenSignup}>Sign Up</button>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Login/Signup Modal */}
      {showAuthModal && (
        <AuthModals 
          initialMode={authMode}
          onClose={handleCloseAuthModal}
        />
      )}
    </>
  );
};

export default Navbar;
