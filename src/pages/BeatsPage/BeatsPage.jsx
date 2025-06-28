import React, { useState, useEffect } from 'react';
import { useMusic } from '../../context/MusicContext';
import { useCart } from '../../context/CartContext';
import { beats } from '../../entities/beat/beats';
import BeatListItem from '../../entities/beat/BeatListItem';
import './BeatsPage.css';

const ArtworkDisplay = () => {
  const { currentBeat, isPlaying } = useMusic();

  if (!currentBeat) {
    return (
      <div className="artwork-display-container">
        <div className="artwork-wrapper" />
        <div className="artwork-title">Select a Beat</div>
        <p className="artwork-artist">Click a track on the left to play.</p>
      </div>
    );
  }

  return (
    <div className="artwork-display-container">
      <div className="artwork-wrapper">
        <img
          src={currentBeat.artwork}
          alt={currentBeat.title}
          className={`artwork-image ${isPlaying ? 'playing' : ''}`}
        />
      </div>
      <h2 className="artwork-title">{currentBeat.title}</h2>
      <p className="artwork-artist">{currentBeat.artist}</p>
    </div>
  );
};

function BeatsPage() {
  const [beatData, setBeatData] = useState([]);
  const { playBeat } = useMusic();
  const { addToCart } = useCart();

  useEffect(() => {
    const formattedBeats = beats.map(beat => ({
      ...beat,
      audio: beat.audioSrc
    }));
    setBeatData(formattedBeats);
  }, []);

  return (
    <div className="beats-page-layout">
      <div className="beat-list-container">
        <header className="beat-list-header">
          <span></span>
          <span>Track</span>
          <span>Genre</span>
          <span>BPM</span>
          <span>Price</span>
          <span></span>
        </header>
        <div className="beat-list-items">
          {beatData.map(beat => (
            <BeatListItem
              key={beat.id}
              beat={beat}
              onPlay={() => playBeat(beat)}
              onAddToCart={() => addToCart(beat)}
            />
          ))}
        </div>
      </div>
      <ArtworkDisplay />
    </div>
  );
}

export default BeatsPage;