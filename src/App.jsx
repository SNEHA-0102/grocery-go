// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer'; // ✅ Added Footer import
import Home from './pages/Home';
import Categories from './pages/Categories';
import Shop from './pages/Shop';
import ProductDetails from './pages/ProductDetails';
import Cart from './pages/Cart';
import Profile from './pages/Profile';
import Contact from './pages/Contact';
import Checkout from './pages/Checkout';
import OrderSuccess from './pages/OrderSuccess';
import ScrollToTop from "./components/ScrollToTop";
import WishList from './components/WishList';

import './App.css';


function App() {
  return (
    <AuthProvider>
      <Router>
         <ScrollToTop />
        <div className="App">
          <Navbar />
          <main className="main-content">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/categories" element={<Categories />} />
              <Route path="/product/:id" element={<ProductDetails />} />
              <Route path="/shop" element={<Shop />} />
           <Route path="/wishlist" element={<WishList />} /> 
              <Route path="/contact" element={<Contact/>} />
              <Route path="/cart" element={ <Cart/> } />
              <Route path="/profile" element={<Profile />} />
        <Route path="/checkout" element={<Checkout />} />
<Route path="/order-success" element={<OrderSuccess />} />
              <Route path="*" element={
                <div className="placeholder-page">
                  <h1>404</h1>
                  <p>Page not found</p>
                </div>
              } />
            </Routes>
          </main>

          <Footer /> 
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
