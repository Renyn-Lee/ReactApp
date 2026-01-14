import React, { useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';

function VirtualPiano() {
  const playNote = useCallback((freq) => {
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();

    oscillator.type = 'triangle'; 
    oscillator.frequency.setValueAtTime(freq, audioCtx.currentTime);
    
    gainNode.gain.setValueAtTime(0.2, audioCtx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 1.5);

    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    oscillator.start();
    oscillator.stop(audioCtx.currentTime + 1.5);
  }, []);

  // Data for 2 Full Octaves (C4 to C6)
  const notes = [
    // Octave 4
    { name: 'C4', freq: 261.63, key: 'a', type: 'white' },
    { name: 'C#4', freq: 277.18, key: 'w', type: 'black' },
    { name: 'D4', freq: 293.66, key: 's', type: 'white' },
    { name: 'D#4', freq: 311.13, key: 'e', type: 'black' },
    { name: 'E4', freq: 329.63, key: 'd', type: 'white' },
    { name: 'F4', freq: 349.23, key: 'f', type: 'white' },
    { name: 'F#4', freq: 369.99, key: 't', type: 'black' },
    { name: 'G4', freq: 392.00, key: 'g', type: 'white' },
    { name: 'G#4', freq: 415.30, key: 'y', type: 'black' },
    { name: 'A4', freq: 440.00, key: 'h', type: 'white' },
    { name: 'A#4', freq: 466.16, key: 'u', type: 'black' },
    { name: 'B4', freq: 493.88, key: 'j', type: 'white' },
    // Octave 5
    { name: 'C5', freq: 523.25, key: 'k', type: 'white' },
    { name: 'C#5', freq: 554.37, key: 'o', type: 'black' },
    { name: 'D5', freq: 587.33, key: 'l', type: 'white' },
    { name: 'D#5', freq: 622.25, key: 'p', type: 'black' },
    { name: 'E5', freq: 659.25, key: ';', type: 'white' },
    { name: 'F5', freq: 698.46, key: 'z', type: 'white' },
    { name: 'F#5', freq: 739.99, key: 'x', type: 'black' },
    { name: 'G5', freq: 783.99, key: 'c', type: 'white' },
    { name: 'G#5', freq: 830.61, key: 'v', type: 'black' },
    { name: 'A5', freq: 880.00, key: 'b', type: 'white' },
    { name: 'A#5', freq: 932.33, key: 'n', type: 'black' },
    { name: 'B5', freq: 987.77, key: 'm', type: 'white' },
    { name: 'C6', freq: 1046.50, key: ',', type: 'white' },
  ];

  useEffect(() => {
    const handleKeyDown = (e) => {
      const note = notes.find(n => n.key === e.key.toLowerCase());
      if (note) playNote(note.freq);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [playNote, notes]);

  // Positioning constants
  const whiteKeyWidth = 55;
  const blackKeyWidth = 34;

  return (
    <div style={{ maxWidth: '1100px', margin: '20px auto', padding: '20px' }}>
      <Link to="/musictools" className="back-tools-link">
        ← Back to Tools
      </Link>

      <div style={{ 
        textAlign: 'center', 
        padding: '40px 20px', 
        border: '3px solid #0065D1', 
        borderRadius: '15px',
        backgroundColor: '#f8fbff',
        overflowX: 'auto' // Allows scrolling on smaller screens
      }}>
        <h2 style={{ color: '#0065D1', fontSize: '2.2rem', marginBottom: '5px' }}>🎹 2-Octave Piano</h2>
        <p style={{ color: '#666', marginBottom: '30px' }}>Octave 1: [A-J] | Octave 2: [K-,] | Sharps: [W-P, X-N]</p>

        <div style={{ 
          position: 'relative', 
          display: 'inline-flex', 
          height: '220px', 
          userSelect: 'none',
          backgroundColor: '#333', // Keyboard bed
          padding: '5px',
          borderRadius: '5px'
        }}>
          {/* Render White Keys First */}
          {notes.filter(n => n.type === 'white').map((note, index) => (
            <div
              key={note.name}
              onClick={() => playNote(note.freq)}
              style={{
                width: `${whiteKeyWidth}px`,
                height: '200px',
                backgroundColor: 'white',
                border: '1px solid #ccc',
                borderRadius: '0 0 5px 5px',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-end',
                alignItems: 'center',
                paddingBottom: '10px',
                fontSize: '0.7rem',
                fontWeight: 'bold',
                color: '#888'
              }}
              onMouseDown={(e) => e.currentTarget.style.backgroundColor = '#e1effe'}
              onMouseUp={(e) => e.currentTarget.style.backgroundColor = 'white'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'white'}
            >
              {note.name}
            </div>
          ))}

          {/* Render Black Keys Absolutely Positioned */}
          {notes.filter(n => n.type === 'black').map((note) => {
            // Find which white key this black key follows to calculate 'left'
            const whiteKeys = notes.filter(n => n.type === 'white');
            const parentWhiteIndex = whiteKeys.findIndex(w => w.name[0] === note.name[0]);
            const leftPos = (parentWhiteIndex + 1) * whiteKeyWidth - (blackKeyWidth / 2) + 5;

            return (
              <div
                key={note.name}
                onClick={() => playNote(note.freq)}
                style={{
                  position: 'absolute',
                  left: `${leftPos}px`,
                  width: `${blackKeyWidth}px`,
                  height: '120px',
                  backgroundColor: '#000',
                  borderRadius: '0 0 3px 3px',
                  cursor: 'pointer',
                  zIndex: 2,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'flex-end',
                  alignItems: 'center',
                  paddingBottom: '8px',
                  color: 'white',
                  fontSize: '0.6rem'
                }}
                onMouseDown={(e) => e.currentTarget.style.backgroundColor = '#0065D1'}
                onMouseUp={(e) => e.currentTarget.style.backgroundColor = '#000'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#000'}
              >
                {note.key.toUpperCase()}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default VirtualPiano;