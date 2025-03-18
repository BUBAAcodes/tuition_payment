import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header';
import Home from './pages/Home';
import Teacher from './pages/Teacher';
import Student from './pages/Student';
import NotFound from './pages/NotFound';
import './App.css';
import { connectToMetaMask, isMetaMaskInstalled, listenToAccountChanges } from './utils/web3';

function App() {
  const [account, setAccount] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const init = async () => {
      try {
        if (isMetaMaskInstalled()) {
          try {
            const connectedAccount = await connectToMetaMask();
            setAccount(connectedAccount);
          } catch (error) {
            console.log("User denied account access or another error occurred");
          }
        } else {
          setError("MetaMask is not installed. Please install MetaMask to use this application.");
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    init();

    // Set up event listener for account changes
    listenToAccountChanges((newAccount) => {
      setAccount(newAccount);
    });

    // Cleanup
    return () => {
      if (window.ethereum) {
        window.ethereum.removeAllListeners('accountsChanged');
      }
    };
  }, []);

  const handleConnect = async () => {
    try {
      setLoading(true);
      const connectedAccount = await connectToMetaMask();
      setAccount(connectedAccount);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="loading-spinner"></div>
        <p>Loading Application...</p>
      </div>
    );
  }

  return (
    <Router>
      <div className="app">
        <Header account={account} onConnect={handleConnect} />
        <div className="container">
          {error && (
            <div className="error-message">
              <p>{error}</p>
              {error.includes("MetaMask is not installed") && (
                <a 
                  href="https://metamask.io/download/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="button"
                >
                  Install MetaMask
                </a>
              )}
            </div>
          )}
          <Routes>
            <Route path="/" element={<Home account={account} onConnect={handleConnect} />} />
            <Route 
              path="/teacher" 
              element={account ? <Teacher account={account} /> : <Navigate to="/" />} 
            />
            <Route 
              path="/student" 
              element={account ? <Student account={account} /> : <Navigate to="/" />} 
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
        <footer className="footer">
          <p>&copy; {new Date().getFullYear()} Education DApp | Built with ❤️ and Ethereum</p>
        </footer>
      </div>
    </Router>
  );
}

export default App; 