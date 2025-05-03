import React from 'react';
import { Link } from 'react-router-dom';

const CategoryShowcase = () => {
  // Sample categories data - in a real app, this would come from your database
  const categories = [
    {
      id: 1,
      name: "Fresh Fruits",
      count: 42,
      image: "/images/categories/fruits.jpg",
      link: "/categories/fruits"
    },
    {
      id: 2,
      name: "Vegetables",
      count: 38,
      image: "/images/categories/vegetables.jpg",
      link: "/categories/vegetables"
    },
    {
      id: 3,
      name: "Dairy & Eggs",
      count: 24,
      image: "/images/categories/dairy.jpg",
      link: "/categories/dairy-eggs"
    },
    {
      id: 4,
      name: "Bakery",
      count: 16,
      image: "/images/categories/bakery.jpg",
      link: "/categories/bakery"
    }
  ];

  return (
    <section className="categories-section">
      <div className="container">
        <h2 className="section-title">Shop By Category</h2>
        
        <div className="categories-grid">
          {categories.map(category => (
            <Link to={category.link} key={category.id} className="category-card">
              <img src={category.image} alt={category.name} className="category-image" />
              <div className="category-overlay">
                <h3 className="category-name">{category.name}</h3>
                <p className="category-count">{category.count} Products</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoryShowcase;