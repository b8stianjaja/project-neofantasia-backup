// src/pages/DedicatedProjectRoom/DedicatedProjectRoom.jsx

import React from 'react';
import { useParams, Link } from 'react-router-dom';
import './DedicatedProjectRoom.css'; // We will create this new CSS file

// Mock Data for demonstration
const mockProjectDetails = {
  id: 'proj_alpha_001',
  title: "Aethel's Opus",
  status: 'In Progress',
  collaborators: ['Aethel', 'Lumina'],
  tasks: {
    todo: ['Outline the main melody', 'Select primary instruments'],
    inProgress: ['Develop the bassline'],
    done: ['Initial chord progression'],
  },
  activity: [
    { user: 'Lumina', action: 'Completed "Initial chord progression"', time: '1 day ago' },
    { user: 'Aethel', action: 'Added a new task: "Select primary instruments"', time: '2 days ago' },
  ],
};

// --- Sub-components for a clean structure ---

const TaskColumn = ({ title, tasks }) => (
  <div className="task-column">
    <h3>{title}</h3>
    <div className="tasks-container">
      {tasks.map((task, index) => (
        <div key={index} className="task-card">{task}</div>
      ))}
    </div>
  </div>
);

const ActivityItem = ({ item }) => (
  <div className="activity-item">
    <p><strong>{item.user}</strong> {item.action}</p>
    <time>{item.time}</time>
  </div>
);

// --- Main Project Room Component ---

const DedicatedProjectRoom = () => {
  const { projectId } = useParams();
  // In a real app, you would fetch project details based on projectId
  const project = mockProjectDetails;

  return (
    <div className="project-room-container">
      <header className="project-room-header">
        <div>
          <Link to="/dashboard" className="back-link">&larr; Back to Hub</Link>
          <h1>{project.title}</h1>
          <span className={`project-status status-${project.status.toLowerCase().replace(' ', '-')}`}>
            {project.status}
          </span>
        </div>
      </header>

      <div className="project-room-layout">
        <aside className="project-sidebar">
          <div className="sidebar-module">
            <h4>Collaborators</h4>
            <ul>
              {project.collaborators.map(c => <li key={c}>{c}</li>)}
            </ul>
          </div>
        </aside>

        <main className="project-main-content">
          <div className="task-board">
            <TaskColumn title="To Do" tasks={project.tasks.todo} />
            <TaskColumn title="In Progress" tasks={project.tasks.inProgress} />
            <TaskColumn title="Done" tasks={project.tasks.done} />
          </div>
        </main>
        
        <aside className="project-sidebar">
          <div className="sidebar-module">
            <h4>Activity Feed</h4>
            <div className="activity-feed">
                {project.activity.map((item, index) => (
                    <ActivityItem key={index} item={item} />
                ))}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default DedicatedProjectRoom;