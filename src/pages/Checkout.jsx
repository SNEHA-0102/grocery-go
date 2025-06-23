// src/pages/Checkout.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ref, push, set } from 'firebase/database';
import { db } from '../../firebaseConfig';
import './Checkout.css';

const Checkout = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: 'Maharashtra',
    zipCode: '',
    country: 'India'
  });
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [showPayment, setShowPayment] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const navigate = useNavigate();
  const cart = JSON.parse(localStorage.getItem('cart')) || [];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // Handle phone number - only allow digits and limit to 10
    if (name === 'phone') {
      const phoneValue = value.replace(/\D/g, ''); // Remove non-digits
      if (phoneValue.length <= 10) {
        setFormData(prev => ({
          ...prev,
          [name]: phoneValue
        }));
      }
      return;
    }
    
    // Handle ZIP code - only allow digits and limit to 6
    if (name === 'zipCode') {
      const zipValue = value.replace(/\D/g, ''); // Remove non-digits
      if (zipValue.length <= 6) {
        setFormData(prev => ({
          ...prev,
          [name]: zipValue
        }));
      }
      return;
    }
    
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (formData.phone.length !== 10) {
      newErrors.phone = 'Phone number must be exactly 10 digits';
    }
    if (!formData.address.trim()) newErrors.address = 'Address is required';
    if (!formData.city.trim()) newErrors.city = 'City is required';
    if (!formData.zipCode.trim()) {
      newErrors.zipCode = 'ZIP code is required';
    } else if (formData.zipCode.length !== 6) {
      newErrors.zipCode = 'ZIP code must be exactly 6 digits';
    }
    
    if (cart.length === 0) {
      alert('Your cart is empty');
      return false;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const calculateTotal = () => {
    return cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  };

  const placeOrder = async () => {
    setLoading(true);
    try {
      const ordersRef = ref(db, 'orders');
      const newOrderRef = push(ordersRef);

      await set(newOrderRef, {
        customerInfo: formData,
        items: cart,
        total: calculateTotal(),
        paymentMethod,
        status: 'pending',
        createdAt: new Date().toISOString(),
      });

      const orderId = newOrderRef.key;

      localStorage.removeItem('cart');
      window.dispatchEvent(new Event('cartUpdated'));
      navigate('/order-success', { state: { orderId } });
    } catch (error) {
      console.error('Order Error:', error);
      alert('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
      setShowPayment(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    if (paymentMethod === 'online') {
      setShowPayment(true);
    } else {
      placeOrder();
    }
  };

  return (
    <div className="checkout-page">
      <div className="checkout-container">
        <div className="checkout-content">
          <div className="checkout-form-section">
            <h2>Checkout</h2>
            
            <form onSubmit={handleSubmit} className="checkout-form">
              <div className="form-section">
                <h3>Personal Information</h3>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="firstName">First Name *</label>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className={errors.firstName ? 'error' : ''}
                    />
                    {errors.firstName && <span className="error-text">{errors.firstName}</span>}
                  </div>
                  <div className="form-group">
                    <label htmlFor="lastName">Last Name *</label>
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className={errors.lastName ? 'error' : ''}
                    />
                    {errors.lastName && <span className="error-text">{errors.lastName}</span>}
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="email">Email Address *</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className={errors.email ? 'error' : ''}
                    />
                    {errors.email && <span className="error-text">{errors.email}</span>}
                  </div>
                  <div className="form-group">
                    <label htmlFor="phone">Phone Number *</label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className={errors.phone ? 'error' : ''}
                      placeholder="Enter 10-digit number"
                      maxLength="10"
                    />
                    {errors.phone && <span className="error-text">{errors.phone}</span>}
                  </div>
                </div>
              </div>

              <div className="form-section">
                <h3>Shipping Address</h3>
                <div className="form-group">
                  <label htmlFor="address">Street Address *</label>
                  <textarea
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    className={errors.address ? 'error' : ''}
                    rows="3"
                    placeholder="Enter your complete address"
                  />
                  {errors.address && <span className="error-text">{errors.address}</span>}
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="city">City *</label>
                    <input
                      type="text"
                      id="city"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      className={errors.city ? 'error' : ''}
                    />
                    {errors.city && <span className="error-text">{errors.city}</span>}
                  </div>
                  <div className="form-group">
                    <label htmlFor="state">State</label>
                    <input
                      type="text"
                      id="state"
                      name="state"
                      value="Maharashtra"
                      readOnly
                      className="readonly-field"
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="zipCode">ZIP Code *</label>
                    <input
                      type="text"
                      id="zipCode"
                      name="zipCode"
                      value={formData.zipCode}
                      onChange={handleInputChange}
                      className={errors.zipCode ? 'error' : ''}
                      placeholder="Enter 6-digit ZIP code"
                      maxLength="6"
                    />
                    {errors.zipCode && <span className="error-text">{errors.zipCode}</span>}
                  </div>
                  <div className="form-group">
                    <label htmlFor="country">Country</label>
                    <input
                      type="text"
                      id="country"
                      name="country"
                      value="India"
                      readOnly
                      className="readonly-field"
                    />
                  </div>
                </div>
              </div>

              <div className="form-section">
                <h3>Payment Method</h3>
                <div className="payment-options">
                  <label className="payment-option">
                    <input
                      type="radio"
                      value="cod"
                      checked={paymentMethod === 'cod'}
                      onChange={() => setPaymentMethod('cod')}
                    />
                    <div className="payment-info">
                      <span className="payment-title">Cash on Delivery</span>
                      <span className="payment-desc">Pay when your order arrives</span>
                    </div>
                  </label>
                  <label className="payment-option">
                    <input
                      type="radio"
                      value="online"
                      checked={paymentMethod === 'online'}
                      onChange={() => setPaymentMethod('online')}
                    />
                    <div className="payment-info">
                      <span className="payment-title">Online Payment</span>
                      <span className="payment-desc">Pay securely online (Demo)</span>
                    </div>
                  </label>
                </div>
              </div>

              <button 
                type="submit" 
                className="place-order-btn"
                disabled={loading}
              >
                {loading ? 'Processing...' : 
                 paymentMethod === 'cod' ? 'Place Order' : 'Proceed to Payment'}
              </button>
            </form>
          </div>

          <div className="order-summary">
            <h3>Order Summary</h3>
            <div className="cart-items">
              {cart.map((item, index) => (
                <div key={index} className="cart-item">
                  <span className="item-name">{item.name}</span>
                  <span className="item-quantity">x{item.quantity}</span>
                  <span className="item-price">₹{(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
            <div className="order-total">
              <div className="total-row">
                <span>Subtotal:</span>
                <span>₹{calculateTotal().toFixed(2)}</span>
              </div>
              <div className="total-row">
                <span>Shipping:</span>
                <span>Free</span>
              </div>
              <div className="total-row final-total">
                <span>Total:</span>
                <span>₹{calculateTotal().toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

        {showPayment && (
          <div className="payment-overlay">
            <div className="payment-popup">
              <h3>Demo Payment Gateway</h3>
              <div className="payment-details">
                <p>Amount to pay: <strong>₹{calculateTotal().toFixed(2)}</strong></p>
                <p>This is a demonstration payment screen.</p>
                <p>In a real application, this would integrate with actual payment gateways.</p>
              </div>
              <div className="payment-actions">
                <button 
                  onClick={placeOrder} 
                  className="confirm-payment-btn"
                  disabled={loading}
                >
                  {loading ? 'Processing...' : 'Confirm Payment'}
                </button>
                <button 
                  onClick={() => setShowPayment(false)} 
                  className="cancel-payment-btn"
                  disabled={loading}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Checkout;