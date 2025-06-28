import React, { createContext, useState, useContext, useRef, useCallback, useEffect } from 'react';
import { Howl, Howler } from 'howler';

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
    clearInterval(progressIntervalRef.current);
    progressIntervalRef.current = null;
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
        console.error('MusicContext: Failed to resume AudioContext:', e);
      }
    }
  }, []);

  const selectTrack = useCallback((track) => {
    if (activeTrack?.id === track.id) return;
    setActiveTrack(track);
    if (beatSoundRef.current) {
        beatSoundRef.current.stop();
        setIsBeatPlaying(false);
        stopProgressTracking();
        setPlaybackInfo({ seek: 0, duration: 0 });
    }
  }, [activeTrack, stopProgressTracking]);

  const playBeat = useCallback(async (trackToPlay) => {
    if (!trackToPlay?.audioSrc) return;
    await resumeAudioContext();

    if (beatSoundRef.current) {
      beatSoundRef.current.unload();
    }

    themeSoundRef.current?.pause();

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
      onload: () => {
        if (newSound.duration() > 0) {
            setPlaybackInfo(prev => ({ ...prev, duration: newSound.duration() }));
        }
      }
    });

    beatSoundRef.current = newSound;
    setActiveTrack(trackToPlay);
    newSound.play();

  }, [startProgressTracking, stopProgressTracking, resumeAudioContext]);

  const pauseBeat = useCallback(async () => {
    await resumeAudioContext();
    if (beatSoundRef.current?.playing()) {
      beatSoundRef.current.pause();
    }
  }, [resumeAudioContext]);

  const seekTo = useCallback((percentage) => {
    const sound = beatSoundRef.current;
    if (sound?.duration()) {
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
    if (!themeSoundRef.current) {
      themeSoundRef.current = new Howl({
        src: ['/sfx/title-theme.wav'],
        loop: true,
        volume: 0.2,
        html5: true,
        preload: true,
      });
    }

    return () => {
      beatSoundRef.current?.unload();
      themeSoundRef.current?.unload();
      stopProgressTracking();
      themeSoundRef.current = null;
    };
  }, [stopProgressTracking]);

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