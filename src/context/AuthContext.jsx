import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut as firebaseSignOut,
  onAuthStateChanged 
} from 'firebase/auth';
import { auth, db } from '../../firebaseConfig';
import { ref, update, onDisconnect, onValue } from 'firebase/database';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userProfile, setUserProfile] = useState(null);

  function signup(email, password) {
    return createUserWithEmailAndPassword(auth, email, password);
  }

  function login(email, password) {
    return signInWithEmailAndPassword(auth, email, password);
  }

  function signOut() {
    // Update user status to offline in database before signing out
    if (currentUser) {
      update(ref(db, 'users/' + currentUser.uid), {
        isOnline: false,
        lastSeen: new Date().toISOString()
      });
    }
    return firebaseSignOut(auth);
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      
      if (user) {
        // Set up user status tracking
        const userStatusRef = ref(db, 'users/' + user.uid);
        
        // Update online status when user logs in
        update(userStatusRef, {
          isOnline: true,
          lastSeen: new Date().toISOString()
        });
        
        // Set up disconnect hook to update status when user disconnects
        onDisconnect(userStatusRef).update({
          isOnline: false,
          lastSeen: new Date().toISOString()
        });
        
        // Listen for user profile changes
        const profileListener = onValue(userStatusRef, (snapshot) => {
          const data = snapshot.val();
          if (data) {
            setUserProfile(data);
          }
        });
        
        return () => {
          profileListener();
        };
      } else {
        setUserProfile(null);
      }
      
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    userProfile,
    signup,
    login,
    signOut,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}