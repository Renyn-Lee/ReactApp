import React, { useState } from 'react';
import '../Dashboard.css';

const QOTD_DATA = [
  // Focus on the Power of Small Steps
  "Success is the sum of small efforts, repeated day in and day out. – Robert Collier",
  "You are one practice session away from a better mood and a better sound. – Unknown",
  "Little by little, one travels far. – J.R.R. Tolkien",
  "Don't look at the whole mountain; just look at the next note. – Unknown",
  "Consistency is more important than perfection. – Unknown",

  // Music-Specific Inspiration
  "The piano keys are black and white, but they sound like a million colors in your mind. – Maria Cristina Mena",
  "Music is the shorthand of emotion. – Leo Tolstoy",
  "Life is like a piano. What you get out of it depends on how you play it. – Tom Lehrer",
  "Every masterpiece was once a mess of wrong notes. – Unknown",
  "The piano is a monster that screams when you touch its teeth. – Andres Segovia",

  // Discipline & The "Hard" Parts
  "Amateurs practice until they get it right. Professionals practice until they can’t get it wrong. – Unknown",
  "If you want to play like a pro, you have to practice like a beginner. – Unknown",
  "The only person you should try to be better than is the person you were yesterday. – Matty Mullins",
  "Hard work beats talent when talent doesn’t work hard. – Tim Notke",
  "Practice is the bridge between where you are and where you want to be. – Unknown",

  // Overcoming Frustration
  "Don't stop when you're tired. Stop when you're done. – David Goggins",
  "Mistakes are proof that you are trying. – Unknown",
  "Every time you think you can't, you must. – Unknown",
  "Frustration is the first sign that a breakthrough is coming. – Unknown",
  "Your struggle is your strength. Keep playing. – Unknown",

  // Long-Term Vision
  "The best time to start practicing was 20 years ago. The second best time is now. – Chinese Proverb",
  "It’s not about being the best. It’s about being better than you were yesterday. – Unknown",
  "Knowledge is knowing how to play the notes; Wisdom is knowing when to let them breathe. – Unknown",
  "Everything is hard before it is easy. – Goethe",
  "Your future self will thank you for the practice you did today. – Unknown",

  // The Joy of Learning
  "Learning an instrument is like discovering a new room in your house that you never knew existed. – Unknown",
  "Music can change the world because it can change people. – Bono",
  "To learn an instrument is to give yourself a voice for life. – Unknown",
  "Play with your heart or don't play at all. – Unknown",
  "The joy of music is found in the journey, not just the destination. – Unknown"
];

function getRandomQOTD(arr) {
  const randomIndex = Math.floor(Math.random() * arr.length);
  return arr[randomIndex];
}

const Dashboard = () => {
  const [qotd] = useState(() => {
    return getRandomQOTD(QOTD_DATA);
  });

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
        <div className='motivation'>
        <h1>{qotd} </h1>  
        </div>

        <div className="button-container">
          <button onClick={handlePianoClick}
            className="lesson-button piano-button"> Piano 🎹</button>
          
          <button
            onClick={handleGuitarClick}
            className="lesson-button guitar-button"
          >
            Guitar🎸
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;