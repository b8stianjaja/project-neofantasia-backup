import React, { useState, useEffect } from 'react';
import { useMusic } from '../../context/MusicContext';
import { useCart } from '../../context/CartContext';
import { beats } from '../../entities/beat/beats';
import BeatListItem from '../../entities/beat/BeatListItem';
import './BeatsPage.css';

// Scene component remains the same
const Scene = ({ isLoaded, showArtwork }) => {
  const { currentBeat } = useMusic();

  return (
    <div className="scene-container">
      <div className={`sprite-layer ${isLoaded ? 'loaded' : ''}`}></div>
      {showArtwork && currentBeat && (
        <div className={`artwork-holder ${isLoaded ? 'loaded' : ''}`}>
          <img
            src={currentBeat.artwork}
            alt={currentBeat.title}
            className="artwork-image"
          />
        </div>
      )}
    </div>
  );
};


// DialogueBox component is now a simple wrapper for the new structure
const DialogueBox = ({ beats, onBeatSelect, onAddToCart, isLoaded }) => {
  return (
    // 1. This new wrapper now controls the overall position and animation
    <div className={`dialogue-wrapper ${isLoaded ? 'loaded' : ''}`}>
      {/* 2. The header is now a sibling, making positioning simple */}
      <div className="dialogue-header">✧✧✧✧✧✧✧✧✧✧</div>

      {/* 3. The container just holds the list */}
      <div className="dialogue-container">
        <div className="dialogue-content-wrapper">
          <img
            src="/images/ornament.png"
            alt="dialogue ornament"
            className="dialogue-ornament"
          />
          <div className="dialogue-list">
            {beats.map(beat => (
              <BeatListItem
                key={beat.id}
                beat={beat}
                onPlay={() => onBeatSelect(beat)}
                onAddToCart={() => onAddToCart(beat)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

function BeatsPage() {
  const [beatData, setBeatData] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const { playBeat } = useMusic();
  const { addToCart } = useCart();
  const [showArtwork, setShowArtwork] = useState(false);

  useEffect(() => {
    const formattedBeats = beats.map(beat => ({
      ...beat,
      audio: beat.audioSrc,
    }));
    setBeatData(formattedBeats);
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 200);
    return () => clearTimeout(timer);
  }, []);

  const handleBeatSelect = (beat) => {
    playBeat(beat);
  };

  return (
    <div className="beats-page-layout">
      <Scene isLoaded={isLoaded} showArtwork={showArtwork} />
      <DialogueBox
        beats={beatData}
        onBeatSelect={handleBeatSelect}
        onAddToCart={addToCart}
        isLoaded={isLoaded}
      />
    </div>
  );
}

export default BeatsPage;