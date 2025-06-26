import React, { useState, useContext } from "react";
import { Routes, Route } from "react-router-dom";
import "./App.css";
import { MusicProvider, useMusic } from "../context/MusicContext.jsx";
import { CartProvider } from "../context/CartContext.jsx";

import HomePage from "../pages/HomePage/HomePage.jsx";
import BeatsPage from "../pages/BeatsPage/BeatsPage.jsx";
import CartPage from "../pages/CartPage/CartPage.jsx";
import ContactPage from "../pages/ContactPage/ContactPage.jsx";
// REMOVED: No longer importing the old LoadPage
// import LoadPage from "../pages/LoadPage/LoadPage.jsx";
// ADDED: Import the new ProjectDashboard
import ProjectDashboard from "../pages/ProjectDashboard/ProjectDashboard.jsx";
import InteractionScreen from "../pages/InteractionScreen/InteractionScreen.jsx";
import { Howler } from "howler";

const AppContent = () => {
    const [showInteractionScreen, setShowInteractionScreen] = useState(true);
    const music = useMusic();

    const handleInteraction = () => {
        if (showInteractionScreen) {
            setShowInteractionScreen(false);
            Howler.ctx.resume().then(() => {
                if (music && typeof music.playSound === 'function') {
                    music.playSound('intro');
                }
            });
        }
    };

    return (
        <>
            {showInteractionScreen ? (
                <InteractionScreen onInteract={handleInteraction} />
            ) : (
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/beats" element={<BeatsPage />} />
                    <Route path="/cart" element={<CartPage />} />
                    <Route path="/contact" element={<ContactPage />} />
                    {/* MODIFIED: Replaced LoadPage with ProjectDashboard */}
                    <Route path="/dashboard" element={<ProjectDashboard />} />
                    {/* This will be used in the next step */}
                    {/* <Route path="/projects/:projectId" element={<ProjectRoom />} /> */}
                </Routes>
            )}
        </>
    );
};

function App() {
  return (
    <MusicProvider>
      <CartProvider>
        <AppContent />
      </CartProvider>
    </MusicProvider>
  );
}

export default App;
