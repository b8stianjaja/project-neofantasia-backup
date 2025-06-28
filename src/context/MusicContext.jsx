import React, { createContext, useState, useContext, useRef, useCallback, useEffect } from 'react';
import { Howl, Howler } from 'howler';
// beats is imported in BeatsPage, not needed here directly for general context operations

// 1. Export the context directly. This was the source of the error.
export const MusicContext = createContext();

export const useMusic = () => useContext(MusicContext);

export const MusicProvider = ({ children }) => {
  const [activeTrack, setActiveTrack] = useState(null);
  const [isBeatPlaying, setIsBeatPlaying] = useState(false);
  const [playbackInfo, setPlaybackInfo] = useState({ seek: 0, duration: 0 });

  const beatSoundRef = useRef(null);
  const themeSoundRef = useRef(null);
  const progressIntervalRef = useRef(null);

  const stopProgressTracking = useCallback(() => {
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
      progressIntervalRef.current = null;
    }
  }, []);

  const startProgressTracking = useCallback(() => {
    stopProgressTracking();
    progressIntervalRef.current = setInterval(() => {
      const sound = beatSoundRef.current;
      if (sound?.playing()) {
        setPlaybackInfo({ seek: sound.seek(), duration: sound.duration() });
      }
    }, 100);
  }, [stopProgressTracking]);

  const resumeAudioContext = useCallback(async () => {
    if (Howler.ctx && Howler.ctx.state !== 'running') {
      try {
        await Howler.ctx.resume();
        console.log('MusicContext: AudioContext resumed successfully.');
      } catch (e) {
        console.error('MusicContext: Failed to resume AudioContext:', e);
      }
    }
  }, []);

  const selectTrack = useCallback((track) => {
    if (activeTrack && activeTrack.id === track.id) {
        console.log('MusicContext: Track already selected:', track.title);
        return;
    }
    setActiveTrack(track);
    if (beatSoundRef.current) {
        beatSoundRef.current.stop();
        setIsBeatPlaying(false);
        stopProgressTracking();
        setPlaybackInfo({ seek: 0, duration: 0 });
        console.log('MusicContext: Switched selected track, stopped previous playback.');
    } else {
        console.log('MusicContext: Selected track, no previous playback.');
    }
  }, [activeTrack, stopProgressTracking]);

  const playBeat = useCallback(async (trackToPlay) => {
    if (!trackToPlay || !trackToPlay.audioSrc) {
        console.error('MusicContext: playBeat called with invalid track or missing audioSrc.', trackToPlay);
        return;
    }

    await resumeAudioContext();

    const isPlayingSameTrack = activeTrack?.id === trackToPlay.id;

    if (isBeatPlaying && isPlayingSameTrack) {
        console.log('MusicContext: Already playing this track.');
        return;
    }

    // Unload previous track if different
    if (beatSoundRef.current && beatSoundRef.current.src !== trackToPlay.audioSrc) {
        beatSoundRef.current.unload();
        beatSoundRef.current = null;
        console.log('MusicContext: Unloaded previous beat sound.');
    }

    // Pause theme music when a beat starts playing
    themeSoundRef.current?.pause();
    console.log('MusicContext: Theme music paused.');

    // If sound object already exists and is for the same track, just play/resume
    if (beatSoundRef.current && beatSoundRef.current.state() === 'loaded' && !beatSoundRef.current.playing()) {
        beatSoundRef.current.play();
        setIsBeatPlaying(true);
        console.log('MusicContext: Resumed playing existing beat sound.');
        return;
    }

    // If sound object doesn't exist or is for a different track, create new
    setIsBeatPlaying(true);
    console.log('MusicContext: Creating new Howl sound for:', trackToPlay.audioSrc);

    const newSound = new Howl({
      src: [trackToPlay.audioSrc],
      html5: true, // Use HTML5 audio for better mobile support and direct seeking
      onplay: () => {
        setIsBeatPlaying(true);
        startProgressTracking();
        setPlaybackInfo({ seek: newSound.seek(), duration: newSound.duration() });
        console.log('MusicContext: Beat started playing.');
      },
      onpause: () => {
        setIsBeatPlaying(false);
        stopProgressTracking();
        console.log('MusicContext: Beat paused.');
      },
      onend: () => {
        setIsBeatPlaying(false);
        stopProgressTracking();
        setPlaybackInfo({ seek: 0, duration: newSound.duration() });
        console.log('MusicContext: Beat ended.');
      },
      onloaderror: (id, err) => {
        console.error(`MusicContext: Howler Load Error for beat ${trackToPlay.title} (ID: ${id}):`, err);
        setIsBeatPlaying(false);
        // Attempt to resume audio context, in case it was suspended due to error
        resumeAudioContext();
      },
      onplayerror: (id, err) => {
        console.error(`MusicContext: Howler Play Error for beat ${trackToPlay.title} (ID: ${id}):`, err);
        setIsBeatPlaying(false);
        // Crucial: try to resume context if play failed (e.g., due to autoplay policy)
        resumeAudioContext();
      },
      onload: () => {
        if (newSound.duration() > 0) {
            setPlaybackInfo(prev => ({ ...prev, duration: newSound.duration() }));
            console.log(`MusicContext: Beat ${trackToPlay.title} loaded. Duration: ${newSound.duration()}`);
        }
      }
    });

    beatSoundRef.current = newSound;
    // Set active track only after a new sound is created and about to play
    setActiveTrack(trackToPlay);
    newSound.play();

  }, [activeTrack, isBeatPlaying, startProgressTracking, stopProgressTracking, resumeAudioContext]);

  const pauseBeat = useCallback(async () => {
    await resumeAudioContext(); // Ensure context is active to pause
    if (beatSoundRef.current?.playing()) {
      setIsBeatPlaying(false);
      beatSoundRef.current.pause();
      console.log('MusicContext: Explicitly paused beat.');
    } else {
        setIsBeatPlaying(false);
        console.log('MusicContext: pauseBeat called, but no beat was playing.');
    }
  }, [resumeAudioContext]);

  const seekTo = useCallback((percentage) => {
    const sound = beatSoundRef.current;
    if (sound && sound.duration()) {
        const newSeek = sound.duration() * percentage;
        sound.seek(newSeek);
        setPlaybackInfo(prev => ({ ...prev, seek: newSeek }));
        console.log(`MusicContext: Seeked to ${percentage * 100}% (${newSeek}s).`);
    } else {
        console.warn('MusicContext: Cannot seek, no active sound or duration unknown.');
    }
  }, []);

  const unlock = useCallback(async () => {
    console.log('MusicContext: Unlock function called.');
    await resumeAudioContext();
    if (themeSoundRef.current?.state() === 'unloaded') {
      themeSoundRef.current.load();
      console.log('MusicContext: Theme music loading.');
    }
    // Only play if AudioContext is running and theme music is not already playing
    if (Howler.ctx.state === 'running' && !themeSoundRef.current?.playing()) {
        themeSoundRef.current?.play();
        console.log('MusicContext: Theme music started playing.');
    }
  }, [resumeAudioContext]);

  useEffect(() => {
    // Initialize theme music Howl instance only once
    if (!themeSoundRef.current) {
        themeSoundRef.current = new Howl({
          src: ['/sfx/title-theme.wav'], // Make sure this path is correct
          loop: true,
          volume: 0.2,
          html5: true,
          preload: true,
          onplayerror: (id, err) => {
            console.error(`MusicContext: Theme music Play Error (ID: ${id}):`, err);
            resumeAudioContext(); // Attempt to resume context on play error
          },
          onloaderror: (id, err) => {
            console.error(`MusicContext: Theme music Load Error (ID: ${id}):`, err);
          },
          onload: () => {
              console.log('MusicContext: Theme music loaded successfully.');
          }
        });
        console.log('MusicContext: Theme music Howl instance created.');
    }

    return () => {
      // Cleanup: unload sounds and clear interval when component unmounts
      console.log('MusicContext: Cleaning up sounds on unmount.');
      themeSoundRef.current?.unload();
      beatSoundRef.current?.unload();
      stopProgressTracking();
    };
  }, [stopProgressTracking, resumeAudioContext]); // Dependencies for MusicProvider effect

  const value = {
    unlock,
    selectTrack,
    playBeat,
    pauseBeat,
    seekTo,
    activeTrack,
    isPlaying: isBeatPlaying,
    playbackInfo,
  };

  return (
    <MusicContext.Provider value={value}>{children}</MusicContext.Provider>
  );
};