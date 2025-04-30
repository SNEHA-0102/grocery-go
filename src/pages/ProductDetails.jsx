import { useParams, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { ref, get } from 'firebase/database';
import { db } from '../../firebaseConfig';
import { useAuth } from '../context/AuthContext';
import Login from './Login';
import './ProductDetails.css';

// ✅ Format product name into image filename
const formatFileName = (name) =>
  name.toLowerCase().replace(/\s+/g, '_').replace(/[^\w_]/g, '') + '.jpg';

const ProductDetails = () => {
  const { id } = useParams();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const category = searchParams.get('category');
  const subcategory = searchParams.get('subcategory');

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);

  const { currentUser } = useAuth();
  const [showLoginModal, setShowLoginModal] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!category || !id) return;

      try {
        if (subcategory) {
          const productRef = ref(db, `products/${category}/${subcategory}/${id}`);
          const snapshot = await get(productRef);

          if (snapshot.exists()) {
            setProduct(snapshot.val());
          }
        } else {
          const categoryRef = ref(db, `products/${category}`);
          const snapshot = await get(categoryRef);

          if (snapshot.exists()) {
            const data = snapshot.val();
            for (const subcat in data) {
              if (data[subcat][id]) {
                setProduct(data[subcat][id]);
                break;
              }
            }
          }
        }
      } catch (err) {
        console.error('Failed to fetch product:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id, category, subcategory]);

  useEffect(() => {
    let timeout;
    if (addedToCart) {
      timeout = setTimeout(() => {
        setAddedToCart(false);
      }, 3000);
    }
    return () => clearTimeout(timeout);
  }, [addedToCart]);

  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value);
    if (value > 0 && value <= product.Stock_Quantity) {
      setQuantity(value);
    }
  };

  const increaseQuantity = () => {
    if (quantity < product.Stock_Quantity) {
      setQuantity(quantity + 1);
    }
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const addToCart = () => {
    if (!currentUser) {
      setShowLoginModal(true);
      return;
    }

    const existingCart = JSON.parse(localStorage.getItem('cart')) || [];
    const existingItemIndex = existingCart.findIndex(item => item.id === id);

    if (existingItemIndex !== -1) {
      existingCart[existingItemIndex].quantity += quantity;
    } else {
      existingCart.push({
        id,
        name: product.Product_Name,
        price: product.Unit_Price,
        image: `/images/products/${formatFileName(product.Product_Name)}`,
        quantity,
        category,
        subcategory: subcategory || null,
        stock: product.Stock_Quantity
      });
    }

    localStorage.setItem('cart', JSON.stringify(existingCart));
    window.dispatchEvent(new Event('cartUpdated'));
    setAddedToCart(true);
    setQuantity(1);
  };

  if (loading) return <p className="loading-message">Loading product details...</p>;
  if (!product) return <p className="error-message">Product not found.</p>;

  return (
    <>
      <div className="product-details-page">
        <div className="product-image-section">
          <img
            src={`/images/products/${formatFileName(product.Product_Name)}`}
            alt={product.Product_Name}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = '/images/products/default.jpg';
            }}
          />
        </div>

        <div className="product-info-section">
          <h1>{product.Product_Name}</h1>
          <p><strong>Brand:</strong> {product.Brand}</p>
          <p><strong>Description:</strong> {product.Description}</p>
          <p className="price"><strong>Price:</strong> ₹{product.Unit_Price}</p>
          <p><strong>Stock:</strong> {product.Stock_Quantity} units</p>
          <p><strong>Sales Volume:</strong> {product.Sales_Volume}</p>
          <p><strong>Expiry Date:</strong> {product.Expiry_Date}</p>
          <p><strong>Warehouse Location:</strong> {product.Warehouse_Location}</p>

          <div className="quantity-control">
            <span><strong>Quantity:</strong></span>
            <button onClick={decreaseQuantity} className="quantity-btn">-</button>
            <input 
              type="number" 
              value={quantity} 
              onChange={handleQuantityChange} 
              min="1" 
              max={product.Stock_Quantity} 
            />
            <button onClick={increaseQuantity} className="quantity-btn">+</button>
          </div>

          <div className="buttons-section">
            <button 
              className={`add-to-cart-btn ${addedToCart ? 'added' : ''}`} 
              onClick={addToCart}
            >
              {addedToCart ? 'Added ✓' : 'Add to Cart 🛒'}
            </button>
            <button className="add-to-wishlist-btn">Add to Wishlist ❤️</button>
          </div>

          {addedToCart && (
            <div className="cart-success-message">
              {quantity} {quantity > 1 ? 'items' : 'item'} added to cart!
            </div>
          )}
        </div>
      </div>

      {showLoginModal && (
        <Login 
          isOpen={showLoginModal}
          onClose={() => setShowLoginModal(false)}
          onSwitch={() => {}}
        />
      )}
    </>
  );
};

export default ProductDetails;
