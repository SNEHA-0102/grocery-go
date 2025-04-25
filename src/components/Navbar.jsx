import React from 'react';

const Navbar = () => {
  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        {/* Logo */}
        <div className="text-2xl font-bold text-green-600">
          Grocery<span className="text-yellow-500">Go</span>
        </div>

        {/* Navigation Links */}
        <div className="hidden md:flex space-x-6">
          <a href="#" className="text-gray-700 hover:text-green-600 transition">Home</a>
          <a href="#" className="text-gray-700 hover:text-green-600 transition">Products</a>
          <a href="#" className="text-gray-700 hover:text-green-600 transition">About</a>
          <a href="#" className="text-gray-700 hover:text-green-600 transition">Contact</a>
        </div>

        {/* Cart / Login */}
        <div className="flex items-center space-x-4">
          <button className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition">
            Login
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
