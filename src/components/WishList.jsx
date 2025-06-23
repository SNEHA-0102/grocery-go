import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ref, onValue, remove, set, off } from 'firebase/database';
import { db } from '../../firebaseConfig';
import { useAuth } from '../context/AuthContext';
import './WishList.css'; // Fixed the import path - make sure this matches your CSS file name

const Wishlist = () => {
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!currentUser) {
      navigate('/');
      return;
    }

    const wishlistRef = ref(db, `wishlists/${currentUser.uid}`);
    
    const unsubscribe = onValue(wishlistRef, (snapshot) => {
      try {
        if (snapshot.exists()) {
          const wishlistData = snapshot.val();
          // Convert object to array with keys as ids
          const wishlistArray = Object.keys(wishlistData).map(key => ({
            id: key,
            ...wishlistData[key]
          }));
          setWishlistItems(wishlistArray);
        } else {
          setWishlistItems([]);
        }
        setLoading(false);
        setError(null);
      } catch (err) {
        console.error('Error loading wishlist:', err);
        setError('Failed to load wishlist');
        setLoading(false);
      }
    }, (error) => {
      console.error('Database error:', error);
      setError('Failed to connect to database');
      setLoading(false);
    });

    // Cleanup subscription on unmount
    return () => {
      unsubscribe();
      off(wishlistRef);
    };
  }, [currentUser, navigate]);

  const removeFromWishlist = async (itemId) => {
    try {
      const itemRef = ref(db, `wishlists/${currentUser.uid}/${itemId}`);
      await remove(itemRef);
      // Dispatch event to update navbar count
    window.dispatchEvent(new Event('wishlistUpdated'));
      // Show success message
      showNotification('Item removed from wishlist');
    } catch (error) {
      console.error('Error removing from wishlist:', error);
      showNotification('Failed to remove item', 'error');
    }
  };

  const addToCart = (item) => {
    if (!currentUser) {
      navigate('/login');
      return;
    }

    const existingCart = JSON.parse(localStorage.getItem('cart')) || [];
    const existingItemIndex = existingCart.findIndex(cartItem => cartItem.id === item.id);

    if (existingItemIndex !== -1) {
      existingCart[existingItemIndex].quantity += 1;
    } else {
      existingCart.push({
        id: item.id,
        name: item.name,
        price: item.price,
        image: item.image,
        quantity: 1,
        category: item.category,
        subcategory: item.subcategory,
        stock: item.stock
      });
    }

    localStorage.setItem('cart', JSON.stringify(existingCart));
    window.dispatchEvent(new Event('cartUpdated'));
    
    showNotification(`${item.name} added to cart!`);
  };

  const viewProductDetails = (item) => {
    const url = item.subcategory 
      ? `/product/${item.id}?category=${item.category}&subcategory=${item.subcategory}`
      : `/product/${item.id}?category=${item.category}`;
    navigate(url);
  };

  const clearWishlist = async () => {
    if (window.confirm('Are you sure you want to clear your entire wishlist?')) {
      try {
        const wishlistRef = ref(db, `wishlists/${currentUser.uid}`);
        await remove(wishlistRef);
        showNotification('Wishlist cleared successfully');
      } catch (error) {
        console.error('Error clearing wishlist:', error);
        showNotification('Failed to clear wishlist', 'error');
      }
    }
  };

  const showNotification = (message, type = 'success') => {
    const notification = document.createElement('div');
    notification.className = `wishlist-notification ${type}`;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
      if (document.body.contains(notification)) {
        document.body.removeChild(notification);
      }
    }, 3000);
  };

  // Migrate localStorage wishlist to Firebase on first load
  useEffect(() => {
    const migrateLocalWishlist = async () => {
      if (!currentUser) return;

      const localWishlistKey = `wishlist_${currentUser.uid}`;
      const localWishlist = JSON.parse(localStorage.getItem(localWishlistKey)) || [];
      
      if (localWishlist.length > 0) {
        try {
          const wishlistRef = ref(db, `wishlists/${currentUser.uid}`);
          const wishlistData = {};
          
          localWishlist.forEach(item => {
            wishlistData[item.id] = {
              name: item.name,
              price: item.price,
              image: item.image,
              category: item.category,
              subcategory: item.subcategory || null,
              stock: item.stock,
              brand: item.brand,
              addedAt: item.addedAt || new Date().toISOString()
            };
          });

          await set(wishlistRef, wishlistData);
          localStorage.removeItem(localWishlistKey);
          console.log('Wishlist migrated to Firebase');
        } catch (error) {
          console.error('Error migrating wishlist:', error);
        }
      }
    };

    migrateLocalWishlist();
  }, [currentUser]);

  if (loading) {
    return <div className="wishlist-loading">Loading your wishlist...</div>;
  }

  if (error) {
    return (
      <div className="wishlist-error">
        <p>{error}</p>
        <button onClick={() => window.location.reload()}>Retry</button>
      </div>
    );
  }

  if (!currentUser) {
    return null;
  }

  return (
    <div className="wishlist-container">
      <div className="wishlist-header">
        <h1>My Wishlist</h1>
        {wishlistItems.length > 0 && (
          <button className="clear-wishlist-btn" onClick={clearWishlist}>
            Clear All
          </button>
        )}
      </div>

      {wishlistItems.length === 0 ? (
        <div className="empty-wishlist">
          <div className="empty-wishlist-icon">💔</div>
          <h2>Your wishlist is empty</h2>
          <p>Start adding items you love to your wishlist!</p>
          <button className="browse-products-btn" onClick={() => navigate('/')}>
            Browse Products
          </button>
        </div>
      ) : (
        <div className="wishlist-grid">
          {wishlistItems.map((item) => (
            <div key={item.id} className="wishlist-item">
              <div className="wishlist-item-image">
                <img
                  src={item.image}
                  alt={item.name}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = '/images/products/default.jpg';
                  }}
                  onClick={() => viewProductDetails(item)}
                />
                <button
                  className="remove-from-wishlist"
                  onClick={() => removeFromWishlist(item.id)}
                  title="Remove from wishlist"
                >
                  ×
                </button>
              </div>

              <div className="wishlist-item-details">
                <h3 onClick={() => viewProductDetails(item)}>{item.name}</h3>
                <p className="wishlist-item-brand">{item.brand}</p>
                <p className="wishlist-item-price">₹{item.price}</p>
                
                <div className="wishlist-item-actions">
                  <button
                    className="add-to-cart-from-wishlist"
                    onClick={() => addToCart(item)}
                    disabled={item.stock <= 0}
                  >
                    {item.stock <= 0 ? 'Out of Stock' : 'Add to Cart 🛒'}
                  </button>
                  <button
                    className="view-details-btn"
                    onClick={() => viewProductDetails(item)}
                  >
                    View Details
                  </button>
                </div>

                <p className="wishlist-item-added">
                  Added on {new Date(item.addedAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="wishlist-summary">
        <p>Total items in wishlist: {wishlistItems.length}</p>
      </div>
    </div>
  );
};

export default Wishlist; 
