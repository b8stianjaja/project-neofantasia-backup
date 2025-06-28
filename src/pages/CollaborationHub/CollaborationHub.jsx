import React, { useState, useEffect } from 'react';
import { useCart } from '../../context/CartContext';
// Corrected the import path below
import DedicatedProjectRoom from '../DedicatedProjectRoom/DedicatedProjectRoom';
import './CollaborationHub.css';

function CollaborationHub() {
  const { purchasedBeats } = useCart();
  const [focusedProject, setFocusedProject] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (purchasedBeats && purchasedBeats.length > 0) {
      // Set the first project as the default focused one
      if (!focusedProject) {
        setFocusedProject(purchasedBeats[0]);
      }
    } else {
      setFocusedProject(null);
    }
    setIsLoading(false);
  }, [purchasedBeats, focusedProject]);


  if (isLoading) {
    return <div className="hub-container"><p>Loading Collaboration Hub...</p></div>;
  }

  return (
    <div className="hub-container">
      <aside className="hub-sidebar">
        <h2>Projects</h2>
        <div className="project-list">
          {purchasedBeats && purchasedBeats.length > 0 ? (
            purchasedBeats.map((beat) => (
              <div
                key={beat.id}
                className={`project-item ${focusedProject && focusedProject.id === beat.id ? 'active' : ''}`}
                onClick={() => setFocusedProject(beat)}
              >
                <h3>{beat.title}</h3>
                <p>{beat.producer}</p>
              </div>
            ))
          ) : (
            <p className="no-projects">No active projects. Purchase a beat to get started!</p>
          )}
        </div>
      </aside>
      <main className="hub-main-content">
        {focusedProject ? (
          <DedicatedProjectRoom project={focusedProject} />
        ) : (
          <div className="no-project-selected">
            <h2>Welcome to the Collaboration Hub</h2>
            <p>Select a project from the list to begin, or purchase a new beat to create a new project.</p>
          </div>
        )}
      </main>
    </div>
  );
}

export default CollaborationHub;