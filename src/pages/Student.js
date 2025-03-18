import React, { useState } from 'react';
import Alert from '../components/Alert';
import { enrollStudent, checkEnrollmentValidity } from '../utils/web3';

const Student = ({ account }) => {
  const [teacherAddress, setTeacherAddress] = useState('');
  const [subject, setSubject] = useState('');
  const [validityPeriod, setValidityPeriod] = useState('30');
  const [fees, setFees] = useState('');
  const [loading, setLoading] = useState(false);
  const [verifyLoading, setVerifyLoading] = useState(false);
  const [alert, setAlert] = useState({ show: false, type: '', message: '' });
  const [validityInfo, setValidityInfo] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!teacherAddress || !subject || !validityPeriod || !fees) {
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
      await enrollStudent(
        teacherAddress, 
        subject, 
        parseInt(validityPeriod), 
        parseFloat(fees)
      );
      
      setAlert({
        show: true,
        type: 'success',
        message: `Successfully enrolled in ${subject} with teacher ${teacherAddress}`
      });
      
      // Reset form
      setTeacherAddress('');
      setSubject('');
      setValidityPeriod('30');
      setFees('');
    } catch (error) {
      setAlert({
        show: true,
        type: 'error',
        message: `Failed to enroll: ${error.message}`
      });
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyEnrollment = async (e) => {
    e.preventDefault();
    
    if (!teacherAddress || !subject) {
      setAlert({
        show: true,
        type: 'error',
        message: 'Please enter teacher address and subject to verify'
      });
      return;
    }

    try {
      setVerifyLoading(true);
      const result = await checkEnrollmentValidity(account, teacherAddress, subject);
      
      setValidityInfo(result);
      
      if (result.isValid) {
        setAlert({
          show: true,
          type: 'success',
          message: `Your enrollment is valid with ${result.remainingValidity} days remaining`
        });
      } else {
        setAlert({
          show: true,
          type: 'warning',
          message: 'Your enrollment is not valid or has expired'
        });
      }
    } catch (error) {
      setAlert({
        show: true,
        type: 'error',
        message: `Failed to verify enrollment: ${error.message}`
      });
    } finally {
      setVerifyLoading(false);
    }
  };

  const closeAlert = () => {
    setAlert({ show: false, type: '', message: '' });
  };

  return (
    <div>
      <h1 className="page-title">Student Portal</h1>
      
      {alert.show && (
        <Alert 
          type={alert.type} 
          message={alert.message} 
          onClose={closeAlert} 
        />
      )}
      
      <div className="card form-card">
        <div className="card-header">
          <h2>Enroll in a Course</h2>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="teacherAddress">Teacher Address</label>
            <input
              type="text"
              id="teacherAddress"
              value={teacherAddress}
              onChange={(e) => setTeacherAddress(e.target.value)}
              placeholder="0x..."
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="subject">Subject</label>
            <input
              type="text"
              id="subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="e.g., Mathematics"
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="validityPeriod">Validity Period (Days)</label>
            <input
              type="number"
              id="validityPeriod"
              value={validityPeriod}
              onChange={(e) => setValidityPeriod(e.target.value)}
              min="1"
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
          </div>
          
          <button 
            type="submit" 
            className="button" 
            disabled={loading || !account}
          >
            {loading ? 'Processing...' : 'Enroll Now'}
          </button>
        </form>
      </div>
      
      <div className="card form-card">
        <div className="card-header">
          <h2>Verify Enrollment</h2>
        </div>
        
        <form onSubmit={handleVerifyEnrollment}>
          <div className="form-group">
            <label htmlFor="verifyTeacherAddress">Teacher Address</label>
            <input
              type="text"
              id="verifyTeacherAddress"
              value={teacherAddress}
              onChange={(e) => setTeacherAddress(e.target.value)}
              placeholder="0x..."
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="verifySubject">Subject</label>
            <input
              type="text"
              id="verifySubject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="e.g., Mathematics"
              required
            />
          </div>
          
          <button 
            type="submit" 
            className="button" 
            disabled={verifyLoading || !account}
          >
            {verifyLoading ? 'Verifying...' : 'Verify Enrollment'}
          </button>
        </form>
        
        {validityInfo && (
          <div className={`alert ${validityInfo.isValid ? 'alert-success' : 'alert-warning'}`} style={{ marginTop: '1rem' }}>
            <h3>Enrollment Status</h3>
            <p>Status: {validityInfo.isValid ? 'Valid' : 'Invalid/Expired'}</p>
            {validityInfo.isValid && (
              <p>Remaining Days: {Math.ceil(validityInfo.remainingValidity / (24 * 60 * 60))}</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Student; 