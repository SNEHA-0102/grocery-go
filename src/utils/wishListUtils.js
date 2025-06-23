// src/utils/wishlistUtils.js
import { ref, set, remove, get } from 'firebase/database';
import { db } from '../../firebaseConfig';

// Add item to wishlist
export const addToWishlist = async (userId, itemId, itemData) => {
  try {
    const wishlistItemRef = ref(db, `wishlists/${userId}/${itemId}`);
    const wishlistItem = {
      name: itemData.name,
      price: itemData.price,
      image: itemData.image,
      category: itemData.category,
      subcategory: itemData.subcategory || null,
      stock: itemData.stock,
      brand: itemData.brand,
      addedAt: new Date().toISOString()
    };
    
    await set(wishlistItemRef, wishlistItem);
    return { success: true, message: 'Added to wishlist!' };
  } catch (error) {
    console.error('Error adding to wishlist:', error);
    return { success: false, message: 'Failed to add to wishlist' };
  }
};

// Remove item from wishlist
export const removeFromWishlist = async (userId, itemId) => {
  try {
    const wishlistItemRef = ref(db, `wishlists/${userId}/${itemId}`);
    await remove(wishlistItemRef);
    return { success: true, message: 'Removed from wishlist' };
  } catch (error) {
    console.error('Error removing from wishlist:', error);
    return { success: false, message: 'Failed to remove from wishlist' };
  }
};

// Check if item is in wishlist
export const checkWishlistStatus = async (userId, itemId) => {
  try {
    const wishlistItemRef = ref(db, `wishlists/${userId}/${itemId}`);
    const snapshot = await get(wishlistItemRef);
    return snapshot.exists();
  } catch (error) {
    console.error('Error checking wishlist status:', error);
    return false;
  }
};

// Clear entire wishlist
export const clearWishlist = async (userId) => {
  try {
    const wishlistRef = ref(db, `wishlists/${userId}`);
    await remove(wishlistRef);
    return { success: true, message: 'Wishlist cleared successfully' };
  } catch (error) {
    console.error('Error clearing wishlist:', error);
    return { success: false, message: 'Failed to clear wishlist' };
  }
};

// Get wishlist count
export const getWishlistCount = async (userId) => {
  try {
    const wishlistRef = ref(db, `wishlists/${userId}`);
    const snapshot = await get(wishlistRef);
    
    if (snapshot.exists()) {
      return Object.keys(snapshot.val()).length;
    }
    return 0;
  } catch (error) {
    console.error('Error getting wishlist count:', error);
    return 0;
  }
};

// Migrate localStorage wishlist to Firebase
export const migrateLocalWishlist = async (userId) => {
  try {
    const localWishlistKey = `wishlist_${userId}`;
    const localWishlist = JSON.parse(localStorage.getItem(localWishlistKey)) || [];
    
    if (localWishlist.length > 0) {
      const wishlistRef = ref(db, `wishlists/${userId}`);
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
      
      return { 
        success: true, 
        message: `${localWishlist.length} items migrated to cloud wishlist`,
        count: localWishlist.length 
      };
    }
    
    return { success: true, message: 'No local wishlist to migrate', count: 0 };
  } catch (error) {
    console.error('Error migrating wishlist:', error);
    return { success: false, message: 'Failed to migrate wishlist' };
  }
};