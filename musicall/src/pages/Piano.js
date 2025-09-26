import './Piano.css';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';
import {
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/clerk-react";

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
    console.log('Navigating to lesson:', lessonNumber);
    
    // Check if user is signed in for lessons 3, 4, 5, and test
    if (!user && (lessonNumber === 3 || lessonNumber === 4 || lessonNumber === 5 || lessonNumber === 'test1')) {
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
        {/* Top Row - Lessons 1, 2, 3 */}
        <div className="lesson-row-top">
          <div className="lesson-box" onClick={() => handleLessonClick(1)}>
            <h3>Lesson 1</h3>
            <p>Description</p>
          </div>
          <div className="arrow-right">→</div>
          <div className="lesson-box" onClick={() => handleLessonClick(2)}>
            <h3>Lesson 2</h3>
            <p>Description</p>
          </div>
          <div className="arrow-right">→</div>
          <div className={`lesson-box ${!user ? 'locked' : ''}`} onClick={() => handleLessonClick(3)}>
            <h3>Lesson 3</h3>
            <p>Description</p>
            {!user && <span className="lock-icon">🔒</span>}
          </div>
        </div>

        {/* Arrow down from Lesson 3 to Lesson 4 */}
        <div className="vertical-arrow">
          <div className="arrow-down">↓</div>
        </div>

        {/* Bottom Row - Lesson 5, Optional Test, Lesson 4 */}
        <div className="lesson-row-bottom">
          <div className={`lesson-box optional ${!user ? 'locked' : ''}`} onClick={() => handleLessonClick('test1')}>
            <h3>Optional</h3>
            <p>test</p>
            {!user && <span className="lock-icon">🔒</span>}
          </div>
          <div className="arrow-left">←</div>
          <div className={`lesson-box ${!user ? 'locked' : ''}`} onClick={() => handleLessonClick(5)}>
            <h3>Lesson 5</h3>
            <p>Description</p>
            {!user && <span className="lock-icon">🔒</span>}
          </div>
          <div className="arrow-left">←</div>
          <div className={`lesson-box ${!user ? 'locked' : ''}`} onClick={() => handleLessonClick(4)}>
            <h3>Lesson 4</h3>
            <p>Description</p>
            {!user && <span className="lock-icon">🔒</span>}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Piano;