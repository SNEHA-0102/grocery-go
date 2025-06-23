// src/pages/Profile.jsx
import React from 'react';
import { useAuth } from '../context/AuthContext';
import './Profile.css';

const Profile = () => {
  const { currentUser, userProfile } = useAuth();

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
    </div>
  );
};

export default Profile;
