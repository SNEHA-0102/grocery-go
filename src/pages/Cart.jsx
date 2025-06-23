import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Cart.css';

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load cart items from localStorage
    const loadCart = () => {
      const items = JSON.parse(localStorage.getItem('cart')) || [];
      setCartItems(items);
      setLoading(false);
    };
    
    loadCart();
    
    // Listen for cart updates from other components
    window.addEventListener('cartUpdated', loadCart);
    
    return () => {
      window.removeEventListener('cartUpdated', loadCart);
    };
  }, []);

  const updateQuantity = (id, newQuantity) => {
    if (newQuantity <= 0) {
      removeItem(id);
      return;
    }

    const updatedCart = cartItems.map(item => {
      if (item.id === id) {
        // Make sure quantity doesn't exceed stock
        const quantity = Math.min(newQuantity, item.stock);
        return { ...item, quantity };
      }
      return item;
    });

    setCartItems(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
    
    // Notify other components about cart update
    window.dispatchEvent(new Event('cartUpdated'));
  };

  const removeItem = (id) => {
    const updatedCart = cartItems.filter(item => item.id !== id);
    setCartItems(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
    
    // Notify other components about cart update
    window.dispatchEvent(new Event('cartUpdated'));
  };

  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem('cart');
    
    // Notify other components about cart update
    window.dispatchEvent(new Event('cartUpdated'));
  };

  // Calculate total price
  const totalPrice = cartItems.reduce((total, item) => 
    total + (parseFloat(item.price) * item.quantity), 0);
    
  // Calculate total items
  const totalItems = cartItems.reduce((total, item) => total + item.quantity, 0);

  if (loading) return <p className="loading-message">Loading cart...</p>;

  return (
    <div className="cart-container">
      <h1>Your Shopping Cart</h1>
      
      {cartItems.length === 0 ? (
        <div className="empty-cart">
          <div className="empty-cart-icon">🛒</div>
          <h2>Your cart is empty</h2>
          <p>Looks like you haven't added any products to your cart yet.</p>
          <Link to="/" className="continue-shopping-btn">Continue Shopping</Link>
        </div>
      ) : (
        <>
          <div className="cart-summary-top">
            <h2>Your Items ({totalItems})</h2>
          </div>
          
          <div className="cart-items">
            {cartItems.map(item => (
              <div key={item.id} className="cart-item">
                <div className="item-image">
                  <img src={item.image} alt={item.name} />
                </div>
                <div className="item-details">
                  <h3>{item.name}</h3>
                  <p className="item-price">₹{item.price} per unit</p>
                </div>
                <div className="item-quantity">
                  <button 
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    className="quantity-btn"
                  >
                    -
                  </button>
                  <span>{item.quantity}</span>
                  <button 
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="quantity-btn"
                    disabled={item.quantity >= item.stock}
                  >
                    +
                  </button>
                </div>
                <div className="item-subtotal">
                  ₹{(item.price * item.quantity).toFixed(2)}
                </div>
                <button 
                  onClick={() => removeItem(item.id)}
                  className="remove-item-btn"
                  aria-label="Remove item"
                >
                  ✖
                </button>
              </div>
            ))}
          </div>
          
          <div className="cart-summary">
            <div className="cart-total">
              <span>Total ({totalItems} items):</span>
              <span className="total-price">₹{totalPrice.toFixed(2)}</span>
            </div>
            <div className="cart-actions">
              <button className="clear-cart-btn" onClick={clearCart}>Clear Cart</button>
              <Link to="/" className="continue-shopping-btn">Continue Shopping</Link>
             <Link to="/checkout" className="checkout-btn">Proceed to Checkout</Link>

            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Cart;