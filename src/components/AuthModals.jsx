// src/components/AuthModals.js
import React, { useState } from 'react';
import Login from '../pages/Login';
import SignUp from '../pages/Signup';

const AuthModals = ({ initialMode = 'login', onClose }) => {
  const [isLoginOpen, setIsLoginOpen] = useState(initialMode === 'login');
  const [isSignUpOpen, setIsSignUpOpen] = useState(initialMode === 'signup');

  const openLogin = () => {
    setIsLoginOpen(true);
    setIsSignUpOpen(false);
  };

  const openSignUp = () => {
    setIsLoginOpen(false);
    setIsSignUpOpen(true);
  };

  const closeModals = () => {
    setIsLoginOpen(false);
    setIsSignUpOpen(false);
    if (onClose) onClose(); // Call the parent onClose function to update the parent state
  };

  return (
    <>
      <Login 
        isOpen={isLoginOpen} 
        onClose={closeModals} 
        onSwitch={openSignUp} 
      />
      <SignUp 
        isOpen={isSignUpOpen} 
        onClose={closeModals} 
        onSwitch={openLogin} 
      />
    </>
  );
};

export default AuthModals;