// src/entities/beat/BeatCard.jsx
import React, { useState, useRef } from 'react';
import { useMusic } from '../../context/MusicContext';
import { useCart } from '../../context/CartContext';
import './BeatCard.css';

function BeatCard({ beat, cardIndex, totalCards, isActive }) {
  // Use activeTrack and playBeat for consistency
  const { playBeat, activeTrack, isPlaying } = useMusic();
  const { addToCart } = useCart();
  const cardRef = useRef(null);
  const [dynamicStyle, setDynamicStyle] = useState({});

  // Check if this specific beat is the active one and is currently playing
  const isThisBeatPlaying = activeTrack?.id === beat.id && isPlaying;

  const handlePlayClick = (e) => {
    e.stopPropagation(); // Prevent potential parent click events
    playBeat(beat); // Use playBeat as defined in MusicContext
  };

  const handleAddToCart = (e) => {
    e.stopPropagation(); // Prevent potential parent click events
    addToCart(beat);
  };

  // Mouse move effect for 3D tilt
  const handleMouseMove = (e) => {
    if (!isActive || !cardRef.current) return;
    const { clientX, clientY } = e;
    const { top, left, width, height } = cardRef.current.getBoundingClientRect();
    const x = (clientX - left - width / 2) / 15; // Adjust divisor for tilt intensity
    const y = -(clientY - top - height / 2) / 15;
    setDynamicStyle({ transform: `scale(1.05) rotateY(${x}deg) rotateX(${y}deg)` });
  };

  // Reset tilt on mouse leave
  const handleMouseLeave = () => {
    setDynamicStyle({ transform: 'scale(1) rotateY(0deg) rotateX(0deg)' });
  };

  // Calculate angle for circular layout (if used in a carousel)
  const angle = (360 / totalCards) * cardIndex;
  const radius = '450px'; // Example radius

  return (
    <div
      ref={cardRef}
      className="beat-card"
      data-active={isActive}
      style={{
        '--card-angle': `${angle}deg`,
        '--radius': radius,
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <div
        className="card-inner-wrapper"
        style={{
          transform: isActive ? dynamicStyle.transform : undefined,
          transition: isActive ? 'transform 0.1s ease-out' : undefined, // Smooth transition
        }}
      >
        <div className="artwork-container">
          <img src={beat.artwork} alt={beat.title} className="beat-artwork" />
          <div className="artwork-overlay">
            <button className="play-button" onClick={handlePlayClick}>
              {/* Show play or pause icon based on status */}
              <span className="play-icon">{isThisBeatPlaying ? '❚❚' : '▶'}</span>
            </button>
          </div>
        </div>
        <div className="beat-info">
          <h3 className="beat-title">{beat.title}</h3>
          <div className="beat-purchase-info">
            <span className="beat-price">${beat.price}</span>
            <button className="add-to-cart-button" onClick={handleAddToCart}>
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BeatCard;