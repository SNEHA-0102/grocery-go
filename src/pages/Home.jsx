import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import './Home.css';

import slide1 from '../images/slide1.png';
import slide2 from '../images/slide2.png';
import slide3 from '../images/1.png';
import slide4 from '../images/2.png';

const Home = () => {
  return (
    <section className="home-carousel-section">
      <div id="carouselExampleCaptions" className="carousel slide" data-bs-ride="carousel">
        <div className="carousel-indicators">
          <button 
            type="button" 
            data-bs-target="#carouselExampleCaptions" 
            data-bs-slide-to="0" 
            className="active"
            aria-current="true" 
            aria-label="Slide 1">
          </button>
          <button 
            type="button" 
            data-bs-target="#carouselExampleCaptions" 
            data-bs-slide-to="1"
            aria-label="Slide 2">
          </button>
          <button 
            type="button" 
            data-bs-target="#carouselExampleCaptions" 
            data-bs-slide-to="2"
            aria-label="Slide 3">
          </button>
          <button 
            type="button" 
            data-bs-target="#carouselExampleCaptions" 
            data-bs-slide-to="3"
            aria-label="Slide 4">
          </button>
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
        
        <button className="carousel-control-prev" type="button" data-bs-target="#carouselExampleCaptions"
          data-bs-slide="prev">
          <span className="carousel-control-prev-icon" aria-hidden="true"></span>
          <span className="visually-hidden">Previous</span>
        </button>
        <button className="carousel-control-next" type="button" data-bs-target="#carouselExampleCaptions"
          data-bs-slide="next">
          <span className="carousel-control-next-icon" aria-hidden="true"></span>
          <span className="visually-hidden">Next</span>
        </button>
      </div>
    </section>
  );
};

export default Home;