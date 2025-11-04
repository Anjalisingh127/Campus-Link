import React from 'react';
import { Link } from 'react-router-dom'; // Import Link
import './Header.css';

function Header() {
  return (
    <header className="header">
      <div className="header-container">
        {/* Logo now links to the homepage */}
        <Link to="/" className="logo">
          🎓 CampusConnect
        </Link>
        <nav className="nav-menu">
          {/* Replace <a> tags with <Link> tags */}
          <Link to="/">All Events</Link>
          <Link to="/hackathons">Hackathons</Link>
          <Link to="/internships">Internships</Link>
          <a href="#">Login</a> {/* We'll leave this as 'a' for now */}
        </nav>
      </div>
    </header>
  );
}

export default Header;