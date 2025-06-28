import React, { useState, useEffect, useMemo } from 'react';
import BeatListItem from '../../entities/beat/BeatListItem';
import { useMusic } from '../../context/MusicContext';
import mockBeats from '../../entities/beat/beats.js';
import './BeatsPage.css';

const ArtworkDisplay = () => {
  const { activeTrack, isPlaying } = useMusic();

  if (!activeTrack) {
    return (
      <div className="artwork-display-container">
        <div className="artwork-wrapper" />
        <div className="artwork-title">Select a Beat</div>
      </div>
    );
  }

  return (
    <div className="artwork-display-container">
      <div className="artwork-wrapper">
        <img
          src={activeTrack.artwork}
          alt={activeTrack.title}
          className={`artwork-image ${isPlaying ? 'playing' : ''}`}
        />
      </div>
      <h2 className="artwork-title">{activeTrack.title}</h2>
      <p className="artwork-artist">{activeTrack.artist}</p>
    </div>
  );
};

const BeatsPage = () => {
    const [beats, setBeats] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        try {
            setTimeout(() => {
                if (Array.isArray(mockBeats)) {
                    setBeats(mockBeats);
                } else {
                    setBeats(mockBeats.default || []);
                }
                setIsLoading(false);
            }, 500);
        } catch (err) {
            console.error("Error loading beats:", err);
            setError('Failed to load beats. Please try again later.');
            setIsLoading(false);
        }
    }, []);

    const memoizedBeatList = useMemo(() => {
        if (!Array.isArray(beats)) return null;
        return beats.map(beat => <BeatListItem key={beat.id} beat={beat} />);
    }, [beats]);

    const renderContent = () => {
        if (isLoading) return <p className="loading-message">Loading beats...</p>;
        if (error) return <p className="error-message">{error}</p>;
        return <div className="beat-list-items">{memoizedBeatList}</div>;
    };

    return (
        <div className="beats-page-layout">
            <div className="beat-list-container">
                <div className="beat-list-header">
                    <span>{/* Play button column */}</span>
                    <span>Track</span>
                    <span>Genre</span>
                    <span>BPM</span>
                    <span>Price</span>
                </div>
                {renderContent()}
            </div>
            <ArtworkDisplay />
        </div>
    );
};

export default BeatsPage;