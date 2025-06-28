// src/pages/DedicatedProjectRoom/DedicatedProjectRoom.jsx

import React, { useState, useCallback, useEffect, useRef } from 'react';
import './DedicatedProjectRoom.css'; 

// --- Sub-components for a clean structure ---

const TaskColumn = ({ title, tasks }) => (
  <div className="task-column">
    <h3>{title}</h3>
    <div className="tasks-container">
      {tasks.length > 0 ? (
        tasks.map((task, index) => (
          <div key={index} className="task-card">{task}</div>
        ))
      ) : (
        <p className="no-tasks">No tasks here yet.</p>
      )}
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

const DedicatedProjectRoom = ({ project }) => { 
  const [activeTab, setActiveTab] = useState('tasks');
  const [messageInput, setMessageInput] = useState('');
  const [currentChatHistory, setCurrentChatHistory] = useState(project.chatHistory || []);
  const chatWindowRef = useRef(null);

  // Reset chat history and scroll to bottom when project changes
  useEffect(() => {
    setCurrentChatHistory(project.chatHistory || []);
    if (chatWindowRef.current) {
        chatWindowRef.current.scrollTop = chatWindowRef.current.scrollHeight;
    }
  }, [project]);

  // Scroll to bottom when new messages are added
  useEffect(() => {
    if (chatWindowRef.current) {
      chatWindowRef.current.scrollTop = chatWindowRef.current.scrollHeight;
    }
  }, [currentChatHistory]);

  const handleSendMessage = useCallback(() => {
    if (messageInput.trim()) {
      const now = new Date();
      const hours = now.getHours();
      const minutes = now.getMinutes();
      const formattedTime = `${hours}:${minutes < 10 ? '0' : ''}${minutes}`;

      const newMessage = {
        sender: 'You (Buyer)',
        message: messageInput.trim(),
        type: 'buyer',
        time: formattedTime
      };
      setCurrentChatHistory(prev => [...prev, newMessage]);
      setMessageInput('');
      console.log('Message sent:', newMessage);
    }
  }, [messageInput]);

  if (!project) {
    return (
      <div className="project-room-container" style={{ textAlign: 'center', padding: '50px', background: 'none', boxShadow: 'none' }}>
        <h2>No Project Selected</h2>
        <p>Please select a project from the sidebar.</p>
      </div>
    );
  }

  return (
    <div className="project-room-container">
      <header className="project-room-header">
        <div>
          <h1>{project.title}</h1>
          <span className={`project-status status-${project.status.toLowerCase().replace(' ', '-')}`}>
            {project.status}
          </span>
        </div>
      </header>

      <div className="project-room-layout">
        <main className="project-main-content">
          {/* Tab Navigation */}
          <nav className="collaboration-tabs">
            <button 
              className={activeTab === 'tasks' ? 'active' : ''} 
              onClick={() => setActiveTab('tasks')}
            >
              Tasks
            </button>
            <button 
              className={activeTab === 'chat' ? 'active' : ''} 
              onClick={() => setActiveTab('chat')}
            >
              Live Chat
            </button>
            <button 
              className={activeTab === 'files' ? 'active' : ''} 
              onClick={() => setActiveTab('files')}
            >
              Files
            </button>
          </nav>

          {/* Tab Content */}
          <div className="tab-content">
            {activeTab === 'tasks' && (
              <div className="task-board">
                <TaskColumn title="To Do" tasks={project.tasks.todo} />
                <TaskColumn title="In Progress" tasks={project.tasks.inProgress} />
                <TaskColumn title="Done" tasks={project.tasks.done} />
              </div>
            )}

            {activeTab === 'chat' && (
              <div className="chat-module">
                <div ref={chatWindowRef} className="chat-window">
                  {currentChatHistory.length === 0 && (
                     <p className="chat-placeholder-message"><em>(Start chatting with your producer!)</em></p>
                  )}
                  {currentChatHistory.map((msg, index) => (
                    <div key={index} className={`chat-message ${msg.type}`}>
                      <strong>{msg.sender}:</strong> {msg.message}
                      <time>{msg.time}</time>
                    </div>
                  ))}
                </div>
                <div className="chat-input-area">
                  <textarea 
                    placeholder="Type your message..." 
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    onKeyPress={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSendMessage(); } }}
                  ></textarea>
                  <button className="chat-send-btn" onClick={handleSendMessage}>Send</button>
                </div>
              </div>
            )}

            {activeTab === 'files' && (
              <div className="file-management-module">
                <div className="file-list">
                  <p><em>(Uploaded files will be listed here.)</em></p>
                  <ul>
                    <li>Beat_Version_2.mp3 <button>Download</button></li>
                    <li>Vocal_Draft_1.wav <button>Download</button></li>
                  </ul>
                </div>
                <button className="upload-file-btn">Upload File</button>
              </div>
            )}
          </div> {/* End tab-content */}

        </main>
        
        {/* Combined Right Sidebar */}
        <aside className="project-sidebar right-sidebar">
          <div className="sidebar-module">
            <h4>Collaborators</h4>
            <ul>
              {project.collaborators.map(c => <li key={c}>{c}</li>)}
            </ul>
          </div>

          <div className="sidebar-module activity-feed-module">
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