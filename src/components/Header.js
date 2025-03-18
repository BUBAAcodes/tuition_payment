import React from 'react';
import { Link } from 'react-router-dom';

const Header = ({ account, onConnect }) => {
  const shortenAddress = (address) => {
    if (!address) return '';
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };

  return (
    <header className="header">
      <div className="header-container">
        <Link to="/" className="logo">Education DApp</Link>
        
        <nav className="nav-links">
          <Link to="/" className="nav-link">Home</Link>
          {account && (
            <>
              <Link to="/teacher" className="nav-link">Teacher</Link>
              <Link to="/student" className="nav-link">Student</Link>
            </>
          )}
        </nav>
        
        <div className="wallet-info">
          {account ? (
            <span className="wallet-address">{shortenAddress(account)}</span>
          ) : (
            <button onClick={onConnect} className="button">Connect Wallet</button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header; 