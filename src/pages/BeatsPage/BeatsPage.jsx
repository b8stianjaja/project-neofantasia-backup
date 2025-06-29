import React, { useState, useEffect } from 'react';
import { useMusic } from '../../context/MusicContext';
import { useCart } from '../../context/CartContext';
import { beats } from '../../entities/beat/beats';
import BeatListItem from '../../entities/beat/BeatListItem';
import './BeatsPage.css';

// This component holds the character sprite and the currently selected artwork.
const Scene = ({ isLoaded }) => {
  const { currentBeat } = useMusic();

  return (
    <div className="scene-container">
      {/* The sprite now has its own animation class triggered by isLoaded */}
      <div className={`sprite-layer ${isLoaded ? 'loaded' : ''}`}></div>

      {currentBeat && (
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

// This component now contains the list of selectable tracks.
const DialogueBox = ({ beats, onBeatSelect, onAddToCart, isLoaded }) => {
  return (
    // The main container for the entire dialogue box, including its animation
    <div className={`dialogue-container ${isLoaded ? 'loaded' : ''}`}>
      {/* The header and list are now simple children */}
      <div className="dialogue-header">✧✧✧✧✧✧</div>
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
  );
};

function BeatsPage() {
  const [beatData, setBeatData] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false); // State to control animations
  const { playBeat } = useMusic();
  const { addToCart } = useCart();

  useEffect(() => {
    // Set formatted beat data
    const formattedBeats = beats.map(beat => ({
      ...beat,
      audio: beat.audioSrc,
    }));
    setBeatData(formattedBeats);

    // Trigger the landing animation shortly after the component mounts
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 200);

    return () => clearTimeout(timer); // Cleanup timer on unmount
  }, []);

  return (
    <div className="beats-page-layout">
      <Scene isLoaded={isLoaded} />
      <DialogueBox
        beats={beatData}
        onBeatSelect={playBeat}
        onAddToCart={addToCart}
        isLoaded={isLoaded}
      />
    </div>
  );
}

export default BeatsPage;