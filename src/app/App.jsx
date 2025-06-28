// src/app/App.jsx
import React, { useState, useCallback } from 'react';
import { Routes, Route } from 'react-router-dom';

// Pages
import HomePage from '../pages/HomePage/HomePage';
import BeatsPage from '../pages/BeatsPage/BeatsPage';
import ContactPage from '../pages/ContactPage/ContactPage';
import CartPage from '../pages/CartPage/CartPage';
import CollaborationHub from '../pages/CollaborationHub/CollaborationHub'; // Updated import
import InteractionScreen from '../pages/InteractionScreen/InteractionScreen';

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
            <Route path="/hub" element={<CollaborationHub />} /> {/* Updated route */}
            {/* The dedicated project room route might still be useful for direct links,
                but the primary interaction is now through the hub. */}
            {/* <Route path="/projects/:projectId" element={<DedicatedProjectRoom />} /> */}
          </Routes>
        )}
      </MusicProvider>
    </CartProvider>
  );
}

export default App;