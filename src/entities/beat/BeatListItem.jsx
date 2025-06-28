import React from 'react';
import { useMusic } from '../../context/MusicContext';
import { useCart } from '../../context/CartContext';
import './BeatListItem.css';

const BeatListItem = ({ beat, onPlay, onAddToCart }) => {
  const { currentBeat, isPlaying, togglePlay } = useMusic();
  const { cartItems } = useCart();

  const isThisBeatActive = currentBeat?.id === beat.id;
  const isInCart = cartItems.some(item => item.id === beat.id);

  const handlePlayClick = (e) => {
    // Stop the event from bubbling up to the main div's onClick
    if (e) e.stopPropagation();

    if (isThisBeatActive) {
      togglePlay();
    } else {
      onPlay();
    }
  };

  const handleAddToCartClick = (e) => {
    e.stopPropagation();
    onAddToCart();
  };

  const itemClasses = `beat-list-item ${isThisBeatActive ? 'selected' : ''}`;

  return (
    // Clicking the entire row should behave the same as clicking the play button
    <div className={itemClasses} onClick={() => handlePlayClick()}>
      <div className="item-play-status">
        <button onClick={handlePlayClick} className="play-pause-btn">
          {isThisBeatActive && isPlaying ? '❚❚' : '▶'}
        </button>
      </div>
      <div className="item-track-info">
        <img src={beat.artwork} alt={beat.title} className="item-artwork" />
        <div className="title-artist">
          <span className="item-title">{beat.title}</span>
          <span className="item-artist">{beat.artist}</span>
        </div>
      </div>
      <div className="item-genre">{beat.genre}</div>
      <div className="item-bpm">{beat.bpm} BPM</div>
      <div className="item-price-action">
        <span className="item-price">${beat.price.toFixed(2)}</span>
        <button
          className="add-to-cart-btn"
          onClick={handleAddToCartClick}
          disabled={isInCart}
        >
          {isInCart ? 'IN CART' : 'ADD +'}
        </button>
      </div>
    </div>
  );
};

export default BeatListItem;