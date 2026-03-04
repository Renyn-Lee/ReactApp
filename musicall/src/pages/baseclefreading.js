import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './clefreading.css';

function BassSightReading() {
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
      'C': 112.5,  // Space 2 (between line 2 and 3)
      'D': 100,    // Line 3 (middle line)
      'E': 87.5,   // Space 3 (between line 3 and 4)
      'F': 75,     // Line 4 - The F Line
      'G': 62.5,   // Space 4 (between line 4 and 5)
      'A': 50,     // Line 5 - Top Line
      'B': 37.5,   // Above staff
    };
    return positions[note];
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '40px 20px', fontFamily: 'sans-serif' }}>
      <h1 style={{ textAlign: 'center', color: '#0065D1' }}>🎵 Bass Clef Sight Reading</h1>
      
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
            <line key={i} x1="50" y1={50 + i * 25} x2="350" y2={50 + i * 25} stroke="black" strokeWidth="2" />
          ))}

          {/* Bass Clef - Using web font fallback */}
          <text 
            x="60" 
            y="120" 
            fontSize="70" 
            fill="#0065D1"
            fontFamily="'Bravura', 'Gonville', 'Arial Unicode MS', serif"
            style={{ userSelect: 'none' }}
          >
            &#119074;
          </text>

          {/* The Note */}
          {currentNote && (
            <ellipse
              cx="200"
              cy={getStaffPosition(currentNote.note)}
              rx="9"
              ry="7"
              fill="#333"
              transform={`rotate(-20 200 ${getStaffPosition(currentNote.note)})`}
            />
          )}
        </svg>

        {showAnswer && (
          <div style={{ textAlign: 'center', color: '#0065D1', fontWeight: 'bold', fontSize: '1.5rem' }}>
            It's a {currentNote?.display}!
          </div>
        )}
      </div>

      {/* Feedback Bar */}
      <div style={{ height: '50px', textAlign: 'center', marginBottom: '20px' }}>
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

      {/* Buttons */}
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

      <div style={{ marginTop: '30px', display: 'flex', justifyContent: 'center', gap: '10px' }}>
        <button onClick={() => setShowAnswer(!showAnswer)} style={btnStyle('#9C27B0')}>Show Answer</button>
        <button onClick={generateNewNote} style={btnStyle('#4CAF50')}>Skip</button>
      </div>
        <Link to="/musictools" className="back-tools-link">
        ← Back to Tools
      </Link>
    </div>
  );
}

const btnStyle = (color) => ({
  padding: '10px 20px',
  backgroundColor: color,
  color: 'white',
  border: 'none',
  borderRadius: '5px',
  cursor: 'pointer',
  fontWeight: 'bold'
});

export default BassSightReading;