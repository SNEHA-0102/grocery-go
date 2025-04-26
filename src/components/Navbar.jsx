import React, { useState, useEffect } from 'react';
import './Navbar.css';
import Login from '../pages/Login';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSticky, setIsSticky] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  // Handle scroll for sticky behavior
  useEffect(() => {
    const handleScroll = () => {
      setIsSticky(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const openLogin = () => {
    setIsLoginOpen(true);
    setIsMenuOpen(false); // Close menu when login is opened
  };

  const closeLogin = () => {
    setIsLoginOpen(false);
  };

  return (
    <>
      <header className={`navbar ${isSticky ? 'sticky' : ''}`}>
        <div className="navbar-container">
          <a href="/" className="navbar-logo">
            GroceryGo
            <svg className="cart-svg" viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none">
              <circle cx="9" cy="21" r="1"></circle>
              <circle cx="20" cy="21" r="1"></circle>
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
            </svg>
          </a>
          
          <div className="hamburger" onClick={toggleMenu}>
            <span className={`bar ${isMenuOpen ? 'active' : ''}`}></span>
            <span className={`bar ${isMenuOpen ? 'active' : ''}`}></span>
            <span className={`bar ${isMenuOpen ? 'active' : ''}`}></span>
          </div>
          
          <nav className={`nav-menu ${isMenuOpen ? 'active' : ''}`}>
            <ul className="nav-list">
              <li className="nav-item"><a href="/" className="nav-link">Home</a></li>
              <li className="nav-item"><a href="/shop" className="nav-link">Shop</a></li>
              <li className="nav-item"><a href="/categories" className="nav-link">Categories</a></li>
              <li className="nav-item"><a href="/offers" className="nav-link">Offers</a></li>
              <li className="nav-item"><a href="/contact" className="nav-link">Contact</a></li>
              {/* Mobile login/signup buttons */}
              <li className="nav-item mobile-auth">
                <button className="login-btn mobile-login-btn" onClick={openLogin}>Login</button>
                <button className="signup-btn mobile-signup-btn">Sign Up</button>
              </li>
            </ul>
          </nav>
          
          <div className="nav-actions">
            <div className="search-container">
              <input type="text" className="search-input" placeholder="Search products..." />
              <button className="search-button">
                <svg className="search-icon" viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none">
                  <circle cx="11" cy="11" r="8"></circle>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                </svg>
              </button>
            </div>
            
            <button className="action-btn profile-btn">
              <svg className="profile-icon" viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
            </button>
            
            <button className="action-btn cart-btn">
              <svg className="cart-icon" viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none">
                <circle cx="9" cy="21" r="1"></circle>
                <circle cx="20" cy="21" r="1"></circle>
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
              </svg>
              <span className="cart-count">0</span>
            </button>
            
            <div className="auth-buttons">
              <button className="login-btn" onClick={openLogin}>Login</button>
              <button className="signup-btn">Sign Up</button>
            </div>
          </div>
        </div>
      </header>
      
      {/* Login Modal */}
      <Login isOpen={isLoginOpen} onClose={closeLogin} />
    </>
  );
};

export default Navbar;