import React from 'react';
import './ProjectCard.css';

/**
 * ProjectCard component - Displays a summary of a single creative project.
 */
const ProjectCard = ({ project }) => {
  const { name, status, lastUpdated, beat } = project;

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'completed': return 'status-completed';
      case 'in progress': return 'status-in-progress';
      case 'under review': return 'status-review';
      default: return 'status-ideation';
    }
  };

  return (
    <div className="project-card">
      <div className="project-card-image-container">
        <img src={beat.imgSrc} alt={beat.title} className="project-card-image" />
      </div>
      <div className="project-card-info">
        <h3 className="project-card-title">{name}</h3>
        <p className="project-card-beat-title">Beat: {beat.title}</p>
        <div className="project-card-status-container">
          <span className={`project-card-status-indicator ${getStatusColor(status)}`}></span>
          <p className="project-card-status">{status}</p>
        </div>
      </div>
      <div className="project-card-footer">
        <p className="project-card-last-updated">Last updated: {lastUpdated}</p>
      </div>
    </div>
  );
};

export default ProjectCard;
