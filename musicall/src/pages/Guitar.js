import './Guitar.css';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser, SignUpButton, SignedOut } from "@clerk/clerk-react";

function Guitar() {
  const navigate = useNavigate();
  const { user } = useUser();

  useEffect(() => {
    document.body.style.backgroundColor = '#D09691';
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
    navigate(`/guitar-lesson/${lessonNumber}`);
  };

  return ( 
    <div className="guitar-container">
      <h1 className='guitar-lesson-roadmap'>Guitar Lesson Roadmap</h1>
      <h2 className='guitar-description'>Self paced lessons with interactive practice tools and an AI tutor</h2>
      
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
            <p>Rhythm & Tablature</p>
          </div>
          <div className="arrow-right"></div>
          <div className={`lesson-box ${!user ? 'locked' : ''}`} onClick={() => handleLessonClick(3)}>
            <h3>Lesson 3</h3>
            <p>The First Chords</p>
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
            <p>Reading Chord Diagrams</p>
            {!user && <span className="lock-icon">🔒</span>}
          </div>
          <div className="arrow-left"></div>
          <div className={`lesson-box ${!user ? 'locked' : ''}`} onClick={() => handleLessonClick(4)}>
            <h3>Lesson 4</h3>
            <p>Your First Chord</p>
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
            <p>More Basic Chords</p>
            {!user && <span className="lock-icon">🔒</span>}
          </div>
          <div className="arrow-right"></div>
          <div className={`lesson-box ${!user ? 'locked' : ''}`} onClick={() => handleLessonClick(7)}>
            <h3>Lesson 7</h3>
            <p>Strumming Patterns</p>
            {!user && <span className="lock-icon">🔒</span>}
          </div>
          <div className="arrow-right"></div>
          <div className={`lesson-box ${!user ? 'locked' : ''}`} onClick={() => handleLessonClick(8)}>
            <h3>Lesson 8</h3>
            <p>Alternate Strumming</p>
            {!user && <span className="lock-icon">🔒</span>}
          </div>
        </div>

        {/* TURN 3: Down from Right side */}
        <div className="vertical-arrow-container right">
          <div className="arrow-down"></div>
        </div>

        {/* === ROW 4 (Right to Left): Lessons 11-9 === */}
        <div className="lesson-row-bottom">
          <div className={`lesson-box ${!user ? 'locked' : ''}`} onClick={() => handleLessonClick(11)}>
            <h3>Lesson 11</h3>
            <p>Barre Chords Basics</p>
            {!user && <span className="lock-icon">🔒</span>}
          </div>
          <div className="arrow-left"></div>
          <div className={`lesson-box ${!user ? 'locked' : ''}`} onClick={() => handleLessonClick(10)}>
            <h3>Lesson 10</h3>
            <p>Playing Simple Melodies</p>
            {!user && <span className="lock-icon">🔒</span>}
          </div>
          <div className="arrow-left"></div>
          <div className={`lesson-box ${!user ? 'locked' : ''}`} onClick={() => handleLessonClick(9)}>
            <h3>Lesson 9</h3>
            <p>Introduction to Tabs</p>
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
            <p>F Major Chord</p>
            {!user && <span className="lock-icon">🔒</span>}
          </div>
          <div className="arrow-right"></div>
          <div className={`lesson-box ${!user ? 'locked' : ''}`} onClick={() => handleLessonClick(13)}>
            <h3>Lesson 13</h3>
            <p>Power Chords</p>
            {!user && <span className="lock-icon">🔒</span>}
          </div>
          <div className="arrow-right"></div>
          <div className={`lesson-box ${!user ? 'locked' : ''}`} onClick={() => handleLessonClick(14)}>
            <h3>Lesson 14</h3>
            <p>Fingerpicking Basics</p>
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
            <p>Minor Scales</p>
            {!user && <span className="lock-icon">🔒</span>}
          </div>
          <div className="arrow-left"></div>
          <div className={`lesson-box ${!user ? 'locked' : ''}`} onClick={() => handleLessonClick(16)}>
            <h3>Lesson 16</h3>
            <p>Playing Along with Songs</p>
            {!user && <span className="lock-icon">🔒</span>}
          </div>
          <div className="arrow-left"></div>
          <div className={`lesson-box ${!user ? 'locked' : ''}`} onClick={() => handleLessonClick(15)}>
            <h3>Lesson 15</h3>
            <p>Tuning Your Guitar</p>
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
            <p>Playing Lead Guitar</p>
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

export default Guitar;