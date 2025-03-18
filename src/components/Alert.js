import React from 'react';

const Alert = ({ type, message, onClose }) => {
  if (!message) return null;
  
  return (
    <div className={`alert alert-${type}`}>
      {message}
      {onClose && (
        <button 
          onClick={onClose} 
          style={{ 
            background: 'none', 
            border: 'none', 
            float: 'right', 
            cursor: 'pointer',
            fontSize: '1rem'
          }}
        >
          &times;
        </button>
      )}
    </div>
  );
};

export default Alert; 