import React, { useRef } from 'react';
import { NavLink } from 'react-router-dom';
import beats from '../../entities/beat/beats';
import BeatListItem from '../../entities/beat/BeatListItem';
import { useMusic } from '../../context/MusicContext';
import './BeatsPage.css'; // Your CSS for this page

const formatTime = (secs) => {
  const minutes = Math.floor(secs / 60) || 0;
  const seconds = Math.floor(secs % 60) || 0;
  return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
};

function BeatsPage() {
  const {
    playBeat,
    pauseBeat,
    selectTrack,
    activeTrack,
    isPlaying,
    playbackInfo,
    seekTo
  } = useMusic();

  const timelineRef = useRef(null);

  const handlePlay = (beat) => playBeat(beat);
  const handlePause = () => pauseBeat();
  const handleSelectBeat = (beat) => {
    selectTrack(beat);
  };

  const handleSeek = (event) => {
    if (!timelineRef.current || !activeTrack) return;
    const rect = timelineRef.current.getBoundingClientRect();
    const clickX = event.clientX - rect.left;
    const percentage = Math.max(0, Math.min(1, clickX / rect.width));
    seekTo(percentage);
  };

  const displayBeat = activeTrack;
  const isPlayingActiveTrack = isPlaying && activeTrack !== null;

  const progressPercent = activeTrack && playbackInfo.duration > 0 ? (playbackInfo.seek / playbackInfo.duration) * 100 : 0;
  const beatDuration = activeTrack?.duration || playbackInfo.duration || 0;
  const currentTime = formatTime(playbackInfo.seek);
  const totalTime = formatTime(beatDuration);

  return (
    <main className="beats-page-layout">
      <div className="beat-list-container">
        <div className="beat-list-header">
          <span>Track</span>
          <span>BPM</span>
          <span>Key</span>
          <span>Price</span>
        </div>
        <div className="beat-list-items">
          {beats.map((beat) => {
            const isThisBeatPlaying = isPlaying && activeTrack?.id === beat.id;
            const isThisBeatSelected = activeTrack?.id === beat.id;

            return (
              <BeatListItem
                key={beat.id}
                beat={beat}
                isPlaying={isThisBeatPlaying}
                isSelected={isThisBeatSelected}
                onPlay={() => handlePlay(beat)}
                onPause={() => handlePause()}
                onSelect={() => handleSelectBeat(beat)}
              />
            );
          })}
        </div>
      </div>
      <div className="artwork-display-container">
        {displayBeat && (
          <>
            {/* Added a wrapper div for the animation */}
            <div className="artwork-wrapper">
              <img
                src={displayBeat.artwork}
                alt={displayBeat.title}
                className={`artwork-image ${isPlayingActiveTrack ? 'playing' : ''}`}
              />
            </div>
            <h2 className="artwork-title">{displayBeat.title}</h2>
            <div ref={timelineRef} className="timeline-container" onClick={handleSeek}>
              <div className="timeline-progress" style={{ width: `${progressPercent}%` }}>
                <div className="timeline-handle"></div>
              </div>
            </div>
            <div className="timer-display">
              <span>{currentTime}</span>
              <span>{totalTime}</span>
            </div>
          </>
        )}
      </div>
      <NavLink to="/" className="back-to-menu-link"> &larr; Back </NavLink>
    </main>
  );
}

export default BeatsPage;