import './Piano.css';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser, SignUpButton, SignedOut } from "@clerk/clerk-react";

function Piano() {
  const navigate = useNavigate();
  const { user } = useUser();

  useEffect(() => {
    document.body.style.backgroundColor = '#E5D8CE';
    return () => {
      document.body.style.backgroundColor = '';
    };
  }, []);

  const handleLessonClick = (lessonNumber) => {
    // Check lock status
    if (!user && lessonNumber !== 1 && lessonNumber !== 2) {
      alert('Please sign in to access this lesson!');
      return;
    }
    navigate(`/lesson/${lessonNumber}`);
  };

  return ( 
    <div className="piano-container">
      <h1 className='piano-lesson-roadmap'>Piano Lesson Roadmap</h1>
      <h2 className='piano-description'>Self paced lessons with interactive practice tools and an AI tutor</h2>
      
      <div className="auth-section">
        <SignedOut>
          <SignUpButton mode="modal">
            <button className='access-button'>Log in for full access</button>
          </SignUpButton>
        </SignedOut>
      </div>

      <div className="roadmap-container">
        
        {/* === ROW 1 (Left to Right) === */}
        <div className="lesson-row-top">
          <div className="lesson-box" onClick={() => handleLessonClick(1)}>
            <h3>Lesson 1</h3>
            <p>Getting Started</p>
          </div>
          <div className="arrow-right"></div>
          <div className="lesson-box" onClick={() => handleLessonClick(2)}>
            <h3>Lesson 2</h3>
            <p>Posture & Hands</p>
          </div>
          <div className="arrow-right"></div>
          <div className={`lesson-box ${!user ? 'locked' : ''}`} onClick={() => handleLessonClick(3)}>
            <h3>Lesson 3</h3>
            <p>Notes and Fingure Numbering</p>
            {!user && <span className="lock-icon">🔒</span>}
          </div>
        </div>

        {/* TURN 1: Down from Right side */}
        <div className="vertical-arrow-container right">
          <div className="arrow-down"></div>
        </div>

        {/* === ROW 2 (Right to Left) === */}
        <div className="lesson-row-bottom">
          {/* Note: In flex-row, visual order is Left->Right. 
              To make logic flow Right->Left, we place higher lessons first in code if we want specific DOM order, 
              OR we just arrange them visually. 
              Here: Test 1 (Left) <--- L5 (Mid) <--- L4 (Right) 
          */}
          <div className={`lesson-box optional ${!user ? 'locked' : ''}`} onClick={() => handleLessonClick('test1')}>
            <h3>Checkpoint</h3>
            <p>Basic Skills Test</p>
            {!user && <span className="lock-icon">🔒</span>}
          </div>
          <div className="arrow-left"></div>
          <div className={`lesson-box ${!user ? 'locked' : ''}`} onClick={() => handleLessonClick(5)}>
            <h3>Lesson 5</h3>
            <p>Rhythm & Timing</p>
            {!user && <span className="lock-icon">🔒</span>}
          </div>
          <div className="arrow-left"></div>
          <div className={`lesson-box ${!user ? 'locked' : ''}`} onClick={() => handleLessonClick(4)}>
            <h3>Lesson 4</h3>
            <p>The Black Keys</p>
            {!user && <span className="lock-icon">🔒</span>}
          </div>
        </div>

        {/* TURN 2: Down from Left side (Connecting Test 1 to Lesson 6) */}
        <div className="vertical-arrow-container left">
          <div className="arrow-down"></div>
        </div>

        {/* === ROW 3 (Left to Right) === */}
        <div className="lesson-row-top">
          <div className={`lesson-box ${!user ? 'locked' : ''}`} onClick={() => handleLessonClick(6)}>
            <h3>Lesson 6</h3>
            <p>Intro to Sheet Music</p>
            {!user && <span className="lock-icon">🔒</span>}
          </div>
          <div className="arrow-right"></div>
          <div className={`lesson-box ${!user ? 'locked' : ''}`} onClick={() => handleLessonClick(7)}>
            <h3>Lesson 7</h3>
            <p>Treble Clef Basics</p>
            {!user && <span className="lock-icon">🔒</span>}
          </div>
          <div className="arrow-right"></div>
          <div className={`lesson-box ${!user ? 'locked' : ''}`} onClick={() => handleLessonClick(8)}>
            <h3>Lesson 8</h3>
            <p>Bass Clef Basics</p>
            {!user && <span className="lock-icon">🔒</span>}
          </div>
        </div>

        {/* TURN 3: Down from Right side */}
        <div className="vertical-arrow-container right">
          <div className="arrow-down"></div>
        </div>

        {/* === ROW 4 (Right to Left) === */}
        <div className="lesson-row-bottom">
          <div className={`lesson-box optional ${!user ? 'locked' : ''}`} onClick={() => handleLessonClick('test2')}>
            <h3>Final Check</h3>
            <p>Music Reading Test</p>
            {!user && <span className="lock-icon">🔒</span>}
          </div>
          <div className="arrow-left"></div>
          <div className={`lesson-box ${!user ? 'locked' : ''}`} onClick={() => handleLessonClick(10)}>
            <h3>Lesson 10</h3>
            <p>Playing with Both Hands</p>
            {!user && <span className="lock-icon">🔒</span>}
          </div>
          <div className="arrow-left"></div>
          <div className={`lesson-box ${!user ? 'locked' : ''}`} onClick={() => handleLessonClick(9)}>
            <h3>Lesson 9</h3>
            <p>Intervals & Chords</p>
            {!user && <span className="lock-icon">🔒</span>}
          </div>
        </div>

      </div>
    </div>
  );
}

export default Piano;