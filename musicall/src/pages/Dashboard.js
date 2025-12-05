import React, { useState } from 'react';
import '../Dashboard.css';

const QOTD_DATA = [
  // Focus on Passion & Purpose
"Music is enough for a lifetime, but a lifetime is not enough for music. – Sergei Rachmaninoff",
  "To play without passion is inexcusable! – Ludwig van Beethoven",
  "Where words fail, music speaks. – Hans Christian Andersen",
  "The music is not in the notes, but in the silence between. – Claude Debussy / W.A. Mozart",
  "Music gives a soul to the universe, wings to the mind, flight to the imagination, and life to everything. – Plato",
  "The only truth is music. – Jack Kerouac",
  "Music washes away from the soul the dust of everyday life. – Berthold Auerbach",
  "Truly there would be reason to go mad were it not for music. – Pyotr Ilyich Tchaikovsky",
  "The only thing better than singing is more singing. – Ella Fitzgerald",
  "My music is best understood by children and animals. – Igor Stravinsky",
  
  // Focus on Learning, Starting, and Growth Mindset
  "The beautiful thing about learning is that nobody can take it away from you. – B.B. King",
  "The expert at anything was once a beginner. – Helen Hayes",
  "You don’t have to be great to start, but you have to start to be great. – Zig Ziglar",
  "In learning you will teach, and in teaching you will learn. – Phil Collins",
  "Do not let what you cannot do interfere with what you can do. – John Wooden",
  "Music is a more potent instrument than any other for education. – Plato",
  "I don’t practice to get it right, I practice so I never forget it. – Unknown",
  "If I had not studied music, there would be no Macintosh computers today. – Jef Raskin",
  "Every great artist was once a terrible artist. – Unknown",
  "Music is your own experience, your thoughts, your wisdom. If you don't live it, it won't come out of your horn. – Charlie Parker",
  
  // Focus on Practice, Dedication, and Resilience
  "Don't practice until you get it right; practice until you can't get it wrong. – Unknown",
  "If I don’t practice for a day, I know it. If I don’t practice for two days, the critics know it. And if I don’t practice for three days, the public knows it. – Jascha Heifetz",
  "Do not fear mistakes. There are none. – Miles Davis",
  "Simplicity is the final achievement... it is simplicity that emerges as the crowning reward of art. – Frédéric Chopin",
  "The difference between ordinary and extraordinary is practice. – Vladimir Horowitz",
  "I sit down to the piano regularly at nine-o'clock in the morning and Mesdames les Muses have learned to be on time. – Pyotr Ilyich Tchaikovsky",
  "Practice makes progress, not perfect. – Unknown",
  "To stop the flow of music would be like the stopping of time itself, incredible and inconceivable. – Aaron Copland",
  "The notes I handle no better than many pianists. But the pauses, ah, that is where the art resides. – Artur Schnabel",
  "The best music is essentially what's happening now, the immediate present. – Cecil Taylor"
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