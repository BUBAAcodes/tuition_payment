import React, { useState } from 'react';
import Alert from '../components/Alert';
import { registerTeacher } from '../utils/web3';

const Teacher = ({ account }) => {
  const [subject, setSubject] = useState('');
  const [fees, setFees] = useState('');
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({ show: false, type: '', message: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!subject || !fees) {
      setAlert({
        show: true,
        type: 'error',
        message: 'Please fill in all fields'
      });
      return;
    }

    if (isNaN(fees) || parseFloat(fees) <= 0) {
      setAlert({
        show: true,
        type: 'error',
        message: 'Please enter a valid fee amount'
      });
      return;
    }

    try {
      setLoading(true);
      await registerTeacher(subject, parseFloat(fees));
      
      setAlert({
        show: true,
        type: 'success',
        message: `Successfully registered as a teacher for ${subject} with a fee of ${fees} ETH`
      });
      
      // Reset form
      setSubject('');
      setFees('');
    } catch (error) {
      setAlert({
        show: true,
        type: 'error',
        message: `Failed to register: ${error.message}`
      });
    } finally {
      setLoading(false);
    }
  };

  const closeAlert = () => {
    setAlert({ show: false, type: '', message: '' });
  };

  return (
    <div>
      <h1 className="page-title">Teacher Portal</h1>
      
      {alert.show && (
        <Alert 
          type={alert.type} 
          message={alert.message} 
          onClose={closeAlert} 
        />
      )}
      
      <div className="card form-card">
        <div className="card-header">
          <h2>Register as a Teacher</h2>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="subject">Subject</label>
            <input
              type="text"
              id="subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="e.g., Mathematics, Physics, Computer Science"
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="fees">Fees (ETH)</label>
            <input
              type="number"
              id="fees"
              value={fees}
              onChange={(e) => setFees(e.target.value)}
              placeholder="e.g., 0.1"
              step="0.01"
              min="0"
              required
            />
            <small>Set the fee amount in ETH that students will pay to enroll in your subject.</small>
          </div>
          
          <button 
            type="submit" 
            className="button" 
            disabled={loading || !account}
          >
            {loading ? 'Processing...' : 'Register Subject'}
          </button>
        </form>
      </div>
      
      <div className="card">
        <div className="card-header">
          <h2>Your Teacher Information</h2>
        </div>
        <p>Connected Address: {account}</p>
        <p>Use this portal to register yourself as a teacher for different subjects.</p>
        <p>Once registered, students can enroll in your courses by paying the specified fees.</p>
      </div>
    </div>
  );
};

export default Teacher; 