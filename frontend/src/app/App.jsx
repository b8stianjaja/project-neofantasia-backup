// frontend/src/app/App.jsx

import React from 'react';
import { Routes, Route } from 'react-router-dom';
import './App.css';
import { useMusic } from '../context/MusicContext';

import InteractionScreen from '../pages/InteractionScreen/InteractionScreen';
import HomePage from '../pages/HomePage/HomePage';
import BeatsPage from '../pages/BeatsPage/BeatsPage';
import CrystalPage from '../pages/CrystalPage/CrystalPage'; // Import new page
import CollaborationHub from '../pages/CollaborationHub/CollaborationHub';
import AdminPage from '../pages/AdminPage/AdminPage';

function App() {
  const { isUnlocked } = useMusic();

  return (
    <>
      {!isUnlocked && <InteractionScreen />}
      <div className="app-container" style={{ visibility: isUnlocked ? 'visible' : 'hidden' }}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/beats" element={<BeatsPage />} />
          <Route path="/crystal" element={<CrystalPage />} /> {/* Add new route */}
          <Route path="/hub" element={<CollaborationHub />} />
          <Route path="/admin" element={<AdminPage />} />
        </Routes>
      </div>
    </>
  );
}

export default App;