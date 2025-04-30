import React from 'react';

const formatFileName = (name) => name.toLowerCase().replace(/\s+/g, '_') + '.jpg';

const ProductCard = ({ product }) => {
  const imageName = formatFileName(product.Product_Name);
  const imagePath = `/images/products/${imageName}`;

  return (
    <div className="product-card rounded-xl shadow-md p-4">
      <img
        src={imagePath}
        alt={product.Product_Name}
        className="w-full h-40 object-cover rounded-lg"
        onError={(e) => { e.target.src = '/images/products/default.jpg'; }}
      />
      <h3 className="text-lg font-semibold mt-2">{product.Product_Name}</h3>
      <p className="text-gray-600">₹{product.Unit_Price}</p>
    </div>
  );
};

export default ProductCard;
