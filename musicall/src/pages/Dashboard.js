import React from 'react';
import '../Dashboard.css';

const Dashboard = () => {
  const handlePianoClick = () => {
    window.location.pathname = '/piano';
  };

  const handleGuitarClick = () => {
    window.location.pathname = '/guitar';
  };

  return (
    <div className="dashboard-wrapper">
      <div className="dashboard-container">
        <h1 className="dashboard-title">
          Lesson Dashboard
        </h1>
        
        <div className="button-container">
          <button
            onClick={handlePianoClick}
            className="lesson-button piano-button"
          >
            Piano
          </button>
          
          <button
            onClick={handleGuitarClick}
            className="lesson-button guitar-button"
          >
            Guitar
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;