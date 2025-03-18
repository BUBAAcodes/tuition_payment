import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div style={{ textAlign: 'center', padding: '4rem 1rem' }}>
      <h1>404 - Page Not Found</h1>
      <p>The page you are looking for does not exist.</p>
      <Link to="/" className="button" style={{ marginTop: '1rem' }}>
        Return to Home
      </Link>
    </div>
  );
};

export default NotFound; 