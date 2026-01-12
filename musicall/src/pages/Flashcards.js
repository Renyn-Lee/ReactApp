import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Flashcards.css';

function Flashcards() {
  const [currentCard, setCurrentCard] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  useEffect(() => {
    document.body.style.backgroundColor = '#f5f5f5';
    return () => { document.body.style.backgroundColor = ''; };
  }, []);

 const flashcards = [
  // 1. DYNAMICS (Volume)
  { question: 'What does "p" (Piano) stand for?', answer: 'Play softly' },
  { question: 'What does "f" (Forte) stand for?', answer: 'Play loudly' },
  { question: 'What does a "<" (Crescendo) mean?', answer: 'Gradually get louder' },
  { question: 'What does a ">" (Decrescendo) mean?', answer: 'Gradually get softer' },

  // 2. THE STAFF & NOTES
  { question: 'Which clef is used for higher notes (usually right hand)?', answer: 'Treble Clef' },
  { question: 'Which clef is used for lower notes (usually left hand)?', answer: 'Bass Clef' },
  {question: 'What is the order of SHARPS (#)?', 
    answer: 'F - C - G - D - A - E - B (Mnemonic: Fat Cats Go Down Alleys Eating Bugs)' },
  { question: 'What is the order of FLATS (b)?', answer: 'B - E - A - D - G - C - F (Mnemonic: BEAD - Greatest Common Factor)' },

  
  { question: 'What are the Treble Clef LINE notes (bottom to top)?', answer: 'E - G - B - D - F (Every Good Boy Does Fine)' },
  { question: 'What is the note called that sits on its own little line below the Treble Clef?', answer: 'Middle C' },
  

  // 3. RHYTHM (Timing)
  { question: 'How many beats does a Quarter Note get?', answer: '1 beat' },
  { question: 'How many beats does a Half Note get?', answer: '2 beats' },
  { question: 'How many beats does a Whole Note get?', answer: '4 beats' },
  
  { question: 'What does a "Rest" represent in music?', answer: 'A period of silence' },
  ];

  const handleNext = () => {
    setIsFlipped(false); // Reset to question side
    setTimeout(() => {
      setCurrentCard((prev) => (prev + 1) % flashcards.length);
    }, 150); // Small delay to let the reset begin
  };

  const handlePrevious = () => {
    setIsFlipped(false); // Reset to question side
    setTimeout(() => {
      setCurrentCard((prev) => (prev - 1 + flashcards.length) % flashcards.length);
    }, 150);
  };

  return (
    <div className="flashcards-page-container">
      <h1 className="flashcards-header">Music Flashcards</h1>
      <p className="card-counter">
        Card {currentCard + 1} of {flashcards.length}
      </p>

      {/* FLASHCARD SCENE */}
      <div className="flashcard-scene" onClick={() => setIsFlipped(!isFlipped)}>
        <div className={`flashcard-inner ${isFlipped ? 'is-flipped' : ''}`}>
          
          {/* FRONT SIDE (Question) */}
          <div className="card-face card-face-front">
            <h2 className="card-label">Question</h2>
            <p className="card-text">{flashcards[currentCard].question}</p>
            <span className="tap-hint">Click to flip</span>
          </div>

          {/* BACK SIDE (Answer) */}
          <div className="card-face card-face-back">
            <h2 className="card-label">Answer</h2>
            <p className="card-text">{flashcards[currentCard].answer}</p>
            <span className="tap-hint">Click to see question</span>
          </div>

        </div>
      </div>

      <div className="controls-container">
        <button className="nav-button" onClick={(e) => { e.stopPropagation(); handlePrevious(); }}>
          ← Previous
        </button>
        <button className="nav-button" onClick={(e) => { e.stopPropagation(); handleNext(); }}>
          Next →
        </button>
      </div>
        <Link to="/musictools" className="back-tools-link">
        ← Back to Tools
      </Link>
    </div>
  );
}

export default Flashcards;