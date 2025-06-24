// src/pages/Home.jsx
import React, { useEffect, useState } from 'react';
import { ref, get } from 'firebase/database';
import { db } from '../../firebaseConfig';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import './Home.css';

import ProductCard from '../components/ProductCard';

import slide1 from '../images/slide1.png';
import slide2 from '../images/slide2.png';
import slide3 from '../images/1.png';
import slide4 from '../images/2.png';

import testimonialImg1 from '../images/testimonalImg.jpg';
import testimonialImg2 from '../images/testimonalImg2.jpg';
import testimonialImg3 from '../images/testimonalImg3.jpg';
import aboutUs from '../images/aboutUs.jpg';

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        const productsRef = ref(db, 'products');
        const snapshot = await get(productsRef);

        if (snapshot.exists()) {
          const data = snapshot.val();
          const allProducts = [];

          Object.keys(data).forEach(category => {
            Object.keys(data[category]).forEach(subcategory => {
              const subcatProducts = data[category][subcategory];
              Object.keys(subcatProducts).forEach(productId => {
                allProducts.push({
                  id: productId,
                  category,
                  subcategory,
                  ...subcatProducts[productId]
                });
              });
            });
          });

          const shuffled = allProducts.sort(() => 0.5 - Math.random());
          setFeaturedProducts(shuffled.slice(0, 8));
        } else {
          setFeaturedProducts([]);
        }
      } catch (error) {
        console.error("Error fetching featured products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedProducts();
  }, []);

  return (
    <div className="home-page">

      {/* Carousel */}
      <section className="home-carousel-section">
        <div id="carouselExampleCaptions" className="carousel slide" data-bs-ride="carousel">
          <div className="carousel-indicators">
            <button type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide-to="0" className="active"></button>
            <button type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide-to="1"></button>
            <button type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide-to="2"></button>
            <button type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide-to="3"></button>
          </div>
          <div className="carousel-inner">
            <div className="carousel-item active">
              <img src={slide1} className="d-block w-100" alt="Slide 1" />
            </div>
            <div className="carousel-item">
              <img src={slide2} className="d-block w-100" alt="Slide 2" />
            </div>
            <div className="carousel-item">
              <img src={slide3} className="d-block w-100" alt="Slide 3" />
            </div>
            <div className="carousel-item">
              <img src={slide4} className="d-block w-100" alt="Slide 4" />
            </div>
          </div>
          <button className="carousel-control-prev" type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide="prev">
            <span className="carousel-control-prev-icon" aria-hidden="true"></span>
            <span className="visually-hidden">Previous</span>
          </button>
          <button className="carousel-control-next" type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide="next">
            <span className="carousel-control-next-icon" aria-hidden="true"></span>
            <span className="visually-hidden">Next</span>
          </button>
        </div>
      </section>

      {/* Featured Products */}
      <section className="featured-products-section py-5">
        <div className="container">
          <h2 className="section-title mb-4">Featured Products</h2>

          {loading ? (
            <div className="loading-spinner text-center">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : featuredProducts.length === 0 ? (
            <p className="no-products-message text-center">No featured products available currently.</p>
          ) : (
            <div className="row g-4">
              {featuredProducts.map((product) => (
                <div className="col-6 col-md-3" key={product.id}>
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Welcome Section */}
      <section className="welcome-section py-5 bg-light">
        <div className="container text-center">
          <div className="welcome-content">
            <h2>Welcome to Our Grocery Store</h2>
            <p>We provide fresh, high-quality groceries directly to your doorstep. Explore a wide variety of products!</p>
            <Link to="/categories" className="btn btn-success">Shop Now</Link>
          </div>
        </div>
      </section>
      {/* About Us Section */}
      <section className="about-us-section py-5">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-md-6">
              <div className="about-content">
                <h2 className="section-title mb-4">About Us</h2>
                <p className="about-description">
                  We are a family-owned grocery store committed to bringing you the freshest and highest quality products. 
                  With over 15 years of experience in the industry, we understand what our customers need and strive to 
                  exceed their expectations every day.
                </p>
                <p className="about-description">
                  Our mission is to make grocery shopping convenient, affordable, and enjoyable. We source our products 
                  from trusted suppliers and local farmers to ensure you get the best value for your money.
                </p>
                <div className="about-stats">
                  <div className="stat-item">
                    <h4>15+</h4>
                    <span>Years of Experience</span>
                  </div>
                  <div className="stat-item">
                    <h4>10,000+</h4>
                    <span>Happy Customers</span>
                  </div>
                  <div className="stat-item">
                    <h4>500+</h4>
                    <span>Products Available</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-6">
              <div className="about-image">
               <img src={aboutUs} alt="Customer" className="aboutUs" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="testimonials-section py-5 bg-light">
        <div className="container">
          <h2 className="section-title text-center mb-5">What Our Customers Say</h2>
          <div className="row">
            <div className="col-md-4 mb-4">
              <div className="testimonial-card">
                <div className="testimonial-content">
                  <div className="stars mb-3">
                    <i className="fas fa-star"></i>
                    <i className="fas fa-star"></i>
                    <i className="fas fa-star"></i>
                    <i className="fas fa-star"></i>
                    <i className="fas fa-star"></i>
                  </div>
                  <p className="testimonial-text">
                    "Amazing quality products and super fast delivery! I've been ordering from them for months 
                    and they never disappoint. Highly recommended!"
                  </p>
                  <div className="customer-info">
                  <img src={testimonialImg1} alt="Customer" className="customer-avatar" />

                    <div className="customer-details">
                      <h5 className="customer-name">Sarah Johnson</h5>
                      <span className="customer-location">Mumbai, Maharashtra</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="col-md-4 mb-4">
              <div className="testimonial-card">
                <div className="testimonial-content">
                  <div className="stars mb-3">
                    <i className="fas fa-star"></i>
                    <i className="fas fa-star"></i>
                    <i className="fas fa-star"></i>
                    <i className="fas fa-star"></i>
                    <i className="fas fa-star"></i>
                  </div>
                  <p className="testimonial-text">
                    "Fresh vegetables and fruits every time! The packaging is excellent and prices are very reasonable. 
                    This is now my go-to grocery store."
                  </p>
                  <div className="customer-info">
                  <img src={testimonialImg2} alt="Customer" className="customer-avatar" />
                    <div className="customer-details">
                      <h5 className="customer-name">Rajesh Patel</h5>
                      <span className="customer-location">Pune, Maharashtra</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="col-md-4 mb-4">
              <div className="testimonial-card">
                <div className="testimonial-content">
                  <div className="stars mb-3">
                    <i className="fas fa-star"></i>
                    <i className="fas fa-star"></i>
                    <i className="fas fa-star"></i>
                    <i className="fas fa-star"></i>
                    <i className="fas fa-star"></i>
                  </div>
                  <p className="testimonial-text">
                    "Excellent customer service and wide variety of products. The online ordering system is 
                    user-friendly and the delivery is always on time."
                  </p>
                  <div className="customer-info">
                    <img src={testimonialImg3} alt="Customer" className="customer-avatar" />
                    <div className="customer-details">
                      <h5 className="customer-name">Priya Sharma</h5>
                      <span className="customer-location">Navi Mumbai, Maharashtra</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
