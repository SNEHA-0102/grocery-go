
// src/components/Testimonials.jsx
import React from 'react';

const Testimonials = () => {
  const testimonials = [
    {
      id: 1,
      text: "I've been using this grocery delivery service for six months now, and I'm extremely satisfied with the quality of products and timely delivery. The fresh produce is always top-notch!",
      author: "Emma Thompson",
      title: "Regular Customer",
      image: "/images/testimonials/user1.jpg"
    },
    {
      id: 2,
      text: "As a busy professional, this service has been a lifesaver. The app is so easy to use, and I love that I can schedule deliveries in advance. The organic selection is impressive!",
      author: "Michael Chen",
      title: "Premium Member",
      image: "/images/testimonials/user2.jpg"
    },
    {
      id: 3,
      text: "The customer service is exceptional! I had an issue with my order once, and they resolved it immediately and even sent a complimentary item. That's what I call going above and beyond.",
      author: "Sophia Rodriguez",
      title: "Loyal Customer",
      image: "/images/testimonials/user3.jpg"
    }
  ];

  return (
    <section className="testimonials-section">
      <div className="container">
        <h2 className="section-title">What Our Customers Say</h2>
        
        <div className="testimonials-carousel">
          <div className="row">
            {testimonials.map(testimonial => (
              <div className="col-md-4" key={testimonial.id}>
                <div className="testimonial-card">
                  <div className="testimonial-quote">"</div>
                  <p className="testimonial-text">{testimonial.text}</p>
                  <div className="testimonial-author">
                    <div className="testimonial-author-image">
                      <img src={testimonial.image} alt={testimonial.author} />
                    </div>
                    <h4 className="testimonial-author-name">{testimonial.author}</h4>
                    <p className="testimonial-author-title">{testimonial.title}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;