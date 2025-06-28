import React, { createContext, useContext, useState, useEffect } from 'react';
import { Howl, Howler } from 'howler';

const MusicContext = createContext();

export const useMusic = () => useContext(MusicContext);

export const MusicProvider = ({ children }) => {
  const [isUnlocked, setIsUnlocked] = useState(Howler.ctx && Howler.ctx.state === 'running');
  const [currentBeat, setCurrentBeat] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [sound, setSound] = useState(null);

  const unlockAudio = () => {
    if (Howler.ctx && Howler.ctx.state !== 'running') {
      Howler.ctx.resume().then(() => setIsUnlocked(true));
    } else {
      setIsUnlocked(true);
    }
  };

  const playBeat = (beat) => {
    if (currentBeat?.id === beat.id) {
      // If the same beat is clicked, just toggle play/pause
      togglePlay();
      return;
    }

    if (sound) sound.unload(); // Unload any existing sound

    setCurrentBeat(beat);
    const newSound = new Howl({
      src: [beat.audio],
      html5: true,
      onplay: () => setIsPlaying(true),
      onpause: () => setIsPlaying(false),
      onstop: () => setIsPlaying(false),
      onend: () => {
        setIsPlaying(false);
        setCurrentBeat(null);
      },
      onloaderror: (id, err) => {
        console.error('Howler load error:', beat.audio, err);
      },
      onplayerror: (id, err) => {
        console.error('Howler play error:', beat.audio, err);
      }
    });
    setSound(newSound);
    newSound.play();
  };

  const togglePlay = () => {
    if (!sound) return;
    if (isPlaying) {
      sound.pause();
    } else {
      sound.play();
    }
  };

  useEffect(() => {
    return () => {
      if (sound) sound.unload();
    };
  }, [sound]);

  const value = { isUnlocked, unlockAudio, currentBeat, isPlaying, playBeat, togglePlay };

  return <MusicContext.Provider value={value}>{children}</MusicContext.Provider>;
};