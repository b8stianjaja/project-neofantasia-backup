import React, { useState, useEffect } from 'react';
import { useCart } from '../../context/CartContext';
import DedicatedProjectRoom from '../DedicatedProjectRoom/DedicatedProjectRoom';
import './CollaborationHub.css';
import { Sun, Moon, PlusCircle } from 'lucide-react';

function CollaborationHub() {
  const { purchasedBeats } = useCart();
  const [focusedProject, setFocusedProject] = useState(null);

  // This effect will run ONLY when the purchasedBeats array changes.
  useEffect(() => {
    console.log("✅ CollaborationHub received new state! purchasedBeats is now:", purchasedBeats);
    
    // If we have new projects and nothing is selected, select the first one.
    if (purchasedBeats.length > 0) {
        const currentFocusedId = focusedProject ? focusedProject.id : null;
        // Check if the currently focused project is still in the list
        const focusedExists = purchasedBeats.some(p => p.id === currentFocusedId);
        if (!focusedExists) {
            setFocusedProject(purchasedBeats[0]);
        }
    } else {
        setFocusedProject(null);
    }
  }, [purchasedBeats]); // The key is having `purchasedBeats` as a dependency.


  // ... (the rest of your CollaborationHub component code remains the same)
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    document.body.className = isDarkMode ? 'dark-mode' : 'light-mode';
  }, [isDarkMode]);

  const handleProjectFocus = (project) => {
    setFocusedProject(project);
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <div className={`hub-container ${isDarkMode ? 'dark' : ''}`}>
      <aside className="hub-sidebar">
        <div className="sidebar-header">
          <h2>Projects</h2>
          <button onClick={toggleDarkMode} className="theme-toggle">
            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </div>
        <ul className="project-list">
          {purchasedBeats.map((beat, index) => (
            <li
              key={`${beat.id}-${index}`}
              onClick={() => handleProjectFocus(beat)}
              className={focusedProject && focusedProject.id === beat.id ? 'active' : ''}
            >
              {beat.title}
            </li>
          ))}
        </ul>
      </aside>
      <main className="hub-main-content">
        {focusedProject ? (
          <DedicatedProjectRoom project={focusedProject} isDarkMode={isDarkMode} />
        ) : (
          <div className="no-projects-message">
            <PlusCircle size={48} className="no-projects-icon" />
            <h2>Welcome to your Collaboration Hub!</h2>
            <p>Your purchased projects will appear here.</p>
          </div>
        )}
      </main>
    </div>
  );
}

export default CollaborationHub;