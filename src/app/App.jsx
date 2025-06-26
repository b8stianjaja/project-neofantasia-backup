// src/app/App.jsx
import React, { useState, useCallback } from 'react';
import { Routes, Route } from 'react-router-dom';

// Pages
import HomePage from '../pages/HomePage/HomePage';
import BeatsPage from '../pages/BeatsPage/BeatsPage';
import ContactPage from '../pages/ContactPage/ContactPage';
import CartPage from '../pages/CartPage/CartPage';
import ProjectDashboard from '../pages/ProjectDashboard/ProjectDashboard';
import InteractionScreen from '../pages/InteractionScreen/InteractionScreen';

// *** THE FIX IS HERE ***
// The import path has been corrected from "../pages-new/..." to "../pages/...".
import DedicatedProjectRoom from '../pages/DedicatedProjectRoom/DedicatedProjectRoom';


// Contexts
import { MusicProvider } from '../context/MusicContext';
import { CartProvider } from '../context/CartContext.jsx';

// CSS
import './App.css';

function App() {
  const [hasInteracted, setHasInteracted] = useState(false);

  const handleInteraction = useCallback(() => {
    if (!hasInteracted) {
      setHasInteracted(true);
    }
  }, [hasInteracted]);

  return (
    <CartProvider>
      <MusicProvider>
        {!hasInteracted ? (
          <InteractionScreen onInteract={handleInteraction} />
        ) : (
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/beats" element={<BeatsPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/dashboard" element={<ProjectDashboard />} />
            <Route path="/projects/:projectId" element={<DedicatedProjectRoom />} />
          </Routes>
        )}
      </MusicProvider>
    </CartProvider>
  );
}

export default App;