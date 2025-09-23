import './Piano.css';
import { useEffect } from 'react';
import {
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/clerk-react";

function Piano() {
  useEffect(() => {
    document.body.style.backgroundColor = '#E5D8CE';
    
    return () => {
      document.body.style.backgroundColor = '';
    };
  }, []);

  const handleLessonClick = (lessonNumber) => {
    // navigation logic here
    console.log(`Navigate to lesson ${lessonNumber}`);
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
        {/* Lessons 1, 2, 3 */}
        <div className="lesson-row">
          <div className="lesson-box" onClick={() => handleLessonClick(1)}>
            <h3>Lesson 1</h3>
            <p>Basic Hand Position</p>
          </div>
          <div className="arrow-right">→</div>
          <div className="lesson-box" onClick={() => handleLessonClick(2)}>
            <h3>Lesson 2</h3>
            <p>Reading Notes</p>
          </div>
          <div className="arrow-right">→</div>
          <div className="lesson-box" onClick={() => handleLessonClick(3)}>
            <h3>Lesson 3</h3>
            <p>Simple Melodies</p>
          </div>
        </div>

        {/* Arrow down from Lesson 3 */}
        <div className="arrow-down-container">
          <div className="arrow-down">↓</div>
        </div>

        {/* Lessons 4, 5, Optional Test */}
        <div className="lesson-row reverse">
        <div className="lesson-box" onClick={() => handleLessonClick(4)}>
            <h3>Lesson 4</h3>
            <p>Rhythm Patterns</p>
          </div>
          <div className="arrow-left">←</div>
          <div className="lesson-box optional" onClick={() => handleLessonClick('test')}>
            <h3>Optional</h3>
            <p>Test</p>
          </div>
          <div className="arrow-left">←</div>
          <div className="lesson-box" onClick={() => handleLessonClick(5)}>
            <h3>Lesson 5</h3>
            <p>Advanced Techniques</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Piano;