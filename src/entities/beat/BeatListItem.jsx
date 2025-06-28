import React from 'react';
import { useMusic } from '../../context/MusicContext';
import { useCart } from '../../context/CartContext';
import './BeatListItem.css';

const BeatListItem = React.memo(({ beat }) => {
  const { playBeat, pauseBeat, activeTrack, isPlaying } = useMusic();
  const { addToCart, cartItems } = useCart();

  const isThisBeatPlaying = activeTrack?.id === beat.id && isPlaying;
  const isThisBeatSelected = activeTrack?.id === beat.id;
  const isInCart = cartItems.some(item => item.id === beat.id);

  const handlePlayPauseClick = (e) => {
    e.stopPropagation();
    if (isThisBeatPlaying) {
      pauseBeat();
    } else {
      playBeat(beat);
    }
  };

  const handleRowClick = () => {
    if (!isThisBeatPlaying) {
      playBeat(beat);
    }
  };

  const handleAddToCart = (e) => {
    e.stopPropagation();
    addToCart(beat);
  };

  const itemClasses = `beat-list-item ${isThisBeatSelected ? 'selected' : ''}`;

  return (
    <div className={itemClasses} onClick={handleRowClick}>
      <div className="item-play-status">
        <button onClick={handlePlayPauseClick} className="play-pause-btn" aria-label={isThisBeatPlaying ? 'Pause' : 'Play'}>
          {isThisBeatPlaying ? '❚❚' : '▶'}
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
          onClick={handleAddToCart}
          disabled={isInCart}
          aria-label={isInCart ? 'In Cart' : 'Add to Cart'}
        >
          {isInCart ? '✓ IN CART' : 'ADD +'}
        </button>
      </div>
    </div>
  );
});

export default BeatListItem;