import React, { useState } from 'react';
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaClock } from 'react-icons/fa';
import './Contact.css';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [formStatus, setFormStatus] = useState(null);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would normally handle the form submission to your backend
    console.log('Form submitted:', formData);
    
    // Simulate success response
    setFormStatus('success');
    
    // Reset form after submission
    setFormData({
      name: '',
      email: '',
      subject: '',
      message: ''
    });
    
    // Clear success message after a few seconds
    setTimeout(() => {
      setFormStatus(null);
    }, 5000);
  };

  return (
    <div className="contact-page">
      <div className="contact-header">
        <div className="contact-header-overlay">
          <h1>Contact Us</h1>
          <p>We'd love to hear from you! Reach out to us with any questions or feedback.</p>
        </div>
      </div>
      
      <div className="contact-container">
        <div className="contact-info-section">
          <div className="contact-info-card">
            <h2>Get In Touch</h2>
            <p>Have questions about our products or services? Our team is here to help you!</p>
            
            <div className="contact-info-item">
              <FaPhone className="contact-icon" />
              <div>
                <h3>Phone</h3>
                <p>+91 9876543210</p>
                <p>+91 9876543211</p>
              </div>
            </div>
            
            <div className="contact-info-item">
              <FaEnvelope className="contact-icon" />
              <div>
                <h3>Email</h3>
                <p>support@grocerygo.com</p>
                <p>info@grocerygo.com</p>
              </div>
            </div>
            
            <div className="contact-info-item">
              <FaMapMarkerAlt className="contact-icon" />
              <div>
                <h3>Location</h3>
                <p>123 Main Street, City Center</p>
                <p>State - 400001, India</p>
              </div>
            </div>
            
            <div className="contact-info-item">
              <FaClock className="contact-icon" />
              <div>
                <h3>Business Hours</h3>
                <p>Monday - Saturday: 8:00 AM - 10:00 PM</p>
                <p>Sunday: 10:00 AM - 8:00 PM</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="contact-form-section">
          <div className="contact-form-card">
            <h2>Send us a Message</h2>
            {formStatus === 'success' && (
              <div className="form-success-message">
                Your message has been sent successfully. We'll get back to you soon!
              </div>
            )}
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="name">Your Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="email">Your Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="subject">Subject</label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="message">Your Message</label>
                <textarea
                  id="message"
                  name="message"
                  rows="5"
                  value={formData.message}
                  onChange={handleChange}
                  required
                ></textarea>
              </div>
              
              <button type="submit" className="submit-button">Send Message</button>
            </form>
          </div>
        </div>
      </div>
      
      <div className="map-section">
        <h2>Find Us</h2>
        <div className="map-container">
          <iframe 
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d30703620.674878968!2d64.41396509204874!3d20.01273993518118!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x30635ff06b92b791%3A0xd78c4fa1854213a6!2sIndia!5e0!3m2!1sen!2sin!4v1651058377214!5m2!1sen!2sin" 
            width="100%" 
            height="450" 
            style={{ border: 0 }} 
            allowFullScreen="" 
            loading="lazy" 
            referrerPolicy="no-referrer-when-downgrade"
            title="GroceryGo Location"
          ></iframe>
        </div>
      </div>
      
      <div className="faq-section">
        <h2>Frequently Asked Questions</h2>
        <div className="faq-container">
          <div className="faq-item">
            <h3>What are your delivery hours?</h3>
            <p>We deliver from 10:00 AM to 8:00 PM every day. You can choose your preferred delivery slot during checkout.</p>
          </div>
          
          <div className="faq-item">
            <h3>How do I track my order?</h3>
            <p>You can track your order in real-time through your profile page after logging in to your account.</p>
          </div>
          
          <div className="faq-item">
            <h3>What is your return policy?</h3>
            <p>If you're not satisfied with any product, you can return it within 24 hours of delivery for a full refund or replacement.</p>
          </div>
          
          <div className="faq-item">
            <h3>Do you offer same-day delivery?</h3>
            <p>Yes, for orders placed before 2:00 PM, we offer same-day delivery in selected areas.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;