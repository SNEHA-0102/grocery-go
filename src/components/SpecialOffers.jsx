

// src/components/SpecialOffers.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const SpecialOffers = () => {
  // Sample offers data
  const offers = [
    {
      id: 1,
      title: "Weekend Fresh Fruit Sale",
      description: "Get 20% off on all fresh fruits this weekend. Limited time offer.",
      tag: "20% OFF",
      image: "/images/offers/fruits.jpg",
      link: "/categories/fruits"
    },
    {
      id: 2,
      title: "Organic Vegetables Bundle",
      description: "Buy any 3 organic vegetables and get the 4th one free!",
      tag: "Bundle Deal",
      image: "/images/offers/vegetables.jpg",
      link: "/categories/vegetables"
    }
  ];

  return (
    <section className="special-offers-section">
      <div className="container">
        <h2 className="section-title">Special Offers</h2>
        
        <div className="offers-grid">
          {offers.map(offer => (
            <div className="offer-card" key={offer.id}>
              <div className="offer-image">
                <img src={offer.image} alt={offer.title} />
              </div>
              <div className="offer-content">
                <span className="offer-tag">{offer.tag}</span>
                <h3 className="offer-title">{offer.title}</h3>
                <p className="offer-desc">{offer.description}</p>
                <Link to={offer.link} className="offer-cta">Shop Now</Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SpecialOffers;