import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged
} from 'firebase/auth';
import { auth, db } from '../../firebaseConfig';
import { ref, update } from 'firebase/database';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  function signup(email, password) {
    return createUserWithEmailAndPassword(auth, email, password);
  }

  function login(email, password) {
    return signInWithEmailAndPassword(auth, email, password);
  }

  function signOut() {
    if (currentUser) {
      // Update online status in database
      update(ref(db, 'users/' + currentUser.uid), {
        isOnline: false,
        lastSeen: new Date().toISOString()
      });
    }
    return firebaseSignOut(auth); // Sign out from Firebase
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      // When user logs in, update their online status
      if (user && !currentUser) {
        update(ref(db, 'users/' + user.uid), {
          isOnline: true,
          lastSeen: new Date().toISOString()
        });
      }
      
      setCurrentUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, [currentUser]);

  const value = {
    currentUser,
    signup,
    login,
    signOut, // This function is exported with this name
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}