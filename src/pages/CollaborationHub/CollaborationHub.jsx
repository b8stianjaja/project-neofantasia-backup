// src/pages/CollaborationHub/CollaborationHub.jsx

import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import DedicatedProjectRoom from '../DedicatedProjectRoom/DedicatedProjectRoom';
import './CollaborationHub.css';

const CollaborationHub = () => {
    const { purchasedBeats } = useCart(); // Get purchased beats from CartContext
    const [focusedProject, setFocusedProject] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        setIsLoading(true);
        console.log('CollaborationHub: useEffect triggered. Current purchasedBeats:', purchasedBeats);
        
        const timer = setTimeout(() => {
            if (purchasedBeats.length > 0) {
                // Determine the project to focus:
                // 1. If there's a currently focused project and it's still in purchasedBeats, keep it.
                // 2. Otherwise, focus the first purchased beat.
                const initialFocused = focusedProject && purchasedBeats.find(p => p.id === focusedProject.id)
                                     ? focusedProject
                                     : purchasedBeats[0];
                setFocusedProject(initialFocused);
                console.log('CollaborationHub: Setting focusedProject to:', initialFocused);
            } else {
                setFocusedProject(null);
                console.log('CollaborationHub: No purchased beats, setting focusedProject to null.');
            }
            setIsLoading(false);
            console.log('CollaborationHub: Loading finished.');
        }, 200); // Reduced delay for faster loading feel

        return () => clearTimeout(timer); // Cleanup timer

    }, [purchasedBeats]); // Re-run when purchasedBeats change

    return (
        <div className="collaboration-hub-layout">
            {/* Left Sidebar for Project Selection */}
            <aside className="hub-sidebar">
                <header className="sidebar-header">
                    <h2>Your Projects</h2>
                </header>
                <nav className="project-nav">
                    {isLoading && (
                        <div className="loading-pulse-sidebar">
                            <div></div><div></div><div></div>
                        </div>
                    )}
                    {!isLoading && purchasedBeats.length > 0 ? (
                        purchasedBeats.map(project => ( // Directly map purchasedBeats
                            <div
                                key={project.id}
                                className={`project-link-item ${focusedProject?.id === project.id ? 'active' : ''}`}
                                onClick={() => setFocusedProject(project)}
                            >
                                <span className="project-title-sidebar">{project.title}</span>
                                <span className={`project-status-dot status-${project.status.toLowerCase().replace(' ', '-')}`}></span>
                            </div>
                        ))
                    ) : (
                        !isLoading && (
                            <p className="no-projects">
                                You haven't purchased any beats yet. Go to <NavLink to="/beats">New Game</NavLink> to start!
                            </p>
                        )
                    )}
                </nav>
                <div className="sidebar-footer">
                    <NavLink to="/" className="back-to-home-link">&larr; Home</NavLink>
                </div>
            </aside>

            {/* Main Content Area: Dedicated Project Room */}
            <main className="hub-main-content">
                {focusedProject ? (
                    <DedicatedProjectRoom project={focusedProject} />
                ) : (
                    <div className="hub-placeholder">
                        <div className="placeholder-content">
                            <h3>Welcome to Your Collaboration Hub</h3>
                            <p>Select a project from the left sidebar to start working with your producer on your purchased beats.</p>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
};

export default CollaborationHub;