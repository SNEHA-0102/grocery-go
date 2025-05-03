// src/components/DeliveryBanner.jsx
import React, { useState } from 'react';

const DeliveryBanner = () => {
  const [isVisible, setIsVisible] = useState(true);
  
  const handleClose = () => {
    setIsVisible(false);
  };
  
  if (!isVisible) {
    return null;
  }
  
  return (
    <div className="delivery-banner">
      <div className="container">
        <div className="banner-content">
          <div className="banner-icons">
            <i className="fas fa-truck"></i>
          </div>
          <div className="banner-text">
            <p><strong>Free delivery</strong> on orders over $50! Same-day delivery available for orders placed before 2 PM.</p>
          </div>
          <div className="banner-actions">
            <button className="btn btn-sm btn-outline-light" onClick={() => window.location.href = '/delivery-info'}>
              Learn More
            </button>
            <button className="banner-close" onClick={handleClose}>
              <i className="fas fa-times"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeliveryBanner;