import React, { useState, useEffect } from 'react';
import { useUser } from "@clerk/clerk-react";
import '../Dashboard.css';

const QOTD_DATA = [
  "Success is the sum of small efforts, repeated day in and day out. – Robert Collier",
  "Music is the shorthand of emotion. – Leo Tolstoy",
  "Life is like a piano. What you get out of it depends on how you play it. – Tom Lehrer",
  "Consistency is more important than perfection. – Unknown",
  "Amateurs practice until they get it right. Professionals practice until they can’t get it wrong. – Unknown",
  "Frustration is the first sign that a breakthrough is coming. – Unknown",
  "Your future self will thank you for the practice you did today. – Unknown",
  "The joy of music is found in the journey, not just the destination. – Unknown"
];

const Dashboard = () => {
  const { isLoaded, isSignedIn, user } = useUser();
  const [qotd] = useState(() => QOTD_DATA[Math.floor(Math.random() * QOTD_DATA.length)]);
  const [streak, setStreak] = useState(0);

  useEffect(() => {
    if (isLoaded) {
      updateStreak();
    }
  }, [isLoaded, isSignedIn]);

  const updateStreak = async () => {
    const today = new Date().toDateString();
    let savedStreak = 0;
    let lastVisit = "";

    // Pull current data
    if (isSignedIn) {
      savedStreak = user.unsafeMetadata.streak || 0;
      lastVisit = user.unsafeMetadata.lastVisit || "";
    } else {
      savedStreak = parseInt(localStorage.getItem('userStreak') || '0');
      lastVisit = localStorage.getItem('lastVisitDate') || "";
    }

    // Logic: If they haven't visited yet today
    if (lastVisit !== today) {
      let newStreak = savedStreak;
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toDateString();

      if (lastVisit === yesterdayStr) {
        newStreak += 1; 
      } else {
        newStreak = 1; 
      }

      // Save Data quietly
      if (isSignedIn) {
        try {
          await user.update({
            unsafeMetadata: { streak: newStreak, lastVisit: today }
          });
        } catch (err) {
          console.error("Streak sync failed:", err);
        }
      } else {
        localStorage.setItem('userStreak', newStreak);
        localStorage.setItem('lastVisitDate', today);
      }
      setStreak(newStreak);
    } else {
      setStreak(savedStreak);
    }
  };

  return (
    <div className="dashboard-wrapper">
      <div className="dashboard-container">
        
        {/* Streak Display - Now the only item at the top */}
        <div className="streak-badge">
          <span className="streak-fire">🔥</span>
          <span className="streak-count">{streak} Day Practice Streak</span>
        </div>

        <h1 className="dashboard-title">Lesson Dashboard</h1>
        
        <div className="motivation">
          <h1>"{qotd}"</h1>  
        </div>

        <div className="button-container">
          <button 
            onClick={() => window.location.pathname = '/piano'} 
            className="lesson-button piano-button"
          >
            Piano 🎹
          </button>
          
          <button
            onClick={() => window.location.pathname = '/guitar'}
            className="lesson-button guitar-button"
          >
            Guitar 🎸
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;