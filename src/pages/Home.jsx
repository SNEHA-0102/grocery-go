// src/pages/Home.jsx
import React, { useEffect, useState } from 'react';
import { ref, get } from 'firebase/database';
import { db } from '../../firebaseConfig';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import './Home.css';

// Component Imports
import ProductCard from '../components/ProductCard';
import CategoryShowcase from '../components/CategoryShowcase';
import SpecialOffers from '../components/SpecialOffers';
import WhyChooseUs from '../components/WhyChooseUs';
import Testimonials from '../components/Testimonals';
import Newsletter from '../components/Newsletter';
import SeasonalProducts from '../components/SeasonalProducts';
import DeliveryBanner from '../components/DeliveryBanner';

// Image Imports
import slide1 from '../images/slide1.png';
import slide2 from '../images/slide2.png';
import slide3 from '../images/1.png';
import slide4 from '../images/2.png';

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [trendingProducts, setTrendingProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
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

          // For featured products - random selection
          const shuffled = [...allProducts].sort(() => 0.5 - Math.random());
          setFeaturedProducts(shuffled.slice(0, 8));
          
          // For trending products - could be based on some criteria like rating or sales
          // Here we're just using another random selection for demonstration
          const trending = [...allProducts]
            .sort(() => 0.5 - Math.random())
            .slice(0, 4);
          setTrendingProducts(trending);
        } else {
          setFeaturedProducts([]);
          setTrendingProducts([]);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className="home-page">
      {/* Hero Carousel */}
      <section className="hero-carousel-section">
        <div id="heroCarousel" className="carousel slide" data-bs-ride="carousel">
          <div className="carousel-indicators">
            <button type="button" data-bs-target="#heroCarousel" data-bs-slide-to="0" className="active"></button>
            <button type="button" data-bs-target="#heroCarousel" data-bs-slide-to="1"></button>
            <button type="button" data-bs-target="#heroCarousel" data-bs-slide-to="2"></button>
            <button type="button" data-bs-target="#heroCarousel" data-bs-slide-to="3"></button>
          </div>
          <div className="carousel-inner">
            <div className="carousel-item active">
              <img src={slide1} className="d-block w-100" alt="Fresh Fruits & Vegetables" />
              <div className="carousel-caption">
                <h2>Fresh Produce Delivered to Your Door</h2>
                <p>Farm-fresh fruits and vegetables, sourced directly from local farmers</p>
                <Link to="/categories/fruits" className="carousel-btn">Shop Now</Link>
              </div>
            </div>
            <div className="carousel-item">
              <img src={slide2} className="d-block w-100" alt="Organic Products" />
              <div className="carousel-caption">
                <h2>100% Organic Products</h2>
                <p>Certified organic groceries for a healthier lifestyle</p>
                <Link to="/categories/organic" className="carousel-btn">Explore Organic</Link>
              </div>
            </div>
            <div className="carousel-item">
              <img src={slide3} className="d-block w-100" alt="Weekend Deals" />
              <div className="carousel-caption">
                <h2>Weekend Special Deals</h2>
                <p>Save up to 25% on selected items every weekend</p>
                <Link to="/promotions" className="carousel-btn">View Deals</Link>
              </div>
            </div>
            <div className="carousel-item">
              <img src={slide4} className="d-block w-100" alt="Membership Benefits" />
              <div className="carousel-caption">
                <h2>Join Our Membership Program</h2>
                <p>Exclusive discounts and free delivery for members</p>
                <Link to="/membership" className="carousel-btn">Join Now</Link>
              </div>
            </div>
          </div>
          <button className="carousel-control-prev" type="button" data-bs-target="#heroCarousel" data-bs-slide="prev">
            <span className="carousel-control-prev-icon" aria-hidden="true"></span>
            <span className="visually-hidden">Previous</span>
          </button>
          <button className="carousel-control-next" type="button" data-bs-target="#heroCarousel" data-bs-slide="next">
            <span className="carousel-control-next-icon" aria-hidden="true"></span>
            <span className="visually-hidden">Next</span>
          </button>
        </div>
      </section>

      {/* Quick Category Access */}
      <section className="quick-categories">
        <div className="container">
          <div className="quick-categories-grid">
            <Link to="/categories/fruits" className="quick-category-item">
              <div className="quick-category-icon">
                <i className="fas fa-apple-alt"></i>
              </div>
              <span>Fruits</span>
            </Link>
            <Link to="/categories/vegetables" className="quick-category-item">
              <div className="quick-category-icon">
                <i className="fas fa-carrot"></i>
              </div>
              <span>Vegetables</span>
            </Link>
            <Link to="/categories/dairy" className="quick-category-item">
              <div className="quick-category-icon">
                <i className="fas fa-cheese"></i>
              </div>
              <span>Dairy</span>
            </Link>
            <Link to="/categories/bakery" className="quick-category-item">
              <div className="quick-category-icon">
                <i className="fas fa-bread-slice"></i>
              </div>
              <span>Bakery</span>
            </Link>
            <Link to="/categories/meat" className="quick-category-item">
              <div className="quick-category-icon">
                <i className="fas fa-drumstick-bite"></i>
              </div>
              <span>Meat</span>
            </Link>
            <Link to="/categories/beverages" className="quick-category-item">
              <div className="quick-category-icon">
                <i className="fas fa-wine-bottle"></i>
              </div>
              <span>Beverages</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Special Offers Banner */}
      <DeliveryBanner />

      {/* Featured Products */}
      <section className="featured-products-section">
        <div className="container">
          <h2 className="section-title">Featured Products</h2>
          
          {loading ? (
            <div className="loading-spinner">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : featuredProducts.length === 0 ? (
            <p className="no-products-message">No featured products available currently.</p>
          ) : (
            <div className="row g-4">
              {featuredProducts.map((product) => (
                <div className="col-6 col-md-3" key={product.id}>
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          )}
          
          <div className="text-center mt-4">
            <Link to="/products" className="view-all-btn">View All Products</Link>
          </div>
        </div>
      </section>

      {/* Special Offers Section */}
      <SpecialOffers />

      {/* Seasonal Products Showcase */}
      <SeasonalProducts />

      {/* Category Showcase */}
      <CategoryShowcase />

      {/* Trending Products */}
      <section className="trending-products-section">
        <div className="container">
          <div className="row align-items-center mb-4">
            <div className="col-md-6">
              <h2 className="section-title mb-0 text-md-start">Trending Now</h2>
            </div>
            <div className="col-md-6 text-md-end d-none d-md-block">
              <Link to="/trending" className="trending-link">See All Trending <i className="fas fa-arrow-right"></i></Link>
            </div>
          </div>
          
          {loading ? (
            <div className="loading-spinner">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : trendingProducts.length === 0 ? (
            <p className="no-products-message">No trending products available currently.</p>
          ) : (
            <div className="row g-4">
              {trendingProducts.map((product) => (
                <div className="col-6 col-md-3" key={product.id}>
                  <ProductCard product={product} showBadge={true} badgeText="Trending" />
                </div>
              ))}
            </div>
          )}
          
          <div className="text-center mt-4 d-md-none">
            <Link to="/trending" className="view-all-btn">See All Trending</Link>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <WhyChooseUs />

      {/* Testimonials Section */}
      <Testimonials />

      {/* Recipe Inspiration Section */}
      <section className="recipe-inspiration-section">
        <div className="container">
          <h2 className="section-title">Recipe Inspiration</h2>
          <div className="recipe-slider">
            <div className="row g-4">
              <div className="col-md-4">
                <div className="recipe-card">
                  <div className="recipe-image">
                    <img src="/images/recipes/recipe1.jpg" alt="Healthy Salad Bowl" />
                    <div className="recipe-difficulty easy">Easy</div>
                  </div>
                  <div className="recipe-content">
                    <div className="recipe-meta">
                      <span><i className="far fa-clock"></i> 15 mins</span>
                      <span><i className="fas fa-utensils"></i> 4 servings</span>
                    </div>
                    <h3 className="recipe-title">Healthy Green Salad Bowl</h3>
                    <p className="recipe-desc">A refreshing salad with avocado, cucumber, and our special dressing.</p>
                    <Link to="/recipes/healthy-salad" className="recipe-btn">View Recipe</Link>
                  </div>
                </div>
              </div>
              
              <div className="col-md-4">
                <div className="recipe-card">
                  <div className="recipe-image">
                    <img src="/images/recipes/recipe2.jpg" alt="Fruit Smoothie" />
                    <div className="recipe-difficulty easy">Easy</div>
                  </div>
                  <div className="recipe-content">
                    <div className="recipe-meta">
                      <span><i className="far fa-clock"></i> 10 mins</span>
                      <span><i className="fas fa-utensils"></i> 2 servings</span>
                    </div>
                    <h3 className="recipe-title">Berry Blast Smoothie</h3>
                    <p className="recipe-desc">A delicious blend of berries, banana, and yogurt for a quick breakfast.</p>
                    <Link to="/recipes/berry-smoothie" className="recipe-btn">View Recipe</Link>
                  </div>
                </div>
              </div>
              
              <div className="col-md-4">
                <div className="recipe-card">
                  <div className="recipe-image">
                    <img src="/images/recipes/recipe3.jpg" alt="Veggie Pasta" />
                    <div className="recipe-difficulty medium">Medium</div>
                  </div>
                  <div className="recipe-content">
                    <div className="recipe-meta">
                      <span><i className="far fa-clock"></i> 25 mins</span>
                      <span><i className="fas fa-utensils"></i> 3 servings</span>
                    </div>
                    <h3 className="recipe-title">Mediterranean Veggie Pasta</h3>
                    <p className="recipe-desc">Fresh vegetables and herbs in a light tomato sauce with whole grain pasta.</p>
                    <Link to="/recipes/veggie-pasta" className="recipe-btn">View Recipe</Link>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="text-center mt-4">
              <Link to="/recipes" className="view-all-recipes-btn">Explore All Recipes</Link>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <Newsletter />

      {/* Welcome/About Section - Enhanced */}
      <section className="welcome-section">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6">
              <div className="welcome-content">
                <h2>Welcome to Our Grocery Store</h2>
                <p>We're committed to bringing you the freshest, highest-quality groceries directly to your doorstep. Our mission is to make healthy eating convenient and affordable for everyone.</p>
                <p>Every product in our store is carefully selected to ensure premium quality, freshness, and value for our customers.</p>
                <div className="welcome-features">
                  <div className="welcome-feature">
                    <i className="fas fa-truck"></i>
                    <span>Fast Delivery</span>
                  </div>
                  <div className="welcome-feature">
                    <i className="fas fa-leaf"></i>
                    <span>Organic Options</span>
                  </div>
                  <div className="welcome-feature">
                    <i className="fas fa-dollar-sign"></i>
                    <span>Best Prices</span>
                  </div>
                </div>
                <Link to="/about" className="learn-more-btn">Learn More About Us</Link>
              </div>
            </div>
            <div className="col-lg-6">
              <div className="welcome-image-grid">
                <div className="welcome-image welcome-image-1">
                  <img src="/images/about/about1.jpg" alt="Fresh Produce" />
                </div>
                <div className="welcome-image welcome-image-2">
                  <img src="/images/about/about2.jpg" alt="Organic Products" />
                </div>
                <div className="welcome-image welcome-image-3">
                  <img src="/images/about/about3.jpg" alt="Delivery Service" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* App Download Section */}
      <section className="app-download-section">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6">
              <div className="app-phone-mockup">
                <img src="/images/app-mockup.png" alt="Grocery App" />
              </div>
            </div>
            <div className="col-lg-6">
              <div className="app-content">
                <h2>Download Our Mobile App</h2>
                <p>Shop anytime, anywhere with our easy-to-use mobile app. Get exclusive app-only deals and track your delivery in real-time.</p>
                
                <div className="app-features">
                  <div className="app-feature">
                    <div className="app-feature-icon">
                      <i className="fas fa-tag"></i>
                    </div>
                    <div className="app-feature-text">Exclusive app-only discounts</div>
                  </div>
                  <div className="app-feature">
                    <div className="app-feature-icon">
                      <i className="fas fa-redo"></i>
                    </div>
                    <div className="app-feature-text">Easy reordering of previous items</div>
                  </div>
                  <div className="app-feature">
                    <div className="app-feature-icon">
                      <i className="fas fa-map-marker-alt"></i>
                    </div>
                    <div className="app-feature-text">Real-time delivery tracking</div>
                  </div>
                </div>
                
                <div className="app-download-buttons">
                  <a href="#" className="app-store-btn">
                    <i className="fab fa-apple app-store-icon"></i>
                    <div className="app-store-text">
                      <span className="app-store-text-small">Download on the</span>
                      <span className="app-store-text-large">App Store</span>
                    </div>
                  </a>
                  <a href="#" className="app-store-btn">
                    <i className="fab fa-google-play app-store-icon"></i>
                    <div className="app-store-text">
                      <span className="app-store-text-small">Get it on</span>
                      <span className="app-store-text-large">Google Play</span>
                    </div>
                  </a>
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