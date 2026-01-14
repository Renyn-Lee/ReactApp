import React, { useState } from 'react';
import { Link } from 'react-router-dom';

function EarTrainer() {
  const [targetNote, setTargetNote] = useState(null);
  const [feedback, setFeedback] = useState("Click 'Play Random Note' to start!");
  const [status, setStatus] = useState("neutral");

  const noteFrequencies = {
    'C': 261.63, 'D': 293.66, 'E': 329.63, 'F': 349.23, 'G': 392.00, 'A': 440.00, 'B': 493.88,
  };

  const notes = Object.keys(noteFrequencies);

  const playSound = (freq) => {
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();

    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(freq, audioCtx.currentTime);
    gainNode.gain.setValueAtTime(0.5, audioCtx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 1);

    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    oscillator.start();
    oscillator.stop(audioCtx.currentTime + 1);
  };

  const generateNewNote = () => {
    const randomNote = notes[Math.floor(Math.random() * notes.length)];
    setTargetNote(randomNote);
    setFeedback("Listen closely...");
    setStatus("neutral");
    playSound(noteFrequencies[randomNote]);
  };

  const replayNote = () => {
    if (targetNote) {
      playSound(noteFrequencies[targetNote]);
      setFeedback("Listening to the question again...");
    }
  };

  const handleGuess = (guess) => {
    if (!targetNote) return;

    // FIX: Play the frequency of the note the user actually CLICKED
    playSound(noteFrequencies[guess]);

    if (guess === targetNote) {
      setFeedback(`🌟 Correct! That was ${targetNote}`);
      setStatus("success");
    } else {
      setFeedback(`❌ That was ${guess}. Try to find ${targetNote}!`);
      setStatus("error");
    }
  };

  return (
    <div style={{ maxWidth: '1000px', margin: '20px auto', padding: '20px' }}>
      
      <Link to="/musictools" className="back-tools-link">
        ← Back to Tools
      </Link>

      <div style={{ 
        textAlign: 'center', 
        padding: '40px', 
        border: '3px solid #0065D1', 
        borderRadius: '15px',
        backgroundColor: '#f8fbff' 
      }}>
        <h2 style={{ color: '#0065D1', fontSize: '2.2rem', marginBottom: '20px' }}>👂 Ear Trainer</h2>
        
        <div style={{ 
          padding: '20px', 
          margin: '20px 0', 
          borderRadius: '12px', 
          fontSize: '1.4rem', 
          fontWeight: '600',
          backgroundColor: status === "success" ? "#e1effe" : status === "error" ? "#fde8e8" : "#f3f4f6",
          color: status === "success" ? "#1e429f" : status === "error" ? "#9b1c1c" : "#374151",
          border: '1px solid #d1d5db'
        }}>
          {feedback}
        </div>

        <button 
          onClick={targetNote ? replayNote : generateNewNote} 
          style={{ 
            padding: '15px 30px', 
            fontSize: '1.3rem', 
            backgroundColor: '#0065D1', 
            color: 'white', 
            border: 'none', 
            borderRadius: '50px', 
            cursor: 'pointer', 
            fontWeight: 'bold', 
            marginBottom: '30px'
          }}
        >
          {targetNote ? "🔊 Replay Question" : "▶️ Play Random Note"}
        </button>

        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(7, 1fr)', 
          gap: '12px' 
        }}>
          {notes.map(n => (
            <button 
              key={n} 
              onClick={() => handleGuess(n)} 
              style={{ 
                padding: '18px 0', 
                fontSize: '1.5rem', 
                fontWeight: 'bold', 
                cursor: 'pointer',
                backgroundColor: 'white',
                border: '2px solid #0065D1',
                borderRadius: '8px',
                color: '#0065D1',
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = '#0065D1'; 
                e.target.style.color = 'white';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = 'white'; 
                e.target.style.color = '#0065D1';
              }}
            >
              {n}
            </button>
          ))}
        </div>

        {status === "success" && (
          <div style={{ marginTop: '20px' }}>
            <button 
              onClick={generateNewNote}
              style={{
                padding: '12px 24px',
                backgroundColor: '#4CAF50',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontWeight: 'bold',
                fontSize: '1.1rem',
                cursor: 'pointer'
              }}
            >
              Next Note →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default EarTrainer;