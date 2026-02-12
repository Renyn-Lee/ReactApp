import React, { useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';


function VirtualPiano() {
  // Sound Engine
  const playNote = useCallback((freq) => {
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();

    oscillator.type = 'triangle'; // Smoother than sine, sounds more like a toy piano
    oscillator.frequency.setValueAtTime(freq, audioCtx.currentTime);
    
    gainNode.gain.setValueAtTime(0.3, audioCtx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 1);

    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    oscillator.start();
    oscillator.stop(audioCtx.currentTime + 1);
  }, []);

  const notes = [
    { name: 'C', freq: 261.63, key: 'a', type: 'white' },
    { name: 'C#', freq: 277.18, key: 'w', type: 'black' },
    { name: 'D', freq: 293.66, key: 's', type: 'white' },
    { name: 'D#', freq: 311.13, key: 'e', type: 'black' },
    { name: 'E', freq: 329.63, key: 'd', type: 'white' },
    { name: 'F', freq: 349.23, key: 'f', type: 'white' },
    { name: 'F#', freq: 369.99, key: 't', type: 'black' },
    { name: 'G', freq: 392.00, key: 'g', type: 'white' },
    { name: 'G#', freq: 415.30, key: 'y', type: 'black' },
    { name: 'A', freq: 440.00, key: 'h', type: 'white' },
    { name: 'A#', freq: 466.16, key: 'u', type: 'black' },
    { name: 'B', freq: 493.88, key: 'j', type: 'white' },
    { name: 'C5', freq: 523.25, key: 'k', type: 'white' },
  ];

  // Handle physical keyboard presses
  useEffect(() => {
    const handleKeyDown = (e) => {
      const note = notes.find(n => n.key === e.key.toLowerCase());
      if (note) playNote(note.freq);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [playNote, notes]);

  return (
    <div style={{ maxWidth: '1000px', margin: '20px auto', padding: '20px' }}>
      <div style={{ 
        textAlign: 'center', 
        padding: '40px', 
        border: '3px solid #0065D1', 
        borderRadius: '15px',
        backgroundColor: '#f8fbff' 
      }}>
        <h2 style={{ color: '#0065D1', fontSize: '2.2rem', marginBottom: '10px' }}>🎹 Virtual Piano</h2>
        <p style={{ color: '#666', marginBottom: '30px' }}>Use your mouse or keys (A-W-S-E-F-T-G-Y-H-U-J-K)</p>

        <div style={{ 
          position: 'relative', 
          display: 'inline-flex', 
          height: '250px', 
          paddingBottom: '20px',
          userSelect: 'none'
        }}>
          {notes.map((note, index) => {
            const isBlack = note.type === 'black';
            // Logic to position black keys absolutely over white keys
            const leftPosition = note.name === 'C#' ? 45 : 
                                 note.name === 'D#' ? 115 : 
                                 note.name === 'F#' ? 255 : 
                                 note.name === 'G#' ? 325 : 
                                 note.name === 'A#' ? 395 : 0;

            return (
              <div
                key={note.name}
                onClick={() => playNote(note.freq)}
                style={{
                  width: isBlack ? '40px' : '70px',
                  height: isBlack ? '150px' : '250px',
                  backgroundColor: isBlack ? '#333' : 'white',
                  border: '1px solid #0065D1',
                  borderRadius: '0 0 5px 5px',
                  cursor: 'pointer',
                  zIndex: isBlack ? 2 : 1,
                  position: isBlack ? 'absolute' : 'relative',
                  left: isBlack ? `${leftPosition}px` : 'auto',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'flex-end',
                  alignItems: 'center',
                  paddingBottom: '10px',
                  color: isBlack ? 'white' : '#333',
                  fontSize: '0.8rem',
                  fontWeight: 'bold',
                  boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                  transition: 'background-color 0.1s'
                }}
                onMouseDown={(e) => e.currentTarget.style.backgroundColor = '#0065D1'}
                onMouseUp={(e) => e.currentTarget.style.backgroundColor = isBlack ? '#333' : 'white'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = isBlack ? '#333' : 'white'}
              >
                {note.name}
                <div style={{ opacity: 0.5, fontSize: '0.6rem' }}>[{note.key.toUpperCase()}]</div>
              </div>
            );
          })}
        </div>
      </div>
           <div>
              <Link to="/musictools" className="back-tools-link" style={{ 
          marginLeft: '25rem',}}>
                ← Back to Tools
              </Link>
            </div>
    </div>
  );
}

export default VirtualPiano;