import React from 'react';
import { Routes, Route } from 'react-router-dom';
import './App.css';
import { useMusic } from '../context/MusicContext';

import InteractionScreen from '../pages/InteractionScreen/InteractionScreen';
import HomePage from '../pages/HomePage/HomePage';
import BeatsPage from '../pages/BeatsPage/BeatsPage';
import CartPage from '../pages/CartPage/CartPage';
import CollaborationHub from '../pages/CollaborationHub/CollaborationHub';

function App() {
  const { isUnlocked } = useMusic();

  return (
    <>
      {!isUnlocked && <InteractionScreen />}
      <div className="app-container" style={{ visibility: isUnlocked ? 'visible' : 'hidden' }}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/beats" element={<BeatsPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/hub" element={<CollaborationHub />} />
        </Routes>
      </div>
    </>
  );
}

export default App;