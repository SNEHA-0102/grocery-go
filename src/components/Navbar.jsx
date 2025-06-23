// src/components/Navbar.js
import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ref, onValue, off } from 'firebase/database';
import { db } from '../../firebaseConfig';
import { useAuth } from '../context/AuthContext';
import AuthModals from './AuthModals';
import './Navbar.css';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSticky, setIsSticky] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState('login');
  const [cartItemCount, setCartItemCount] = useState(0);
  const [wishlistItemCount, setWishlistItemCount] = useState(0);
  const { currentUser, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsSticky(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Cart count effect (remains localStorage-based)
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

  // Enhanced Wishlist count effect (Firebase-based with custom event listener)
  useEffect(() => {
    let wishlistRef = null;
    let unsubscribeFirebase = null;

    const updateWishlistCount = () => {
      if (currentUser) {
        wishlistRef = ref(db, `wishlists/${currentUser.uid}`);
        
        unsubscribeFirebase = onValue(wishlistRef, (snapshot) => {
          if (snapshot.exists()) {
            const wishlistData = snapshot.val();
            const itemCount = Object.keys(wishlistData).length;
            setWishlistItemCount(itemCount);
          } else {
            setWishlistItemCount(0);
          }
        }, (error) => {
          console.error('Error fetching wishlist count:', error);
          setWishlistItemCount(0);
        });
      } else {
        setWishlistItemCount(0);
      }
    };

    // Custom event listener for wishlist updates
    const handleWishlistUpdate = () => {
      updateWishlistCount();
    };

    updateWishlistCount();
    
    // Add event listener for wishlist updates
    window.addEventListener('wishlistUpdated', handleWishlistUpdate);

    // Cleanup function
    return () => {
      if (unsubscribeFirebase) {
        unsubscribeFirebase();
      }
      if (wishlistRef) {
        off(wishlistRef);
      }
      window.removeEventListener('wishlistUpdated', handleWishlistUpdate);
    };
  }, [currentUser]);

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
    navigate('/profile');
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
                <Link to="/contact" className={`nav-link ${location.pathname === '/contact' ? 'active' : ''}`}>Contact</Link>
              </li>
            </ul>
            {currentUser && (
              <div className="mobile-welcome-text">
                Welcome, {currentUser.email.length > 20 
                  ? `${currentUser.email.substring(0, 17)}...` 
                  : currentUser.email}
              </div>
            )}
          </nav>

          {/* Navbar Actions */}
          <div className="nav-actions">
            {/* Profile button only if logged in */}
            {currentUser && (
              <button 
                className="action-btn profile-btn" 
                onClick={handleProfileClick}
                title="Profile"
              >
                <svg className="profile-icon" viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
              </button>
            )}

            {/* Wishlist button (visible only if logged in) */}
            {currentUser && (
              <Link to="/wishlist" className="action-btn wishlist-btn" title="Wishlist">
                <svg className="wishlist-icon" viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                </svg>
                {wishlistItemCount > 0 && (
                  <span className="wishlist-count">{wishlistItemCount}</span>
                )}
              </Link>
            )}

            {/* Cart button (always visible) */}
            <Link to="/cart" className="action-btn cart-btn" title="Cart">
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
                  <span className="welcome-text" title={currentUser.email}>
                    Welcome, {currentUser.email.length > 15 
                      ? `${currentUser.email.substring(0, 12)}...` 
                      : currentUser.email}
                  </span>
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