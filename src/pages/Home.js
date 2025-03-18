import React from 'react';
import { Link } from 'react-router-dom';

const Home = ({ account, onConnect }) => {
  return (
    <div>
      <section className="hero">
        <h1>Welcome to Education DApp</h1>
        <p>
          A decentralized application for managing education certifications and enrollments on the blockchain.
          Connect your wallet to get started with our platform.
        </p>
        
        {!account && (
          <button onClick={onConnect} className="button">
            Connect with MetaMask
          </button>
        )}
        
        {account && (
          <div className="hero-buttons">
            <Link to="/teacher" className="button">Teacher Portal</Link>
            <Link to="/student" className="button button-secondary" style={{ marginLeft: '1rem' }}>
              Student Portal
            </Link>
          </div>
        )}
      </section>
      
      <section className="features">
        <div className="feature-card">
          <h3>For Teachers</h3>
          <p>Register yourself as a teacher for specific subjects and set your fees. Manage your student enrollments and credentials with blockchain-verified attestations.</p>
        </div>
        
        <div className="feature-card">
          <h3>For Students</h3>
          <p>Enroll in courses with your favorite teachers. All enrollments are securely stored on the blockchain, providing verifiable proof of your educational journey.</p>
        </div>
        
        <div className="feature-card">
          <h3>Blockchain Security</h3>
          <p>All certifications and enrollments are secured on the Ethereum blockchain using EAS (Ethereum Attestation Service), making them immutable and verifiable.</p>
        </div>
      </section>
      
      <section className="card">
        <h2>How It Works</h2>
        <ol style={{ paddingLeft: '1.5rem' }}>
          <li>Connect your MetaMask wallet to get started</li>
          <li>Teachers can register and specify their subjects and fees</li>
          <li>Students can enroll in courses by paying the required fees</li>
          <li>All enrollments are recorded on the blockchain as attestations</li>
          <li>Check enrollment validity and expiration at any time</li>
        </ol>
      </section>
    </div>
  );
};

export default Home; 