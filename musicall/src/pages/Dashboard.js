import React, { useState, useEffect } from 'react';
import { useUser } from "@clerk/clerk-react";
import '../Dashboard.css';

const QOTD_DATA = [
  // Perseverance & Consistency
  "Success is the sum of small efforts, repeated day in and day out. – Robert Collier",
  "Consistency is more important than perfection. – Unknown",
  "It's not about being the best. It's about being better than you were yesterday. – Unknown",
  "The secret of getting ahead is getting started. – Mark Twain",
  "Don't practice until you get it right. Practice until you can't get it wrong. – Unknown",
  "Amateurs practice until they get it right. Professionals practice until they can't get it wrong. – Unknown",
  "Small daily improvements are the key to staggering long-term results. – Unknown",
  "The only way to do great work is to love what you do. – Steve Jobs",
  "Patience and persistence are the keys to mastery. – Unknown",
  
  // Music & Emotion
  "Music is the shorthand of emotion. – Leo Tolstoy",
  "Life is like a piano. What you get out of it depends on how you play it. – Tom Lehrer",
  "Music gives a soul to the universe, wings to the mind, flight to the imagination. – Plato",
  "Where words fail, music speaks. – Hans Christian Andersen",
  "Music can change the world because it can change people. – Bono",
  "One good thing about music, when it hits you, you feel no pain. – Bob Marley",
  "Music is the universal language of mankind. – Henry Wadsworth Longfellow",
  "Without music, life would be a mistake. – Friedrich Nietzsche",
  
  // Growth & Learning
  "Frustration is the first sign that a breakthrough is coming. – Unknown",
  "Your future self will thank you for the practice you did today. – Unknown",
  "The joy of music is found in the journey, not just the destination. – Unknown",
  "Every expert was once a beginner. – Unknown",
  "Mistakes are proof that you are trying. – Unknown",
  "The beautiful thing about learning is that no one can take it away from you. – B.B. King",
  "You don't have to be great to start, but you have to start to be great. – Zig Ziglar",
  "Progress, not perfection. – Unknown",
  "The master has failed more times than the beginner has even tried. – Stephen McCranie",
  
  // Practice & Discipline
  "I know you're going to get better, but you have to keep working at it. – Wynton Marsalis",
  "Practice is the best of all instructors. – Publilius Syrus",
  "Repetition is the mother of skill. – Tony Robbins",
  "The more you sweat in practice, the less you bleed in battle. – Unknown",
  "Practice makes progress. – Unknown",
  "Excellence is not a destination; it is a continuous journey that never ends. – Brian Tracy",
  
  // Inspiration & Motivation
  "The only impossible journey is the one you never begin. – Tony Robbins",
  "Believe you can and you're halfway there. – Theodore Roosevelt",
  "Don't wait for inspiration. It comes while working. – Henri Matisse",
  "The expert in anything was once a beginner. – Helen Hayes",
  "You are never too old to set another goal or to dream a new dream. – C.S. Lewis",
  "Start where you are. Use what you have. Do what you can. – Arthur Ashe",
  "Music is the strongest form of magic. – Marilyn Manson",
  "Play it again, and again, and again. That's how you get good. – Unknown",
  
  // Specific to Musicians
  "To play a wrong note is insignificant; to play without passion is inexcusable. – Ludwig van Beethoven",
  "Music is like a dream. One that I cannot hear. – Ludwig van Beethoven",
  "The piano keys are black and white, but they sound like a million colors in your mind. – Maria Cristina Mena",
  "Life is a lot like jazz. It's best when you improvise. – George Gershwin",
  "Music washes away from the soul the dust of everyday life. – Bertolt Brecht",
  "There are no wrong notes on the piano, just better choices. – Thelonious Monk",
  "The guitar is a small orchestra. It is polyphonic. Every string is a different color, a different voice. – Andres Segovia",
  
  // Overcoming Challenges
  "It's not whether you get knocked down, it's whether you get up. – Vince Lombardi",
  "A champion is defined not by their wins but by how they can recover when they fall. – Serena Williams",
  "Difficult roads often lead to beautiful destinations. – Unknown",
  "The struggle you're in today is developing the strength you need for tomorrow. – Unknown",
  "When you feel like quitting, think about why you started. – Unknown",
  "Fall seven times, stand up eight. – Japanese Proverb",
  
  // Joy & Passion
  "Play with passion or not at all. – Unknown",
  "Music is what feelings sound like. – Unknown",
  "Life seems to go on without effort when I am filled with music. – George Eliot",
  "Music is my refuge. I could crawl into the space between the notes and curl my back to loneliness. – Maya Angelou",
  "Music is the art which is most nigh to tears and memories. – Oscar Wilde",
  "When words leave off, music begins. – Heinrich Heine"
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