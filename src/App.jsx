// App.jsx
import React from 'react';
import Navbar from './components/Navbar'; 
import Home from './pages/Home';
import './App.css';

function App() {
  return (
    <div className="App">
      <Navbar />
     <Home></Home>
    </div>
  );
}

export default App;