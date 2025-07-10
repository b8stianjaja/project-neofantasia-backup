import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import './HomePage.css';

function HomePage() {
  const [hoveredItem, setHoveredItem] = useState(null);

  const menuItems = [
    { name: "new game", path: "/beats", normal: "/menu/newgame12.png", hover: "/menu/newgame12hover.png" },
    { name: "load game", path: "/hub", normal: "/menu/loadgame12.png", hover: "/menu/loadgame12hover.png" },
    { name: "config", path: "/config", normal: "/menu/config12.png", hover: "/menu/config12hover.png" },
    { name: "exit", path: "/contact", normal: "/menu/exit12.png", hover: "/menu/exit12hover.png" }
  ];

  return (
    <main className="title-screen">
      <div className="title-content">
        <div className="logo-container">
          <img src="/bgr/neofantasia2.png" alt="Artist Logo" className="title-logo" />
        </div>
        <nav className="main-menu">
          <ul>
            {menuItems.map((item, index) => (
              <li
                key={item.name}
                onMouseEnter={() => setHoveredItem(item.name)}
                onMouseLeave={() => setHoveredItem(null)}
                style={{ animationDelay: `${0.2 + index * 0.1}s` }}
              >
                <NavLink to={item.path} className="menu-link">
                  <img
                    className="menu-image"
                    src={hoveredItem === item.name ? item.hover : item.normal}
                    alt={item.name}
                  />
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </div>
      <footer className="title-footer">
        <p>© {new Date().getFullYear()} neofantasia. All Rights Reserved.</p>
      </footer>
    </main>
  );
}

export default HomePage;