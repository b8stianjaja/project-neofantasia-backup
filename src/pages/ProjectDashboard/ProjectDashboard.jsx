// src/pages/ProjectDashboard/ProjectDashboard.jsx

import React, { useState, useEffect, useMemo } from 'react';
import ProjectCard from '../../entities/project/ProjectCard';
import { getProjects } from '../../services/api';
import DedicatedProjectRoom from '../DedicatedProjectRoom/DedicatedProjectRoom'; // Import the DedicatedProjectRoom
import './ProjectDashboard.css';

// --- Sub-component for the dynamic Collaboration Space ---
const CollaborationSpace = ({ project, onExitFocus }) => {
    if (!project) {
        return (
            <div className="collaboration-placeholder">
                <div className="placeholder-content">
                    <h3>Select a Project</h3>
                    <p>Choose a project from the celestial stream to focus your work.</p>
                </div>
            </div>
        );
    }

    // Render the DedicatedProjectRoom when a project is focused
    // The onExitFocus prop can be used by DedicatedProjectRoom to provide a "back" button
    return (
        <DedicatedProjectRoom 
            project={project} // Pass the focused project directly as a prop
            onExitFocus={onExitFocus} // Pass the function to unfocus
        />
    );
};

// --- Main Dashboard Component ---
const ProjectDashboard = () => {
    const [projects, setProjects] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [focusedProject, setFocusedProject] = useState(null);

    useEffect(() => {
        const loadProjects = async () => {
            try {
                setIsLoading(true);
                // Add a small delay to showcase the loading animation
                await new Promise(res => setTimeout(res, 750)); 
                const data = await getProjects();
                setProjects(data);
            } catch (err) {
                setError('Could not retrieve project data.');
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        };
        loadProjects();
    }, []);
    
    // Add a class to the main container when a project is focused
    const hubLayoutClasses = `celestial-hub-layout ${focusedProject ? 'focus-mode' : ''}`;

    return (
        <div id="dashboard-page-container" className={hubLayoutClasses}>
            {/* Left Column: The "Celestial Stream" of projects */}
            <aside className="hub-project-stream">
                <header className="stream-header">
                    <h3>Celestial Stream</h3>
                </header>
                <div className="stream-scroll-area">
                    {isLoading && (
                        <div className="loading-pulse">
                            <div></div><div></div><div></div>
                        </div>
                    )}
                    {error && <div className="status-message error">{error}</div>}
                    {!isLoading && !error && projects.map(project => (
                        <ProjectCard 
                            key={project.id} 
                            project={project}
                            isFocused={focusedProject?.id === project.id}
                            onSelect={() => setFocusedProject(project)}
                        />
                    ))}
                </div>
            </aside>

            {/* Right Column: The immersive collaboration space */}
            <main className="hub-focus-space">
                <CollaborationSpace 
                    project={focusedProject}
                    onExitFocus={() => setFocusedProject(null)}
                />
            </main>
        </div>
    );
};

export default ProjectDashboard;