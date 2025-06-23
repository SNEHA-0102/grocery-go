// src/pages/OrderConfirmation.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const OrderConfirmation = () => {
  return (
    <div className="order-confirmation">
      <h2>Thank you for your order! 🛍️</h2>
      <p>Your order has been successfully placed.</p>
      <Link to="/" className="continue-shopping-btn">Go Back to Home</Link>
    </div>
  );
};

export default OrderConfirmation;
