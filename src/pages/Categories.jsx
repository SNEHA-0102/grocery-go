// src/pages/Categories.jsx
import React, { useState, useEffect } from 'react';
import { ref, get } from 'firebase/database';
import { db } from '../../firebaseConfig';
import { Link } from 'react-router-dom';

import bakery from "../assets/categories/bakery.jpg";
import beverages from "../assets/categories/beverages.jpg";
import dairy from "../assets/categories/dairy.jpg";
import fruitsVegetables from "../assets/categories/fruits_vegetables.jpg";
import grainsPulses from "../assets/categories/grains_pulses.jpg";
import oilsFats from "../assets/categories/oils_fats.jpg";
import seafood from "../assets/categories/seafood.jpg";
import defaultImage from "../assets/offers/default_offer.jpg";

import './Categories.css';

const categoryImages = {
  "Bakery": bakery,
  "Beverages": beverages,
  "Dairy": dairy,
  "Fruits & Vegetables": fruitsVegetables,
  "Grains & Pulses": grainsPulses,
  "Oils & Fats": oilsFats,
  "Seafood": seafood
};

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState(null);
  const [subcategories, setSubcategories] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categoriesRef = ref(db, 'products');
        const snapshot = await get(categoriesRef);

        if (snapshot.exists()) {
          const data = snapshot.val();
          const fetchedCategories = Object.keys(data).map((categoryName) => ({
            id: categoryName,
            name: categoryName
          }));
          setCategories(fetchedCategories);
        } else {
          setCategories([]);
        }
      } catch (err) {
        console.error("Error fetching categories:", err);
        setError("Failed to load categories. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const handleCategoryClick = async (categoryId) => {
    if (activeCategory === categoryId) {
      setActiveCategory(null);
      setSubcategories([]);
    } else {
      setActiveCategory(categoryId);

      try {
        const subcatRef = ref(db, `products/${categoryId}`);
        const snapshot = await get(subcatRef);

        if (snapshot.exists()) {
          const data = snapshot.val();
          const fetchedSubcategories = Object.keys(data);
          setSubcategories(fetchedSubcategories);
        } else {
          setSubcategories([]);
        }
      } catch (err) {
        console.error("Error fetching subcategories:", err);
        setSubcategories([]);
      }
    }
  };

  return (
    <div className="categories-page">
      <div className="categories-hero">
        <div className="hero-content">
          <h1>Categories</h1>
          <p>Browse our wide selection of grocery categories to find exactly what you need</p>
        </div>
      </div>

      <div className="categories-container">
        <h2>All Categories</h2>

        {loading ? (
          <div className="loading-spinner">
            <div className="spinner"></div>
            <p>Loading categories...</p>
          </div>
        ) : error ? (
          <div className="error-message">
            <p>{error}</p>
            <button onClick={() => window.location.reload()}>Try Again</button>
          </div>
        ) : (
          <div className="categories-grid">
            {categories.map(category => (
              <div
                key={category.id}
                className={`category-card ${activeCategory === category.id ? 'active' : ''}`}
                onClick={() => handleCategoryClick(category.id)}
              >
                <div className="category-image">
                  <img 
                    src={categoryImages[category.name] || defaultImage} 
                    alt={category.name} 
                    onError={(e) => { e.target.src = defaultImage }}
                  />
                </div>
                <div className="category-info">
                  <h3>{category.name}</h3>
                  {activeCategory === category.id && (
                    <div className="subcategories">
                      <h4>Subcategories:</h4>
                      <ul>
                        {subcategories.length > 0 ? (
                          subcategories.map((subcategory, index) => (
                            <li key={index}>
                              <Link to={`/shop?category=${encodeURIComponent(category.id)}&subcategory=${encodeURIComponent(subcategory)}`}>
                                {subcategory}
                              </Link>
                            </li>
                          ))
                        ) : (
                          <li>No subcategories available</li>
                        )}
                      </ul>
                      <div className="view-all">
                        <Link to={`/shop?category=${encodeURIComponent(category.id)}`}>
                          View All Products
                        </Link>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Categories;
