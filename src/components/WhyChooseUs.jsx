// src/components/WhyChooseUs.jsx
import React from 'react';

const WhyChooseUs = () => {
  const features = [
    {
      id: 1,
      icon: "fas fa-truck",
      title: "Free Delivery",
      description: "Free delivery on all orders over $50"
    },
    {
      id: 2,
      icon: "fas fa-undo",
      title: "Easy Returns",
      description: "Hassle-free returns within 7 days"
    },
    {
      id: 3,
      icon: "fas fa-shield-alt",
      title: "Secure Payment",
      description: "Multiple secure payment options"
    },
    {
      id: 4,
      icon: "fas fa-headset",
      title: "24/7 Support",
      description: "Dedicated customer support"
    }
  ];

  return (
    <section className="why-choose-us-section">
      <div className="container">
        <h2 className="section-title">Why Choose Us</h2>
        
        <div className="why-choose-us-grid">
          {features.map(feature => (
            <div className="feature-card" key={feature.id}>
              <div className="feature-icon">
                <i className={feature.icon}></i>
              </div>
              <h3 className="feature-title">{feature.title}</h3>
              <p className="feature-desc">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;