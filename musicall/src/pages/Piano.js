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
    // Check lock status - only lessons 1 and 2 are free
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
        
        {/* === ROW 1 (Left to Right): Lessons 1-3 === */}
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
            <p>Notes and Finger Numbering</p>
            {!user && <span className="lock-icon">🔒</span>}
          </div>
        </div>

        {/* TURN 1: Down from Right side */}
        <div className="vertical-arrow-container right">
          <div className="arrow-down"></div>
        </div>

        {/* === ROW 2 (Right to Left): Test 1, Lessons 5-4 === */}
        <div className="lesson-row-bottom">
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
            <p>Recap and Practice</p>
            {!user && <span className="lock-icon">🔒</span>}
          </div>
        </div>

        {/* TURN 2: Down from Left side */}
        <div className="vertical-arrow-container left">
          <div className="arrow-down"></div>
        </div>

        {/* === ROW 3 (Left to Right): Lessons 6-8 === */}
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

        {/* === ROW 4 (Right to Left): Lessons 10-9 === */}
        <div className="lesson-row-bottom">
          <div className={`lesson-box ${!user ? 'locked' : ''}`} onClick={() => handleLessonClick(11)}>
            <h3>Lesson 11</h3>
            <p>Introduction to Chords</p>
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

        {/* TURN 4: Down from Left side */}
        <div className="vertical-arrow-container left">
          <div className="arrow-down"></div>
        </div>

        {/* === ROW 5 (Left to Right): Lessons 12-14 === */}
        <div className="lesson-row-top">
          <div className={`lesson-box ${!user ? 'locked' : ''}`} onClick={() => handleLessonClick(12)}>
            <h3>Lesson 12</h3>
            <p>Major Chords</p>
            {!user && <span className="lock-icon">🔒</span>}
          </div>
          <div className="arrow-right"></div>
          <div className={`lesson-box ${!user ? 'locked' : ''}`} onClick={() => handleLessonClick(13)}>
            <h3>Lesson 13</h3>
            <p>Minor Chords</p>
            {!user && <span className="lock-icon">🔒</span>}
          </div>
          <div className="arrow-right"></div>
          <div className={`lesson-box ${!user ? 'locked' : ''}`} onClick={() => handleLessonClick(14)}>
            <h3>Lesson 14</h3>
            <p>Dynamics & Expression</p>
            {!user && <span className="lock-icon">🔒</span>}
          </div>
        </div>

        {/* TURN 5: Down from Right side */}
        <div className="vertical-arrow-container right">
          <div className="arrow-down"></div>
        </div>

        {/* === ROW 6 (Right to Left): Lessons 17-15 === */}
        <div className="lesson-row-bottom">
          <div className={`lesson-box ${!user ? 'locked' : ''}`} onClick={() => handleLessonClick(17)}>
            <h3>Lesson 17</h3>
            <p>Arpeggios</p>
            {!user && <span className="lock-icon">🔒</span>}
          </div>
          <div className="arrow-left"></div>
          <div className={`lesson-box ${!user ? 'locked' : ''}`} onClick={() => handleLessonClick(16)}>
            <h3>Lesson 16</h3>
            <p>Playing with Both Hands</p>
            {!user && <span className="lock-icon">🔒</span>}
          </div>
          <div className="arrow-left"></div>
          <div className={`lesson-box ${!user ? 'locked' : ''}`} onClick={() => handleLessonClick(15)}>
            <h3>Lesson 15</h3>
            <p>The Pedals</p>
            {!user && <span className="lock-icon">🔒</span>}
          </div>
        </div>

        {/* TURN 6: Down from Left side */}
        <div className="vertical-arrow-container left">
          <div className="arrow-down"></div>
        </div>

        {/* === ROW 7 (Left to Right): Lessons 18-20 === */}
        <div className="lesson-row-top">
          <div className={`lesson-box ${!user ? 'locked' : ''}`} onClick={() => handleLessonClick(18)}>
            <h3>Lesson 18</h3>
            <p>Chord Progressions</p>
            {!user && <span className="lock-icon">🔒</span>}
          </div>
          <div className="arrow-right"></div>
          <div className={`lesson-box ${!user ? 'locked' : ''}`} onClick={() => handleLessonClick(19)}>
            <h3>Lesson 19</h3>
            <p>Playing by Ear</p>
            {!user && <span className="lock-icon">🔒</span>}
          </div>
          <div className="arrow-right"></div>
          <div className={`lesson-box ${!user ? 'locked' : ''}`} onClick={() => handleLessonClick(20)}>
            <h3>Lesson 20</h3>
            <p>Practice Strategies</p>
            {!user && <span className="lock-icon">🔒</span>}
          </div>
        </div>

      </div>
    </div>
  );
}

export default Piano;