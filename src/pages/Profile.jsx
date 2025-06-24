// src/pages/Profile.jsx
import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import './Profile.css';
import { db } from '../../firebaseConfig'; // Ensure this exports your Realtime DB
import { ref, onValue, remove } from 'firebase/database';

const Profile = () => {
  const { currentUser, userProfile } = useAuth();
  const [userReviews, setUserReviews] = useState([]);

  useEffect(() => {
    if (!currentUser) return;

    const reviewsRef = ref(db, 'reviews/');
    onValue(reviewsRef, (snapshot) => {
      const data = snapshot.val();
      const reviewsArray = [];

      for (let key in data) {
        if (data[key].userId === currentUser.uid) {
          reviewsArray.push({ id: key, ...data[key] });
        }
      }

      setUserReviews(reviewsArray);
    });
  }, [currentUser]);

  const handleDelete = (reviewId) => {
    if (window.confirm("Are you sure you want to delete this review?")) {
      remove(ref(db, `reviews/${reviewId}`))
        .then(() => {
          setUserReviews((prev) => prev.filter((r) => r.id !== reviewId));
        })
        .catch((error) => {
          console.error("Error deleting review:", error);
        });
    }
  };

  if (!currentUser) {
    return (
      <div className="profile-page">
        <h2>Please log in to view your profile.</h2>
      </div>
    );
  }

  return (
    <div className="profile-page">
      <div className="profile-card">
        <div className="profile-header">
          <h2>Hello, {userProfile?.displayName || "User"} 👋</h2>
          <p className="email">{currentUser.email}</p>
        </div>
        <div className="profile-details">
          <div className="detail">
            <span className="label">Account Status:</span>
            <span className={`value ${userProfile?.isOnline ? "online" : "offline"}`}>
              {userProfile?.isOnline ? "Online" : "Offline"}
            </span>
          </div>
          <div className="detail">
            <span className="label">Last Seen:</span>
            <span className="value">
              {userProfile?.lastSeen
                ? new Date(userProfile.lastSeen).toLocaleString()
                : "N/A"}
            </span>
          </div>
          <div className="detail">
            <span className="label">UID:</span>
            <span className="value">{currentUser.uid}</span>
          </div>
          <div className="detail">
            <span className="label">Email Verified:</span>
            <span className="value">
              {currentUser.emailVerified ? "Yes ✅" : "No ❌"}
            </span>
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="user-reviews">
        <h3>Your Reviews</h3>
        {userReviews.length === 0 ? (
          <p>No reviews found.</p>
        ) : (
          <ul className="review-list">
            {userReviews.map((review) => (
              <li key={review.id} className="review-item">
                <p><strong>Rating:</strong> ⭐ {review.rating}</p>
                <p><strong>Review:</strong> {review.content}</p>
                <p className="timestamp">{new Date(review.timestamp).toLocaleString()}</p>
                <button onClick={() => handleDelete(review.id)} className="delete-btn">
                  Delete ❌
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Profile;
