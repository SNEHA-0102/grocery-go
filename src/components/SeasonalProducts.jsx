// src/components/SeasonalProducts.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import ProductCard from './ProductCard';

const SeasonalProducts = () => {
  // Sample seasonal products data
  const seasonalProducts = [
    {
      id: 'seasonal1',
      name: 'Fresh Strawberries',
      image: '/images/products/strawberries.jpg',
      price: 4.99,
      originalPrice: 6.99,
      category: 'fruits',
      unit: '250g box'
    },
    {
      id: 'seasonal2',
      name: 'Organic Asparagus',
      image: '/images/products/asparagus.jpg',
      price: 3.49,
      category: 'vegetables',
      unit: 'bunch'
    },
    {
      id: 'seasonal3',
      name: 'Ripe Watermelon',
      image: '/images/products/watermelon.jpg',
      price: 5.99,
      category: 'fruits',
      unit: 'kg'
    },
    {
      id: 'seasonal4',
      name: 'Summer Peaches',
      image: '/images/products/peaches.jpg',
      price: 4.29,
      originalPrice: 5.49,
      category: 'fruits',
      unit: '500g'
    }
  ];
  
  const currentSeason = "Summer"; // This would be dynamic in a real application
  
  return (
    <section className="seasonal-products-section">
      <div className="container">
        <div className="seasonal-header">
          <div className="seasonal-title-wrapper">
            <h2 className="section-title">In Season Now: {currentSeason}</h2>
            <p className="seasonal-subtitle">Enjoy the freshest produce of the season</p>
          </div>
          <Link to="/seasonal" className="seasonal-link">View All Seasonal Products</Link>
        </div>
        
        <div className="row g-4">
          {seasonalProducts.map((product) => (
            <div className="col-6 col-md-4 col-lg-3" key={product.id}>
              <ProductCard product={product} />
            </div>
          ))}
        </div>
        
        <div className="seasonal-banner">
          <div className="banner-content">
            <h3>Fresh Picks of {currentSeason}</h3>
            <p>Locally sourced and at their peak of flavor</p>
            <Link to="/seasonal-recipes" className="btn btn-light">Seasonal Recipes</Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SeasonalProducts;
