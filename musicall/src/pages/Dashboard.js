import React, { useState } from 'react';
import '../Dashboard.css';

const QOTD_DATA = [
  // General Motivation, Action, and Starting
  "The best way to get started is to quit talking and begin doing. – Walt Disney",
  "You don’t have to be great to start, but you have to start to be great. – Zig Ziglar",
  "The only way to do great work is to love what you do. – Steve Jobs",
  "Believe you can and you’re halfway there. – Theodore Roosevelt",
  "It does not matter how slowly you go as long as you do not stop. – Confucius",
  "The future belongs to those who believe in the beauty of their dreams. – Eleanor Roosevelt",

  // Music & Practice Focus
  "Music is enough for a lifetime, but a lifetime is not enough for music. – Sergei Rachmaninoff",
  "Don't practice until you get it right; practice until you can't get it wrong. – Unknown",
  "The music is not in the notes, but in the silence between. – Claude Debussy",
  "To play without passion is inexcusable! – Ludwig van Beethoven",
  "The expert at anything was once a beginner. – Helen Hayes",
  "If I don’t practice for a day, I know it. If I don’t practice for three days, the public knows it. – Jascha Heifetz",
  
  // Growth Mindset and Resilience
  "A person who never made a mistake never tried anything new. – Albert Einstein",
  "Success is not final, failure is not fatal: it is the courage to continue that counts. – Winston Churchill",
  "Our greatest weakness lies in giving up. The most certain way to succeed is always to just try one more time. – Thomas A. Edison",
  "The beautiful thing about learning is that nobody can take it away from you. – B.B. King",
  "The mind is everything. What you think you become. – Buddha",
  "Do not fear mistakes. There are none. – Miles Davis",

  // Effort and Daily Discipline
  "I find that the harder I work, the more luck I seem to have. – Thomas Jefferson",
  "Strive for progress, not perfection. – Unknown",
  "The journey of a thousand miles begins with a single step. – Lao Tzu",
  "I cannot teach anybody anything, I can only make them think. – Socrates",
  "The difference between ordinary and extraordinary is practice. – Vladimir Horowitz",
  "Where focus goes, energy flows. – Tony Robbins",

  // Philosophical/Inspirational Music Quotes
  "Music gives a soul to the universe, wings to the mind, flight to the imagination, and life to everything. – Plato",
  "Where words fail, music speaks. – Hans Christian Andersen",
  "It is never too late to be what you might have been. – George Eliot",
  "Do not let what you cannot do interfere with what you can do. – John Wooden",
  "In learning you will teach, and in teaching you will learn. – Phil Collins",
  "The greatest glory in living lies not in never falling, but in rising every time we fall. – Nelson Mandela"
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