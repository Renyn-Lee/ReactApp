import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './clefreading.css';

function TrebleSightReading() {
  const notes = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
  
  const allNotes = notes.map(note => ({ 
    note, 
    display: note 
  }));

  const [currentNote, setCurrentNote] = useState(null);
  const [score, setScore] = useState(0);
  const [totalAttempts, setTotalAttempts] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [showAnswer, setShowAnswer] = useState(false);

  useEffect(() => {
    generateNewNote();
  }, []);

  const generateNewNote = () => {
    const randomNote = allNotes[Math.floor(Math.random() * allNotes.length)];
    setCurrentNote(randomNote);
    setFeedback('');
    setShowAnswer(false);
  };

  const checkAnswer = (selectedNote) => {
    if (feedback !== '') return;

    setTotalAttempts(prev => prev + 1);
    
    if (selectedNote === currentNote.display) {
      setScore(prev => prev + 1);
      setFeedback('✓ Correct!');
      setTimeout(() => generateNewNote(), 1000);
    } else {
      setFeedback(`✗ Wrong! That was ${currentNote.display}`);
      setTimeout(() => generateNewNote(), 2000);
    }
  };

  const getStaffPosition = (note) => {
    const positions = {
      'C': 90,   // Space 3 (C5)
      'D': 80,   // Line 4 (D5)
      'E': 70,   // Space 4 (E5)
      'F': 60,   // Line 5 (F5)
      'G': 50,   // Above staff
      'A': 110,  // Space 2 (A4)
      'B': 100,  // Line 3 (B4)
    };
    return positions[note];
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '40px 20px', fontFamily: 'sans-serif' }}>
      <h1 style={{ textAlign: 'center', color: '#0065D1' }}>🎼 Treble Clef Sight Reading</h1>
      
      <div style={{ textAlign: 'center', marginBottom: '20px', fontSize: '1.2rem' }}>
        <strong>Score: {score} / {totalAttempts}</strong>
      </div>

      <div style={{ 
        backgroundColor: 'white', 
        border: '2px solid #0065D1', 
        borderRadius: '12px', 
        padding: '40px', 
        position: 'relative',
        marginBottom: '20px'
      }}>
        <svg width="100%" height="200" viewBox="0 0 400 200">
          {/* Draw the 5 Staff Lines */}
          {[0, 1, 2, 3, 4].map(i => (
            <line key={i} x1="50" y1={60 + i * 20} x2="350" y2={60 + i * 20} stroke="black" strokeWidth="2" />
          ))}

          {/* Treble Clef - Using web font fallback */}
          <text 
            x="60" 
            y="135" 
            fontSize="90" 
            fill="#0065D1" 
            fontFamily="'Bravura', 'Gonville', 'Arial Unicode MS', serif"
            style={{ userSelect: 'none' }}
          >
            &#119070;
          </text>

          {/* The Note Head */}
          {currentNote && (
            <ellipse
              cx="200"
              cy={getStaffPosition(currentNote.note)}
              rx="10"
              ry="8"
              fill="#333"
              transform={`rotate(-20 200 ${getStaffPosition(currentNote.note)})`}
            />
          )}
        </svg>

        {showAnswer && (
          <div style={{ textAlign: 'center', color: '#0065D1', fontWeight: 'bold', fontSize: '1.5rem' }}>
            Answer: {currentNote?.display}
          </div>
        )}
      </div>

      {/* Feedback Bar */}
      <div style={{ height: '60px', textAlign: 'center', marginBottom: '20px' }}>
        {feedback && (
          <div style={{ 
            display: 'inline-block', 
            padding: '10px 30px', 
            borderRadius: '20px', 
            color: 'white', 
            fontWeight: 'bold',
            backgroundColor: feedback.includes('✓') ? '#4CAF50' : '#f44336' 
          }}>
            {feedback}
          </div>
        )}
      </div>

      {/* Note Buttons */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '10px' }}>
        {notes.map(note => (
          <button
            key={note}
            onClick={() => checkAnswer(note)}
            style={{
              padding: '15px 0',
              fontSize: '1.2rem',
              fontWeight: 'bold',
              backgroundColor: '#0065D1',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer'
            }}
          >
            {note}
          </button>
        ))}
      </div>

      <div style={{ marginTop: '30px', display: 'flex', justifyContent: 'center', gap: '15px' }}>
        <button onClick={() => setShowAnswer(!showAnswer)} style={btnStyle('#9C27B0')}>Show Answer</button>
        <button onClick={generateNewNote} style={btnStyle('#4CAF50')}>Skip</button>
      </div>

      <div>
        <Link to="/musictools" className="back-tools-link">
          ← Back to Tools
        </Link>
      </div>
    </div>
  );
}

const btnStyle = (color) => ({
  padding: '12px 24px',
  backgroundColor: color,
  color: 'white',
  border: 'none',
  borderRadius: '8px',
  cursor: 'pointer',
  fontWeight: 'bold'
});

export default TrebleSightReading;