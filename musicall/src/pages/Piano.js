import './Piano.css';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser, SignUpButton } from "@clerk/clerk-react";

// ACCEPT THE NEW PROP: isAppLoading
function Piano({ isAppLoading = false }) {
  // useUser is called here, but its output is ignored if isAppLoading is true
  const navigate = useNavigate();
  const { user, isLoaded } = useUser();
  
  const [completedLessons, setCompletedLessons] = useState([]); 

  // background color
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

  // LOAD PROGRESS FROM CLERK METADATA
  useEffect(() => {
    // Only proceed if user data is loaded AND the app isn't explicitly in skeleton mode
    if (isAppLoading || !isLoaded) return; 

    if (!user) {
        setCompletedLessons([]);
        return;
    }

    const progress = user.unsafeMetadata?.pianoProgress; 
    if (Array.isArray(progress)) {
      setCompletedLessons(progress);
    } else {
      setCompletedLessons([]);
    }
  }, [user, isLoaded, isAppLoading]); 

  const isCompleted = (lessonId) => {
    return completedLessons.includes(String(lessonId));
  };
  
  // --- SKELETON RENDER LOGIC ---
  // Render skeleton if the parent (App.jsx) told us to, OR if Clerk isn't ready.
  if (isAppLoading || !isLoaded) {
      // 🚨 SKELETON SCREEN IS RENDERED HERE 🚨
      return (
        <div className="piano-container skeleton-container">
          <h1 className='piano-lesson-roadmap'>Piano Lesson Roadmap</h1>
          <h2 className='piano-description'>Self paced lessons with interactive practice tools and an AI tutor</h2>
          
          <div className="roadmap-container">
            {/* RENDER SKELETON ROWS TO MIMIC THE LAYOUT */}
            {/* Row 1 (L to R) */}
            <div className="lesson-row-top">
                <div className="skeleton-box"></div>
                <div className="arrow-right skeleton-arrow"></div>
                <div className="skeleton-box"></div>
                <div className="arrow-right skeleton-arrow"></div>
                <div className="skeleton-box"></div>
            </div>
            <div className="vertical-arrow-container right"><div className="arrow-down skeleton-arrow"></div></div>
            
            {/* Row 2 (R to L) */}
            <div className="lesson-row-bottom">
                <div className="skeleton-box"></div>
                <div className="arrow-left skeleton-arrow"></div>
                <div className="skeleton-box"></div>
                <div className="arrow-left skeleton-arrow"></div>
                <div className="skeleton-box"></div>
            </div>
            <div className="vertical-arrow-container left"><div className="arrow-down skeleton-arrow"></div></div>

            {/* Row 3 (L to R) */}
            <div className="lesson-row-top">
                <div className="skeleton-box"></div>
                <div className="arrow-right skeleton-arrow"></div>
                <div className="skeleton-box"></div>
                <div className="arrow-right skeleton-arrow"></div>
                <div className="skeleton-box"></div>
            </div>
            <div className="vertical-arrow-container right"><div className="arrow-down skeleton-arrow"></div></div>

            {/* Row 4 (R to L) */}
            <div className="lesson-row-bottom">
                <div className="skeleton-box"></div>
                <div className="arrow-left skeleton-arrow"></div>
                <div className="skeleton-box"></div>
                <div className="arrow-left skeleton-arrow"></div>
                <div className="skeleton-box"></div>
            </div>
            
            {/* Note: Not all 8 rows are needed for the skeleton, 4 is sufficient */}
          </div>
          <p className="loading-message">Loading progress...</p>
        </div>
      ); 
  }
  // --- END SKELETON RENDER LOGIC ---

  return ( 
    <div className="piano-container">
      <h1 className='piano-lesson-roadmap'>Piano Lesson Roadmap</h1>
      <h2 className='piano-description'>Self paced lessons with interactive practice tools and an AI tutor</h2>
      
      {/* CLERK SIGN UP BUTTON - Only render if not logged in */}
      <div className="auth-section">
        {!user && ( 
            <SignUpButton mode="modal">
                <button className='access-button'>Log in for full access</button>
            </SignUpButton>
        )}
      </div>

      <div className="roadmap-container">
        
        {/* === ROW 1 (Left to Right): Lessons 1-3 (3 Boxes) === */}
        <div className="lesson-row-top">
          <div className={`lesson-box ${isCompleted(1) ? 'completed' : ''}`} onClick={() => handleLessonClick(1)}>
            <h3>Lesson 1 {isCompleted(1) && <span className="checkmark">✓</span>}</h3>
            <p>Getting Started</p>
          </div>
          <div className="arrow-right"></div>
          <div className={`lesson-box ${isCompleted(2) ? 'completed' : ''}`} onClick={() => handleLessonClick(2)}>
            <h3>Lesson 2 {isCompleted(2) && <span className="checkmark">✓</span>}</h3>
            <p>Posture & Hands</p>
          </div>
          <div className="arrow-right"></div>
          <div className={`lesson-box ${!user ? 'locked' : ''} ${isCompleted(3) ? 'completed' : ''}`} onClick={() => handleLessonClick(3)}>
            <h3>Lesson 3 {isCompleted(3) && <span className="checkmark">✓</span>}</h3>
            <p>Notes and Finger Numbering</p>
            {!user && <span className="lock-icon">🔒</span>}
          </div>
        </div>

        {/* TURN 1: Down from Right side */}
        <div className="vertical-arrow-container right">
          <div className="arrow-down"></div>
        </div>

        {/* === ROW 2 (Right to Left): Checkpoint 1, Lessons 5-4 (3 Boxes) === */}
        <div className="lesson-row-bottom">
          <div className={`lesson-box optional ${!user ? 'locked' : ''} ${isCompleted('test1') ? 'completed' : ''}`} onClick={() => handleLessonClick('test1')}>
            <h3>Checkpoint 1 {isCompleted('test1') && <span className="checkmark">✓</span>}</h3>
            <p>Basic Skills Test</p>
            {!user && <span className="lock-icon">🔒</span>}
          </div>
          <div className="arrow-left"></div>
          <div className={`lesson-box ${!user ? 'locked' : ''} ${isCompleted(5) ? 'completed' : ''}`} onClick={() => handleLessonClick(5)}>
            <h3>Lesson 5 {isCompleted(5) && <span className="checkmark">✓</span>}</h3>
            <p>First Easy Song Practice</p>
            {!user && <span className="lock-icon">🔒</span>}
          </div>
          <div className="arrow-left"></div>
          <div className={`lesson-box ${!user ? 'locked' : ''} ${isCompleted(4) ? 'completed' : ''}`} onClick={() => handleLessonClick(4)}>
            <h3>Lesson 4 {isCompleted(4) && <span className="checkmark">✓</span>}</h3>
            <p>Recap and Practice</p>
            {!user && <span className="lock-icon">🔒</span>}
          </div>
        </div>

        {/* TURN 2: Down from Left side */}
        <div className="vertical-arrow-container left">
          <div className="arrow-down"></div>
        </div>

        {/* === ROW 3 (Left to Right): Lessons 6-8 (3 Boxes) === */}
        <div className="lesson-row-top">
          <div className={`lesson-box ${!user ? 'locked' : ''} ${isCompleted(6) ? 'completed' : ''}`} onClick={() => handleLessonClick(6)}>
            <h3>Lesson 6 {isCompleted(6) && <span className="checkmark">✓</span>}</h3>
            <p>Rhythm: Whole, Half, Quarter Notes</p>
            {!user && <span className="lock-icon">🔒</span>}
          </div>
          <div className="arrow-right"></div>
          <div className={`lesson-box ${!user ? 'locked' : ''} ${isCompleted(7) ? 'completed' : ''}`} onClick={() => handleLessonClick(7)}>
            <h3>Lesson 7 {isCompleted(7) && <span className="checkmark">✓</span>}</h3>
            <p>The Grand Staff & Treble Clef</p>
            {!user && <span className="lock-icon">🔒</span>}
          </div>
          <div className="arrow-right"></div>
          <div className={`lesson-box ${!user ? 'locked' : ''} ${isCompleted(8) ? 'completed' : ''}`} onClick={() => handleLessonClick(8)}>
            <h3>Lesson 8 {isCompleted(8) && <span className="checkmark">✓</span>}</h3>
            <p>Reading the Bass Clef</p>
            {!user && <span className="lock-icon">🔒</span>}
          </div>
        </div>

        {/* TURN 3: Down from Right side */}
        <div className="vertical-arrow-container right">
          <div className="arrow-down"></div>
        </div>

        {/* === ROW 4 (Right to Left): Checkpoint 2, Lessons 10-9 (3 Boxes) === */}
        <div className="lesson-row-bottom">
          {/* CHECKPOINT 2 */}
          <div className={`lesson-box optional ${!user ? 'locked' : ''} ${isCompleted('test2') ? 'completed' : ''}`} onClick={() => handleLessonClick('test2')}>
            <h3>Checkpoint 2 {isCompleted('test2') && <span className="checkmark">✓</span>}</h3>
            <p>Sheet Music Reading Test</p>
            {!user && <span className="lock-icon">🔒</span>}
          </div>
          <div className="arrow-left"></div>
          <div className={`lesson-box ${!user ? 'locked' : ''} ${isCompleted(10) ? 'completed' : ''}`} onClick={() => handleLessonClick(10)}>
            <h3>Lesson 10 {isCompleted(10) && <span className="checkmark">✓</span>}</h3>
            <p>Sight-Reading Simple Melodies</p>
            {!user && <span className="lock-icon">🔒</span>}
          </div>
          <div className="arrow-left"></div>
          <div className={`lesson-box ${!user ? 'locked' : ''} ${isCompleted(9) ? 'completed' : ''}`} onClick={() => handleLessonClick(9)}>
            <h3>Lesson 9 {isCompleted(9) && <span className="checkmark">✓</span>}</h3>
            <p>Playing Another Easy Song</p>
            {!user && <span className="lock-icon">🔒</span>}
          </div>
        </div>

        {/* TURN 4: Down from Left side */}
        <div className="vertical-arrow-container left">
          <div className="arrow-down"></div>
        </div>

        {/* === ROW 5 (Left to Right): Lessons 11-13 (3 Boxes) === */}
        <div className="lesson-row-top">
          <div className={`lesson-box ${!user ? 'locked' : ''} ${isCompleted(11) ? 'completed' : ''}`} onClick={() => handleLessonClick(11)}>
            <h3>Lesson 11 {isCompleted(11) && <span className="checkmark">✓</span>}</h3>
            <p>Half and Whole Steps</p>
            {!user && <span className="lock-icon">🔒</span>}
          </div>
          <div className="arrow-right"></div>
          <div className={`lesson-box ${!user ? 'locked' : ''} ${isCompleted(12) ? 'completed' : ''}`} onClick={() => handleLessonClick(12)}>
            <h3>Lesson 12 {isCompleted(12) && <span className="checkmark">✓</span>}</h3>
            <p>Sharps and Flats</p>
            {!user && <span className="lock-icon">🔒</span>}
          </div>
          <div className="arrow-right"></div>
          <div className={`lesson-box ${!user ? 'locked' : ''} ${isCompleted(13) ? 'completed' : ''}`} onClick={() => handleLessonClick(13)}>
            <h3>Lesson 13 {isCompleted(13) && <span className="checkmark">✓</span>}</h3>
            <p>Building Major Scales</p>
            {!user && <span className="lock-icon">🔒</span>}
          </div>
        </div>

        {/* NEW TURN 5: Down from Right side */}
        <div className="vertical-arrow-container right">
          <div className="arrow-down"></div>
        </div>

        {/* === NEW ROW 6 (Right to Left): Lesson 14, Checkpoint 3, Lesson 15 (3 Boxes) === */}
        <div className="lesson-row-bottom">
          <div className={`lesson-box ${!user ? 'locked' : ''} ${isCompleted(14) ? 'completed' : ''}`} onClick={() => handleLessonClick(14)}>
            <h3>Lesson 14 {isCompleted(14) && <span className="checkmark">✓</span>}</h3>
            <p>Introduction to Triads</p>
            {!user && <span className="lock-icon">🔒</span>}
          </div>
          <div className="arrow-left"></div>
          <div className={`lesson-box optional ${!user ? 'locked' : ''} ${isCompleted('test3') ? 'completed' : ''}`} onClick={() => handleLessonClick('test3')}>
            <h3>Checkpoint 3 {isCompleted('test3') && <span className="checkmark">✓</span>}</h3>
            <p>Chords & Key Signatures Test</p>
            {!user && <span className="lock-icon">🔒</span>}
          </div>
          <div className="arrow-left"></div>
          <div className={`lesson-box ${!user ? 'locked' : ''} ${isCompleted(15) ? 'completed' : ''}`} onClick={() => handleLessonClick(15)}>
            <h3>Lesson 15 {isCompleted(15) && <span className="checkmark">✓</span>}</h3>
            <p>Major and Minor Chords</p>
            {!user && <span className="lock-icon">🔒</span>}
          </div>
        </div>

        {/* NEW TURN 6: Down from Left side */}
        <div className="vertical-arrow-container left">
          <div className="arrow-down"></div>
        </div>
        
        {/* === NEW ROW 7 (Left to Right): Lessons 16-18 (3 Boxes) === */}
        <div className="lesson-row-top">
          <div className={`lesson-box ${!user ? 'locked' : ''} ${isCompleted(16) ? 'completed' : ''}`} onClick={() => handleLessonClick(16)}>
            <h3>Lesson 16 {isCompleted(16) && <span className="checkmark">✓</span>}</h3>
            <p>Intermediate Song Structure</p>
            {!user && <span className="lock-icon">🔒</span>}
          </div>
          <div className="arrow-right"></div>
          <div className={`lesson-box ${!user ? 'locked' : ''} ${isCompleted(17) ? 'completed' : ''}`} onClick={() => handleLessonClick(17)}>
            <h3>Lesson 17 {isCompleted(17) && <span className="checkmark">✓</span>}</h3>
            <p>Playing Hands-Together Pieces</p>
            {!user && <span className="lock-icon">🔒</span>}
          </div>
          <div className="arrow-right"></div>
          <div className={`lesson-box ${!user ? 'locked' : ''} ${isCompleted(18) ? 'completed' : ''}`} onClick={() => handleLessonClick(18)}>
            <h3>Lesson 18 {isCompleted(18) && <span className="checkmark">✓</span>}</h3>
            <p>Chord Progressions & Accompaniments</p>
            {!user && <span className="lock-icon">🔒</span>}
          </div>
        </div>
        
        {/* NEW TURN 7: Down from Right side */}
        <div className="vertical-arrow-container right">
          <div className="arrow-down"></div>
        </div>

        {/* === NEW ROW 8 (Right to Left): Checkpoint 4 (far right), Lesson 20, Lesson 19 (3 Boxes) === */}
        <div className="lesson-row-bottom">
          {/* Checkpoint 4 (test4) is on the far right visually */}
          <div className={`lesson-box optional ${!user ? 'locked' : ''} ${isCompleted('test4') ? 'completed' : ''}`} onClick={() => handleLessonClick('test4')}>
            <h3>Checkpoint 4 {isCompleted('test4') && <span className="checkmark">✓</span>}</h3>
            <p>Final Capstone Performance</p>
            {!user && <span className="lock-icon">🔒</span>}
          </div>
          <div className="arrow-left"></div>
          <div className={`lesson-box ${!user ? 'locked' : ''} ${isCompleted(20) ? 'completed' : ''}`} onClick={() => handleLessonClick(20)}>
            <h3>Lesson 20 {isCompleted(20) && <span className="checkmark">✓</span>}</h3>
            <p>Mastering Complex Pieces</p>
            {!user && <span className="lock-icon">🔒</span>}
          </div>
          <div className="arrow-left"></div>
          <div className={`lesson-box ${!user ? 'locked' : ''} ${isCompleted(19) ? 'completed' : ''}`} onClick={() => handleLessonClick(19)}>
            <h3>Lesson 19 {isCompleted(19) && <span className="checkmark">✓</span>}</h3>
            <p>Playing with Pedals and Dynamics</p>
            {!user && <span className="lock-icon">🔒</span>}
          </div>
        </div>
        
        {/* FINAL ARROW: Down from far left (Lesson 19) to end the roadmap */}
         <div className="vertical-arrow-container left">
          <div className="arrow-down"></div>
        </div>
        
      </div>
    </div>
  );
}

export default Piano;