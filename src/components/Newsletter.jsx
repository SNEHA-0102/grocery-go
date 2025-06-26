// src/components/Newsletter.jsx
import React, { useState } from 'react';

const Newsletter = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [error, setError] = useState('');
  
  const handleSubmit = (e) => {
    e.preventDefault();
    // Basic email validation
    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
      setError('Please enter a valid email address');
      return;
    }
    
    // In a real app, you would send this to your backend API
    console.log('Subscribing email:', email);
    
    // Simulate successful subscription
    setSubscribed(true);
    setError('');
    setEmail('');
    
    // Reset subscription message after 5 seconds
    setTimeout(() => {
      setSubscribed(false);
    }, 5000);
  };
  
  return (
    <section className="newsletter-section">
      <div className="container">
        <div className="newsletter-content">
          <h2 className="newsletter-title">Subscribe to Our Newsletter</h2>
          <p className="newsletter-desc">Sign up to receive updates on new products, special offers, and healthy recipes!</p>
          
          {subscribed ? (
            <div className="subscription-success">
              <i className="fas fa-check-circle"></i>
              <p>Thank you for subscribing! You'll receive our newsletter soon.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="newsletter-form">
              <input 
                type="email"
                className="newsletter-input"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <button type="submit" className="newsletter-button">Subscribe</button>
            </form>
          )}
          
          {error && <p className="subscription-error">{error}</p>}
        </div>
      </div>
    </section>
  );
};

export default Newsletter;