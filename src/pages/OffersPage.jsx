import React, { useEffect, useState } from 'react';
import { ref, get } from 'firebase/database';
import { db } from '../../firebaseConfig';
import { useNavigate } from 'react-router-dom';

import featuredOffer1 from '../assets/offers/featured_offer1.jpg';
import featuredOffer2 from '../assets/offers/featured_offer2.jpg';

import milkProductsSale from '../assets/offers/milk_products_sale.jpg';
import summerFruitsBonanza from '../assets/offers/summer_fruits_bonanza.jpg';
import biscuitsSpecialOffer from '../assets/offers/biscuits_special_offer.jpg';
import freshBreadsDeal from '../assets/offers/fresh_breads_deal.jpg';
import cheeseLoversDiscount from '../assets/offers/cheese_lovers_discount.jpg';
import freshVeggiesDiscount from '../assets/offers/fresh_veggies_discount.jpg';
import pulseBonanza from '../assets/offers/pulse_bonanza.jpg';
import riceFestival from '../assets/offers/rice_festival.jpg';
import healthyOilsOffer from '../assets/offers/healthy_oils_offer.jpg';
import seafoodSplash from '../assets/offers/seafood_splash.jpg';
import defaultOfferImage from '../assets/offers/default_offer.jpg';

import './OffersPage.css';

const offerImages = {
  'Milk Products Sale': milkProductsSale,
  'Summer Fruits Bonanza': summerFruitsBonanza,
  'Biscuits Special Offer': biscuitsSpecialOffer,
  'Fresh Breads Deal': freshBreadsDeal,
  'Cheese Lovers Discount': cheeseLoversDiscount,
  'Fresh Veggies Discount': freshVeggiesDiscount,
  'Pulse Bonanza': pulseBonanza,
  'Rice Festival': riceFestival,
  'Healthy Oils Offer': healthyOilsOffer,
  'Seafood Splash': seafoodSplash
};

const OffersPage = () => {
  const [offers, setOffers] = useState({});
  const [featuredOffers, setFeaturedOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOffers = async () => {
      try {
        const offersRef = ref(db, 'offers');
        const snapshot = await get(offersRef);

        if (snapshot.exists()) {
          const offersData = snapshot.val();
          setOffers(offersData);

          const allOffers = [];
          Object.entries(offersData).forEach(([categoryName, subcategories]) => {
            Object.entries(subcategories).forEach(([subcategoryName, offerDetails]) => {
              allOffers.push({
                categoryName,
                subcategoryName,
                ...offerDetails
              });
            });
          });

          const featured = allOffers
            .sort((a, b) => b.discount_percentage - a.discount_percentage)
            .slice(0, 2);
          setFeaturedOffers(featured);
        } else {
          setOffers({});
          setFeaturedOffers([]);
        }
      } catch (error) {
        console.error('Failed to fetch offers:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOffers();
  }, []);

  const handleShopNow = (categoryName, subcategoryName, products) => {
    const productIds = Object.keys(products).join(',');
    navigate(`/shop?category=${encodeURIComponent(categoryName)}&subcategory=${encodeURIComponent(subcategoryName)}&products=${productIds}`);
  };

  const getOfferImage = (offerDetails) => {
    const normalizedTitle = offerDetails.title?.toLowerCase().trim();
    const matchedKey = Object.keys(offerImages).find(
      (key) => key.toLowerCase().trim() === normalizedTitle
    );
    if (matchedKey) return offerImages[matchedKey];
    if (offerDetails.image_url?.startsWith('http')) return offerDetails.image_url;
    return defaultOfferImage;
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <div className="loading-message">Loading offers...</div>
      </div>
    );
  }

  return (
    <div className="offers-page">
      <div className="offers-hero">
        <div className="hero-content">
          <h1>Special Offers</h1>
          <p>Discover amazing deals and discounts on your favorite products</p>
        </div>
      </div>

      {featuredOffers.length > 0 && (
        <div className="featured-offers-container">
          <h2>Featured Offers</h2>
          <div className="featured-offers-grid">
            {featuredOffers.map((offer, index) => (
              <div
                className="featured-offer-card"
                key={offer.offer_id}
                style={{
                  backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${index === 0 ? featuredOffer1 : featuredOffer2})`
                }}
              >
                <div className="featured-offer-content">
                  <div className="discount-badge">{offer.discount_percentage}% OFF</div>
                  <h3>{offer.title}</h3>
                  <p>{offer.description}</p>
                  <p className="valid-until">Offer valid until {offer.valid_until}</p>
                  <button
                    className="featured-shop-btn"
                    onClick={() => handleShopNow(offer.categoryName, offer.subcategoryName, offer.products)}
                  >
                    Shop Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="all-offers-container">
        <h2>All Current Offers</h2>
        {Object.keys(offers).length > 0 ? (
          <div className="offers-grid">
            {Object.entries(offers).map(([categoryName, subcategories]) =>
              Object.entries(subcategories).map(([subcategoryName, offerDetails]) => (
                <div className="offer-card" key={offerDetails.offer_id}>
                  <div className="offer-image-container">
                    <img
                      src={getOfferImage({ ...offerDetails, categoryName })}
                      alt={offerDetails.title}
                      className="offer-image"
                      onError={(e) => { e.target.src = defaultOfferImage; }}
                    />
                    <div className="discount-tag">{offerDetails.discount_percentage}% OFF</div>
                  </div>
                  <div className="offer-content">
                    <h3>{offerDetails.title}</h3>
                    <div className="offer-details">
                      <div className="offer-detail"><strong>Category:</strong> {categoryName}</div>
                      <div className="offer-detail"><strong>Subcategory:</strong> {subcategoryName}</div>
                      <div className="offer-detail"><strong>Valid Until:</strong> {offerDetails.valid_until}</div>
                    </div>
                    <p className="offer-description">{offerDetails.description}</p>
                    <button
                      className="shop-now-btn"
                      onClick={() => handleShopNow(categoryName, subcategoryName, offerDetails.products)}
                    >
                      Shop Now
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        ) : (
          <div className="no-offers">
            <p>No offers available right now.</p>
            <p>Check back soon for exciting deals!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default OffersPage;
