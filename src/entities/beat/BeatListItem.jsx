import React from 'react';
import { useCart } from '../../context/CartContext'; // Ensure this path is correct
import './BeatListItem.css'; // Your CSS for BeatListItem

const BeatListItem = ({ beat, isPlaying, isSelected, onPlay, onPause, onSelect }) => {
  const { addToCart, cartItems } = useCart();
  const isInCart = cartItems.some(item => item.id === beat.id);

  const handleAddToCart = (e) => {
    e.stopPropagation(); // Prevent the parent div's onClick (onSelect) from firing
    addToCart(beat);
  };

  // Simple waveform component for visual feedback when playing
  const Waveform = () => (
    <div className="waveform">
      <div className="waveform-bar"></div>
      <div className="waveform-bar"></div>
      <div className="waveform-bar"></div>
      <div className="waveform-bar"></div>
      <div className="waveform-bar"></div>
    </div>
  );

  const beatName = beat.title || beat.name; // Use title, fallback to name
  // Apply CSS classes based on playback and selection state
  const itemClasses = `beat-list-item ${isPlaying ? 'playing' : ''} ${isSelected ? 'selected' : ''}`;

  return (
    // Clicking the entire item selects it
    <div className={itemClasses} onClick={onSelect}>
      <div
        className="item-play-status"
        onClick={(e) => {
          e.stopPropagation(); // Prevent onSelect from firing when clicking play/pause
          if (isPlaying) {
            onPause(); // If currently playing, call pause
          } else {
            onPlay(); // If not playing, call play
          }
        }}
      >
        {isPlaying ? <Waveform /> : <span className="play-icon">▶</span>}
      </div>
      <div className="item-title-container">
        <img src={beat.artwork} alt={beatName} className="item-image" />
        <span className="item-title">{beatName}</span>
      </div>
      <span className="item-bpm">{beat.bpm}</span>
      <span className="item-key">{beat.key || "N/A"}</span>
      <span className="item-price">${beat.price.toFixed(2)}</span>
      <div className="item-cart-action">
        <button
          className="add-to-cart-btn"
          onClick={handleAddToCart}
          disabled={isInCart} // Disable button if item is already in cart
        >
          {isInCart ? '✓' : <img src="/images/shopcart.png" alt="Add to cart" className="add-to-cart-icon" />}
        </button>
      </div>
    </div>
  );
};

export default BeatListItem;