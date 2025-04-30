import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import './Profile.css';

const Profile = () => {
  const { currentUser, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('info');
  const [userInfo, setUserInfo] = useState({
    name: '',
    email: currentUser ? currentUser.email : '',
    phone: '',
    address: '',
  });
  const [isEditing, setIsEditing] = useState(false);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading user data from database
    const fetchUserInfo = () => {
      // In a real app, fetch this from your database
      setTimeout(() => {
        if (currentUser) {
          setUserInfo({
            name: 'John Doe', // Default name for demo
            email: currentUser.email,
            phone: '+91 98765 43210', // Default phone for demo
            address: '123 Main Street, Bangalore, Karnataka 560001', // Default address for demo
          });
        }
        setLoading(false);
      }, 800);
    };

    // Simulate loading order history
    const fetchOrders = () => {
      // In a real app, fetch this from your database
      setTimeout(() => {
        setOrders([
          {
            id: 'ORD-2025-0401',
            date: 'April 1, 2025',
            status: 'Delivered',
            items: 5,
            total: 1245.50,
          },
          {
            id: 'ORD-2025-0325',
            date: 'March 25, 2025',
            status: 'Processing',
            items: 3,
            total: 780.75,
          },
          {
            id: 'ORD-2025-0310',
            date: 'March 10, 2025',
            status: 'Delivered',
            items: 8,
            total: 2340.00,
          },
          {
            id: 'ORD-2025-0228',
            date: 'February 28, 2025',
            status: 'Delivered',
            items: 4,
            total: 1120.25,
          }
        ]);
      }, 1000);
    };

    fetchUserInfo();
    fetchOrders();
  }, [currentUser]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserInfo({
      ...userInfo,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // In a real app, save the updated user info to the database
    setIsEditing(false);
    // Show success message (you could add a toast notification here)
    alert('Profile updated successfully!');
  };

  const handleLogout = async () => {
    try {
      await logout();
      // Redirect to home page would be handled by your auth context
    } catch (error) {
      console.error('Failed to log out', error);
    }
  };

  if (!currentUser) {
    return (
      <div className="profile-container">
        <div className="not-logged-in">
          <h2>Please log in to view your profile</h2>
          <p>You need to be logged in to access your profile and order history.</p>
          <div className="action-buttons">
            <Link to="/" className="btn btn-secondary">Back to Home</Link>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="profile-container">
        <div className="loading-profile">
          <div className="loading-spinner"></div>
          <p>Loading your profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-container">
      <div className="profile-header">
        <div className="profile-avatar">
          {userInfo.name ? userInfo.name.charAt(0).toUpperCase() : '?'}
        </div>
        <div className="profile-title">
          <h1>My Profile</h1>
          <p>Manage your account information and track orders</p>
        </div>
      </div>

      <div className="profile-tabs">
        <button 
          className={`tab-btn ${activeTab === 'info' ? 'active' : ''}`}
          onClick={() => setActiveTab('info')}
        >
          Account Information
        </button>
        <button 
          className={`tab-btn ${activeTab === 'orders' ? 'active' : ''}`}
          onClick={() => setActiveTab('orders')}
        >
          Order History
        </button>
        <button 
          className={`tab-btn ${activeTab === 'settings' ? 'active' : ''}`}
          onClick={() => setActiveTab('settings')}
        >
          Settings
        </button>
      </div>

      <div className="profile-content">
        {activeTab === 'info' && (
          <div className="profile-info">
            <div className="info-header">
              <h2>Personal Information</h2>
              {!isEditing && (
                <button 
                  className="edit-btn"
                  onClick={() => setIsEditing(true)}
                >
                  Edit
                </button>
              )}
            </div>

            {isEditing ? (
              <form className="edit-form" onSubmit={handleSubmit}>
                <div className="form-group">
                  <label htmlFor="name">Full Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={userInfo.name}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="email">Email Address</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={userInfo.email}
                    onChange={handleInputChange}
                    required
                    disabled
                  />
                  <small>Email cannot be changed</small>
                </div>

                <div className="form-group">
                  <label htmlFor="phone">Phone Number</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={userInfo.phone}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="address">Delivery Address</label>
                  <textarea
                    id="address"
                    name="address"
                    value={userInfo.address}
                    onChange={handleInputChange}
                    rows="3"
                  ></textarea>
                </div>

                <div className="form-actions">
                  <button type="button" className="cancel-btn" onClick={() => setIsEditing(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="save-btn">
                    Save Changes
                  </button>
                </div>
              </form>
            ) : (
              <div className="info-details">
                <div className="info-item">
                  <span className="info-label">Full Name</span>
                  <span className="info-value">{userInfo.name}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Email Address</span>
                  <span className="info-value">{userInfo.email}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Phone Number</span>
                  <span className="info-value">{userInfo.phone || 'Not provided'}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Delivery Address</span>
                  <span className="info-value">{userInfo.address || 'Not provided'}</span>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'orders' && (
          <div className="profile-orders">
            <h2>Your Orders</h2>
            
            {orders.length === 0 ? (
              <div className="no-orders">
                <div className="no-orders-icon">📦</div>
                <p>You haven't placed any orders yet.</p>
                <Link to="/" className="shop-now-btn">Shop Now</Link>
              </div>
            ) : (
              <div className="orders-list">
                {orders.map(order => (
                  <div key={order.id} className="order-card">
                    <div className="order-header">
                      <div className="order-id">Order #{order.id}</div>
                      <div className={`order-status ${order.status.toLowerCase()}`}>
                        {order.status}
                      </div>
                    </div>
                    <div className="order-details">
                      <div className="order-info">
                        <div className="order-date">
                          <span className="label">Date:</span> {order.date}
                        </div>
                        <div className="order-items">
                          <span className="label">Items:</span> {order.items}
                        </div>
                        <div className="order-total">
                          <span className="label">Total:</span> ₹{order.total.toFixed(2)}
                        </div>
                      </div>
                      <Link to={`/order/${order.id}`} className="view-details-btn">
                        View Details
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="profile-settings">
            <h2>Account Settings</h2>
            
            <div className="settings-section">
              <h3>Password</h3>
              <p>Change your account password</p>
              <button className="btn btn-secondary">Change Password</button>
            </div>
            
            <div className="settings-section">
              <h3>Notifications</h3>
              <div className="notification-option">
                <label>
                  <input type="checkbox" defaultChecked /> 
                  Email notifications for orders
                </label>
              </div>
              <div className="notification-option">
                <label>
                  <input type="checkbox" defaultChecked /> 
                  SMS notifications for deliveries
                </label>
              </div>
              <div className="notification-option">
                <label>
                  <input type="checkbox" /> 
                  Marketing emails and offers
                </label>
              </div>
            </div>
            
            <div className="settings-section danger-zone">
              <h3>Account Actions</h3>
              <button className="logout-btn" onClick={handleLogout}>
                Log Out
              </button>
              <button className="delete-account-btn">
                Delete Account
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;