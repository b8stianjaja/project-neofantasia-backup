import React from 'react';
import { useMusic } from '../../context/MusicContext';
import './AudioPlayer.css';

const formatTime = (seconds) => {
    const floorSeconds = Math.floor(seconds);
    const min = Math.floor(floorSeconds / 60);
    const sec = floorSeconds % 60;
    return `${min}:${sec < 10 ? '0' : ''}${sec}`;
};

const AudioPlayer = () => {
    const { isPlaying, activeTrack, playbackInfo, pauseBeat, playBeat, seekTo } = useMusic();

    const handleProgressClick = (e) => {
        if (!activeTrack || !playbackInfo.duration) return;
        const progressBar = e.currentTarget;
        const clickPosition = e.clientX - progressBar.getBoundingClientRect().left;
        const percentage = clickPosition / progressBar.offsetWidth;
        seekTo(percentage);
    };

    if (!activeTrack) {
        return (
            <div className="audio-player-container placeholder">
                <div className="track-info">
                    <span className="title">Select a beat to play</span>
                </div>
                <div className="controls">
                    <button className="control-button" disabled>❚❚</button>
                </div>
            </div>
        );
    }

    const progressPercentage = (playbackInfo.seek / playbackInfo.duration) * 100 || 0;

    return (
        <div className="audio-player-container">
            <img src={activeTrack.coverArt || activeTrack.artwork} alt={`${activeTrack.title} cover`} className="album-art" />
            <div className="track-info">
                <span className="title">{activeTrack.title}</span>
                <span className="artist">{activeTrack.artist}</span>
            </div>

            <div className="controls">
                <button
                    onClick={() => isPlaying ? pauseBeat() : playBeat(activeTrack)}
                    className="control-button"
                    aria-label={isPlaying ? 'Pause' : 'Play'}
                >
                    {isPlaying ? '❚❚' : '▶'}
                </button>
            </div>

            <div className="progress-bar-container" onClick={handleProgressClick}>
                <div
                    className="progress-bar-filled"
                    style={{ width: `${progressPercentage}%` }}
                />
            </div>

            <div className="time-display">
                <span>{formatTime(playbackInfo.seek)}</span> / <span>{formatTime(playbackInfo.duration)}</span>
            </div>
        </div>
    );
};

export default AudioPlayer;