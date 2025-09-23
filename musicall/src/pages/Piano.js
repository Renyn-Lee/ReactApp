import './Piano.css';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/clerk-react";

function Piano() {
  const navigate = useNavigate();

  useEffect(() => {
    document.body.style.backgroundColor = '#E5D8CE';
    
    return () => {
      document.body.style.backgroundColor = '';
    };
  }, []);

  const handleLessonClick = (lessonNumber) => {
    console.log('Navigating to lesson:', lessonNumber);
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
        <SignedIn>
          <div className="user-button-corner">
            <UserButton />
          </div>
        </SignedIn>
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
          <div className="lesson-box" onClick={() => handleLessonClick(3)}>
            <h3>Lesson 3</h3>
            <p>Description</p>
          </div>
        </div>

        {/* Arrow down from Lesson 3 to Lesson 4 */}
        <div className="vertical-arrow">
          <div className="arrow-down">↓</div>
        </div>

        {/* Bottom Row - Lesson 5, Optional Test, Lesson 4 */}
        <div className="lesson-row-bottom">
          <div className="lesson-box optional" onClick={() => handleLessonClick('test')}>
            <h3> Optional</h3>
            <p>test</p>
          </div>
          <div className="arrow-left">←</div>
          <div className="lesson-box" onClick={() => handleLessonClick(5)}>
            <h3>Lesson 5</h3>
            <p>Discription</p>
          </div>
          <div className="arrow-left">←</div>
          <div className="lesson-box" onClick={() => handleLessonClick(4)}>
            <h3>Lesson 4</h3>
            <p>Description</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Piano;