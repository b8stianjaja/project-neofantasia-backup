import React from 'react';
import { NavLink } from 'react-router-dom';
import './../Page.css'; // Import the shared page styles

function ContactPage() {
  return (
    <div className="page-container">
      <h1 className="page-title">CONTATO</h1>
      <p>EN BREVE...</p>
      <NavLink to="/" className="back-link">
        &larr; back {/* FIX IS HERE: "baq" changed to "back" */}
      </NavLink>
    </div>
  );
}

export default ContactPage;