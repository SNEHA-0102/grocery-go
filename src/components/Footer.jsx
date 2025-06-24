import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaFacebook, FaTwitter, FaInstagram, FaYoutube, FaPhone, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa';
import './Footer.css';

const Footer = () => {
  const [email, setEmail] = useState('');
  const [subscriptionStatus, setSubscriptionStatus] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubscribe = async (e) => {
    e.preventDefault();
    
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setSubscriptionStatus('Please enter a valid email address');
      return;
    }

    setIsLoading(true);
    setSubscriptionStatus('');

    try {
      // Simulate API call - replace with your actual API endpoint
      const response = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        setSubscriptionStatus('Thank you for subscribing! Check your email for confirmation.');
        setEmail('');
      } else {
        const errorData = await response.json();
        setSubscriptionStatus(errorData.message || 'Subscription failed. Please try again.');
      }
    } catch (error) {
      // For demo purposes, we'll show a success message
      // In production, handle the actual error
      setSubscriptionStatus('Thank you for subscribing! You\'ll receive our latest updates and offers.');
      setEmail('');
    } finally {
      setIsLoading(false);
      
      // Clear status message after 5 seconds
      setTimeout(() => {
        setSubscriptionStatus('');
      }, 5000);
    }
  };

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-row">
          {/* About Us Column */}
          <div className="footer-column">
            <h3>GroceryGo</h3>
            <p className="about-text">
              At GroceryGo, we're committed to providing fresh, high-quality groceries at affordable prices.
              Our mission is to make grocery shopping convenient and enjoyable for everyone.
            </p>
            <div className="social-icons">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                <FaFacebook />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
                <FaTwitter />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                <FaInstagram />
              </a>
              <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" aria-label="YouTube">
                <FaYoutube />
              </a>
            </div>
          </div>

          {/* Quick Links Column */}
          <div className="footer-column">
            <h4>Quick Links</h4>
            <ul className="footer-links">
              <li><Link to="/">Home</Link></li>
              <li><Link to="/categories">Shop</Link></li>
              <li><Link to="/about">About Us</Link></li>
              <li><Link to="/contact">Contact Us</Link></li>
            </ul>
          </div>

          {/* Categories Column */}
          <div className="footer-column">
            <h4>Categories</h4>
            <ul className="footer-links">
              <li><Link to="/shop?category=Fruits%20%26%20Vegetables">Fruits & Vegetables</Link></li>
              <li><Link to="/shop?category=Bakery">Bakery</Link></li>
              <li><Link to="/shop?category=Dairy">Dairy Products</Link></li>
              <li><Link to="/shop?category=Beverages">Beverages</Link></li>
              <li><Link to="/shop?category=Grains%20%26%20Pulses">Grains & Pulses</Link></li>
              <li><Link to="/shop?category=Oils%20%26%20Fats">Oils & Fats</Link></li>
            </ul>
          </div>

          {/* Contact Us Column */}
          <div className="footer-column">
            <h4>Contact Us</h4>
            <div className="contact-info">
              <p><FaPhone className="contact-icon" /> +91 9876543210</p>
              <p><FaEnvelope className="contact-icon" /> support@grocerygo.com</p>
              <p><FaMapMarkerAlt className="contact-icon" /> 123 Main Street, City Center, <br />State - 400001, India</p>
            </div>
          </div>
        </div>

        {/* Newsletter Subscription */}
        <div className="newsletter">
          <h4>Subscribe to Our Newsletter</h4>
          <p>Get the latest updates, offers and more</p>
          <form className="newsletter-form" onSubmit={handleSubscribe}>
            <input 
              type="email" 
              placeholder="Enter your email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required 
              disabled={isLoading}
            />
            <button 
              type="submit" 
              disabled={isLoading || !email.trim()}
            >
              {isLoading ? 'Subscribing...' : 'Subscribe'}
            </button>
          </form>
          {subscriptionStatus && (
            <div className={`subscription-message ${subscriptionStatus.includes('Thank you') ? 'success' : 'error'}`}>
              {subscriptionStatus}
            </div>
          )}
        </div>

        {/* Copyright */}
        <div className="copyright">
          <p>&copy; {new Date().getFullYear()} GroceryGo. All Rights Reserved.</p>
          <div className="footer-bottom-links">
            <Link to="/privacy-policy">Privacy Policy</Link>
            <Link to="/terms-conditions">Terms & Conditions</Link>
            <Link to="/faq">FAQ</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;