// src/pages/InteractionScreen/InteractionScreen.jsx
import React, { useState, useEffect, useRef } from 'react'; // Import useRef
import { useMusic } from '../../context/MusicContext';
import './InteractionScreen.css';

const animationImages = [
  '/menu/pab2.png', // Frame 0
  '/menu/pab3.png', // Frame 1
  '/menu/pab4.png', // Frame 2
];

const sequence = [0, 1, 2, -1];

const InteractionScreen = ({ onInteract }) => {
  const { unlock } = useMusic(); // Get unlock from context
  const [sequenceIndex, setSequenceIndex] = useState(0);

  // Use a ref to hold the timeout ID so we can clear it properly
  const timeoutRef = useRef(null);

  useEffect(() => {
    // This function will run our animation step-by-step
    const runAnimationStep = () => {
      const currentFrameValue = sequence[sequenceIndex];

      // --- RHYTHMIC TIMING LOGIC ---
      // Use a fast delay between visible images, but a longer delay on the "nothing" frame.
      const delay = currentFrameValue === -1 ? 450 : 150;

      // Set a timeout for the next animation frame
      timeoutRef.current = setTimeout(() => {
        setSequenceIndex(prevIndex => (prevIndex + 1) % sequence.length);
      }, delay);
    };

    runAnimationStep();

    // Cleanup function: this is crucial to prevent memory leaks
    return () => clearTimeout(timeoutRef.current);

  }, [sequenceIndex]); // Re-run this effect every time the sequenceIndex changes

  useEffect(() => {
    // This handles the user interaction for sound unlocking and proceeding
    const handleInteraction = () => {
      unlock(); // Call the MusicContext unlock
      onInteract(); // Call the prop passed from App.jsx to hide this screen
    };

    // Listen for common interaction events
    const events = ['mousedown', 'keydown', 'scroll'];
    events.forEach(event => document.addEventListener(event, handleInteraction, { once: true })); // `once: true` ensures it only fires once

    // Cleanup listeners
    return () => {
      events.forEach(event => document.removeEventListener(event, handleInteraction));
    };
  }, [onInteract, unlock]); // Dependencies for useEffect

  const currentFrame = sequence[sequenceIndex];

  return (
    <div className="interaction-screen">
      <div className="interaction-content">
        {currentFrame !== -1 && (
          <img
            src={animationImages[currentFrame]}
            alt="Press any button to start"
            className="prompt-image"
          />
        )}
      </div>
    </div>
  );
};

export default InteractionScreen;