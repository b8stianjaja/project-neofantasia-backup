import React, { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './LoadPage.css';
import '../Page.css';
import ProjectCard from '../../entities/project/ProjectCard';

// Mock data representing projects fetched from a backend
const mockProjects = [
  { id: 'proj-001', name: 'Cosmic Drift Remix', status: 'In Progress', lastUpdated: '2025-06-25', beat: { id: 1, title: 'Cosmic Drift', imgSrc: '/beats/cosmic-drift.jpg' } },
  { id: 'proj-002', name: 'Neon Soul Collab', status: 'Under Review', lastUpdated: '2025-06-22', beat: { id: 2, title: 'Neon Soul', imgSrc: '/beats/neon-soul.jpg' } },
  { id: 'proj-003', name: 'Starlight Vocal Mix', status: 'Completed', lastUpdated: '2025-05-10', beat: { id: 3, title: 'Starlight', imgSrc: '/beats/starlight.jpg' } },
  { id: 'proj-004', name: 'Future Echoes Idea', status: 'Ideation', lastUpdated: '2025-06-24', beat: { id: 4, title: 'Future Echoes', imgSrc: '/beats/future-echoes.jpg' } },
  { id: 'proj-005', name: 'Cyberdream Main Theme', status: 'In Progress', lastUpdated: '2025-06-20', beat: { id: 5, title: 'Cyberdream', imgSrc: '/beats/cyberdream.jpg' } },
];


/**
 * DashboardPage (formerly LoadPage) - Renders the "Centralized Workflow Hub".
 * This dashboard displays a filterable and sortable list of all active projects.
 */
const LoadPage = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('lastUpdated');

  // Memoized computation for filtering and sorting projects
  const filteredProjects = useMemo(() => {
    let projects = [...mockProjects];

    // Filtering logic
    if (searchTerm) {
      projects = projects.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.beat.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Sorting logic
    projects.sort((a, b) => {
      if (sortBy === 'lastUpdated') {
        return new Date(b.lastUpdated) - new Date(a.lastUpdated);
      }
      if (sortBy === 'name') {
        return a.name.localeCompare(b.name);
      }
      if (sortBy === 'status') {
        return a.status.localeCompare(b.status);
      }
      return 0;
    });

    return projects;
  }, [searchTerm, sortBy]);

  const handleBack = () => {
    navigate('/'); // Navigate back to the main menu
  };

  return (
    <div className="page-container">
      <div className="dashboard-page">
        <h1 className="dashboard-title">CENTRALIZED WORKFLOW HUB</h1>

        {/* Filter and Sort Controls */}
        <div className="controls-container">
          <input
            type="text"
            placeholder="Search projects..."
            className="search-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <select
            className="sort-select"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="lastUpdated">Sort by Last Updated</option>
            <option value="name">Sort by Name</option>
            <option value="status">Sort by Status</option>
          </select>
        </div>

        {/* Projects Grid */}
        <div className="projects-grid">
          {filteredProjects.map((project) => (
            // In a real app, this would link to `/projects/${project.id}`
            <Link to={`/`} key={project.id} className="project-link">
              <ProjectCard project={project} />
            </Link>
          ))}
        </div>

         <div className="dashboard-actions">
           <button onClick={handleBack} className="back-button">BACK</button>
        </div>
      </div>
    </div>
  );
};

export default LoadPage;
