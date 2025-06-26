import React, { createContext, useState, useContext, useRef, useCallback, useEffect } from 'react';
import { Howl, Howler } from 'howler';
import beats from '../entities/beat/beats';

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
      } catch (e) {
        console.error('Failed to resume AudioContext:', e);
      }
    }
  }, []);

  const selectTrack = useCallback((track) => {
    if (activeTrack && activeTrack.id === track.id) {
        return;
    }
    setActiveTrack(track);
    if (beatSoundRef.current) {
        beatSoundRef.current.stop();
        setIsBeatPlaying(false);
        stopProgressTracking();
        setPlaybackInfo({ seek: 0, duration: 0 });
    }
  }, [activeTrack, stopProgressTracking]);

  const playBeat = useCallback(async (trackToPlay) => {
    await resumeAudioContext();

    const isPlayingSameTrack = activeTrack?.id === trackToPlay.id;

    if (isBeatPlaying && isPlayingSameTrack) {
        return;
    }

    if (!isPlayingSameTrack) {
        setActiveTrack(trackToPlay);
        if (beatSoundRef.current) {
            beatSoundRef.current.unload();
            beatSoundRef.current = null;
        }
    }

    themeSoundRef.current?.pause();

    if (beatSoundRef.current && beatSoundRef.current.src === trackToPlay.audioSrc) {
        if (!beatSoundRef.current.playing()) {
            beatSoundRef.current.play();
            setIsBeatPlaying(true);
        }
        return;
    }

    setIsBeatPlaying(true);

    const newSound = new Howl({
      src: [trackToPlay.audioSrc],
      html5: true,
      onplay: () => {
        setIsBeatPlaying(true);
        startProgressTracking();
        setPlaybackInfo({ seek: newSound.seek(), duration: newSound.duration() });
      },
      onpause: () => {
        setIsBeatPlaying(false);
        stopProgressTracking();
      },
      onend: () => {
        setIsBeatPlaying(false);
        stopProgressTracking();
        setPlaybackInfo({ seek: 0, duration: newSound.duration() });
      },
      onloaderror: (id, err) => {
        console.error('Howler Load Error:', err);
        setIsBeatPlaying(false);
      },
      onplayerror: (id, err) => {
        console.error('Howler Play Error:', err);
        setIsBeatPlaying(false);
        resumeAudioContext();
      },
      onload: () => {
        if (newSound.duration() > 0) {
            setPlaybackInfo(prev => ({ ...prev, duration: newSound.duration() }));
        }
      }
    });

    beatSoundRef.current = newSound;
    beatSoundRef.current.src = trackToPlay.audioSrc;
    newSound.play();

  }, [activeTrack, isBeatPlaying, startProgressTracking, stopProgressTracking, resumeAudioContext]);

  const pauseBeat = useCallback(async () => {
    await resumeAudioContext();
    if (beatSoundRef.current?.playing()) {
      setIsBeatPlaying(false);
      beatSoundRef.current.pause();
    } else {
        setIsBeatPlaying(false);
    }
  }, [resumeAudioContext]);

  const seekTo = useCallback((percentage) => {
    const sound = beatSoundRef.current;
    if (sound && sound.duration()) {
        const newSeek = sound.duration() * percentage;
        sound.seek(newSeek);
        setPlaybackInfo(prev => ({ ...prev, seek: newSeek }));
    }
  }, []);

  const unlock = useCallback(async () => {
    await resumeAudioContext();
    if (themeSoundRef.current?.state() === 'unloaded') {
      themeSoundRef.current.load();
    }
    if (Howler.ctx.state === 'running' && !themeSoundRef.current?.playing()) {
        themeSoundRef.current?.play();
    }
  }, [resumeAudioContext]);

  useEffect(() => {
    themeSoundRef.current = new Howl({
      src: ['/sfx/title-theme.wav'],
      loop: true,
      volume: 0.2,
      html5: true,
      preload: true,
      onplayerror: (id, err) => {
        resumeAudioContext();
      },
      onloaderror: (id, err) => {
        console.error('Theme music load error:', err);
      }
    });

    return () => {
      themeSoundRef.current?.unload();
      beatSoundRef.current?.unload();
      stopProgressTracking();
    };
  }, [stopProgressTracking, resumeAudioContext]);

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
