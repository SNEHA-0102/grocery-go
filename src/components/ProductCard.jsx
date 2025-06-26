// import React from 'react';

// const formatFileName = (name) => name.toLowerCase().replace(/\s+/g, '_') + '.jpg';

// const ProductCard = ({ product }) => {
//   const imageName = formatFileName(product.Product_Name);
//   const imagePath = `/images/products/${imageName}`;

//   return (
//     <div className="product-card rounded-xl shadow-md p-4">
//       <img
//         src={imagePath}
//         alt={product.Product_Name}
//         className="w-full h-40 object-cover rounded-lg"
//         onError={(e) => { e.target.src = '/images/products/default.jpg'; }}
//       />
//       <h3 className="text-lg font-semibold mt-2">{product.Product_Name}</h3>
//       <p className="text-gray-600">₹{product.Unit_Price}</p>
//     </div>
//   );
// };

// export default ProductCard;




// src/components/ProductCard.jsx (as referenced in SeasonalProducts)
import React from 'react';
import { Link } from 'react-router-dom';

const ProductCard = ({ product }) => {
  const { id, name, image, price, originalPrice, category, unit } = product;
  
  const hasDiscount = originalPrice && originalPrice > price;
  const discountPercentage = hasDiscount 
    ? Math.round(((originalPrice - price) / originalPrice) * 100) 
    : 0;
  
  return (
    <div className="product-card">
      <Link to={`/product/${id}`} className="product-link">
        {hasDiscount && (
          <span className="discount-badge">{discountPercentage}% OFF</span>
        )}
        <div className="product-image-container">
          <img src={image} alt={name} className="product-image" />
        </div>
        <div className="product-info">
          <h3 className="product-name">{name}</h3>
          <p className="product-category">{category} • {unit}</p>
          <div className="product-price-container">
            <span className="product-price">${price.toFixed(2)}</span>
            {hasDiscount && (
              <span className="product-original-price">${originalPrice.toFixed(2)}</span>
            )}
          </div>
        </div>
      </Link>
      <button className="add-to-cart-btn">
        <i className="fas fa-shopping-cart"></i> Add to Cart
      </button>
    </div>
  );
};

export default ProductCard;