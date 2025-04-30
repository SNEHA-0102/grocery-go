// src/pages/Shop.jsx
import { useLocation, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { ref, get } from 'firebase/database';
import { db } from '../../firebaseConfig';
import ProductCard from '../components/ProductCard'; // ✅ Import reusable product card
import './Shop.css';

const Shop = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const category = searchParams.get('category');
  const subcategory = searchParams.get('subcategory');
  const productsParam = searchParams.get('products');

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      if (!category) {
        setLoading(false);
        return;
      }

      try {
        let productsRef;

        if (subcategory) {
          productsRef = ref(db, `products/${category}/${subcategory}`);
        } else {
          productsRef = ref(db, `products/${category}`);
        }

        const snapshot = await get(productsRef);

        if (snapshot.exists()) {
          const data = snapshot.val();
          let fetchedProducts = [];

          if (subcategory) {
            Object.keys(data).forEach(productId => {
              fetchedProducts.push({
                id: productId,
                ...data[productId]
              });
            });
          } else {
            Object.keys(data).forEach(subcat => {
              const productsInSubcat = data[subcat];
              Object.keys(productsInSubcat).forEach(productId => {
                fetchedProducts.push({
                  id: productId,
                  ...productsInSubcat[productId]
                });
              });
            });
          }

          if (productsParam) {
            const allowedIds = productsParam.split(',');
            fetchedProducts = fetchedProducts.filter(product => allowedIds.includes(product.id));
          }

          setProducts(fetchedProducts);
        } else {
          setProducts([]);
        }
      } catch (err) {
        console.error('Failed to fetch products:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [category, subcategory, productsParam]);

  if (loading) return <p>Loading products...</p>;

  return (
    <div className="shop-page">
      <h1>Shop</h1>
      {subcategory && <h2>Subcategory: {subcategory}</h2>}
      {category && <h2>Category: {category}</h2>}

      <div className="products-grid">
        {products.length > 0 ? (
          products.map(product => (
            <Link
              to={`/product/${product.id}?category=${encodeURIComponent(category)}&subcategory=${encodeURIComponent(subcategory || '')}`}
              key={product.id}
              className="product-link"
            >
              <ProductCard product={product} />
            </Link>
          ))
        ) : (
          <p>No products found.</p>
        )}
      </div>
    </div>
  );
};

export default Shop;
