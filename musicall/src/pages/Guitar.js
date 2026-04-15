import { useEffect, useState } from 'react';
import './Guitar.css'; 
import { SignInButton, UserButton, useUser } from "@clerk/clerk-react";
import { useNavigate } from 'react-router-dom';

function Guitar() {
  const { isSignedIn, user, isLoaded } = useUser(); 
  const navigate = useNavigate();
  
  const [completedLessons, setCompletedLessons] = useState([]);
  const [testScores, setTestScores] = useState({});

  // 1. Force scroll to top and handle dynamic background colors
  useEffect(() => {
    window.scrollTo(0, 0);

    const observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0.3, // Change color when 30% of the header is visible
    };

    const observerCallback = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          if (entry.target.id === 'section-1-header') {
            document.body.style.backgroundColor = '#D09691'; // Section 1: Dusty Rose
          } else if (entry.target.id === 'section-2-header') {
            document.body.style.backgroundColor = '#C08080'; // Section 2: Deeper Rose/Mauve
          }
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);
    
    // Elements to watch
    const s1 = document.getElementById('section-1-header');
    const s2 = document.getElementById('section-2-header');
    
    if (s1) observer.observe(s1);
    if (s2) observer.observe(s2);

    return () => {
      observer.disconnect();
      document.body.style.backgroundColor = ''; 
    };
  }, [isLoaded]);

  // 2. Auto-scroll logic for completed lessons
  useEffect(() => {
    if (isLoaded && completedLessons.length > 0) {
      const numericLessons = completedLessons.filter(l => typeof l === 'number');
      if (numericLessons.length > 0) {
        const maxLesson = Math.max(...numericLessons);
        const element = document.getElementById(`lesson-box-${maxLesson}`);
        
        if (element) {
          setTimeout(() => {
            element.scrollIntoView({ 
              behavior: 'smooth', 
              block: 'center' 
            });
          }, 500);
        }
      }
    }
  }, [completedLessons, isLoaded]);

  // 3. Force reload of user data for progress saving
  useEffect(() => {
    const refreshUserData = async () => {
      if (isLoaded && isSignedIn && user) {
        try {
          await user.reload();
        } catch (error) {
          console.error("Error reloading user data:", error);
        }
      }
    };
    refreshUserData();
  }, [isLoaded, isSignedIn]);

  // 4. Update local state from Clerk metadata
  useEffect(() => {
    if (isLoaded && isSignedIn && user) {
      setCompletedLessons(user.unsafeMetadata?.completedGuitarLessons || []);
      setTestScores(user.unsafeMetadata?.guitarTestScores || {});
    }
  }, [isLoaded, isSignedIn, user]);

  // Section Locking Logic
  const section1Unlocked = testScores['section1test'] >= 80 || false;

  const isLocked = (num) => {
    if (!isLoaded) return true;
    if (num === 1 || num === 2) return false; // Free lessons
    if (!isSignedIn) return true;

    // Check if it's Section 2 (Lessons 21+ or S2 Test)
    const isSection2 = (typeof num === 'number' && num >= 21) || num === 'section2test';
    if (isSection2 && !section1Unlocked) return true;
    
    return false;
  };

  // Handle lesson clicks with special routing for section1test
  const handleLessonClick = async (lessonNumber) => {
    if (!isLoaded) return;
    
    // Auth Check
    if (!isSignedIn && lessonNumber !== 1 && lessonNumber !== 2) {
      alert('Please sign in to access this lesson!');
      return;
    }

    // Lock Check
    const isSection2 = (typeof lessonNumber === 'number' && lessonNumber >= 21) || lessonNumber === 'section2test';
    if (isSection2 && !section1Unlocked) {
      alert('You need to complete the Section 1 Test with a score of 80% or higher first!');
      return;
    }

    // Navigate - UPDATED: Special handling for section1test
    if (lessonNumber === 'section1test') {
      navigate('/guitar-section1test');
    } else {
      navigate(`/guitar-lesson/${lessonNumber}`);
    }
  };
  
  if (!isLoaded) return <div className="guitar-container">Loading Roadmap...</div>;

  return (
    <div className="guitar-container">
      {/* Dynamic Background Transition Style */}
      <style>{`
        body {
          transition: background-color 1.2s ease-in-out;
        }
      `}</style>

      <h1 className="guitar-lesson-roadmap">Guitar Lesson Roadmap</h1>
      <h2 className='guitar-description'>Self-paced lessons with interactive practice tools and an AI tutor</h2>
      
      <div className="auth-section">
        {!isSignedIn ? (
          <SignInButton mode="modal">
            <button className="access-button">Log in for full access</button>
          </SignInButton>
        ) : (
          <div className="logged-in-container">
            <UserButton afterSignOutUrl="/guitar"/>
          </div>
        )}
      </div>

      <div className="roadmap-container">
        
        {/* SECTION 1 HEADER */}
        <div className="section-header-box" id="section-1-header">
          <h2 className="section-title">Section 1: Fundamentals</h2>
        </div>

        {/* ROW 1: 1 -> 2 -> 3 */}
      <div className="lesson-row-top">
          {[1, 2, 3].map((num, i) => (
            <div key={num} style={{display: 'flex', alignItems: 'center'}}>
              <div id={`lesson-box-${num}`} 
                className={`lesson-box ${isLocked(num) ? 'locked' : ''} ${completedLessons.includes(num) ? 'completed' : ''}`} 
                onClick={() => handleLessonClick(num)}>
                <h3>Lesson {num}</h3>
                <p>{num === 1 ? "Getting Started" : num === 2 ? "Rhythm & Tablature" : "The First Chords"}</p>
                {isLocked(num) && <span className="lock-icon">🔒</span>}
                {completedLessons.includes(num) && <span className="checkmark">✔️</span>}
              </div>
              {i < 2 && <div className="guitar-arrow-right"></div>}
            </div>
          ))}
        </div>
        <div className="vertical-arrow-container right"><div className="guitar-arrow-down"></div></div>

        {/* ROW 2: 6 <- 5 <- 4 */}
        <div className="lesson-row-bottom">
          {[6, 5, 4].map((num, i) => (
            <div key={num} style={{display: 'flex', alignItems: 'center'}}>
              <div id={`lesson-box-${num}`} 
                className={`lesson-box ${isLocked(num) ? 'locked' : ''} ${completedLessons.includes(num) ? 'completed' : ''}`} 
                onClick={() => handleLessonClick(num)}>
                <h3>Lesson {num}</h3>
                <p>{num === 4 ? "Major Scale & Theory" : num === 5 ? "Power Chords" : "Barre Chords"}</p>
                {isLocked(num) && <span className="lock-icon">🔒</span>}
                {completedLessons.includes(num) && <span className="checkmark">✔️</span>}
              </div>
              {i < 2 && <div className="guitar-arrow-left"></div>}
            </div>
          ))}
        </div>
        <div className="vertical-arrow-container left"><div className="guitar-arrow-down"></div></div>

        {/* ROW 3: 7 -> 8 -> 9 */}
        <div className="lesson-row-top">
          {[7, 8, 9].map((num, i) => (
            <div key={num} style={{display: 'flex', alignItems: 'center'}}>
              <div id={`lesson-box-${num}`} className={`lesson-box ${isLocked(num) ? 'locked' : ''} ${completedLessons.includes(num) ? 'completed' : ''}`} onClick={() => handleLessonClick(num)}>
                <h3>Lesson {num}</h3>
                <p>{num === 7 ? "Fingerpicking" : num === 8 ? "Minor Pentatonic" : "Your First Full Song"}</p>
                {isLocked(num) && <span className="lock-icon">🔒</span>}
                {completedLessons.includes(num) && <span className="checkmark">✔️</span>}
              </div>
              {i < 2 && <div className="guitar-arrow-right"></div>}
            </div>
          ))}
        </div>
        <div className="vertical-arrow-container right"><div className="guitar-arrow-down"></div></div>

        {/* ROW 4: 12 <- 11 <- 10 */}
        <div className="lesson-row-bottom">
          {[12, 11, 10].map((num, i) => (
            <div key={num} style={{display: 'flex', alignItems: 'center'}}>
              <div id={`lesson-box-${num}`} className={`lesson-box ${isLocked(num) ? 'locked' : ''} ${completedLessons.includes(num) ? 'completed' : ''}`} onClick={() => handleLessonClick(num)}>
                <h3>Lesson {num}</h3>
                <p>{num === 10 ? "Dynamics & Tone" : num === 11 ? "Minor Keys & Scale" : "The CAGED System"}</p>
                {isLocked(num) && <span className="lock-icon">🔒</span>}
                {completedLessons.includes(num) && <span className="checkmark">✔️</span>}
              </div>
              {i < 2 && <div className="guitar-arrow-left"></div>}
            </div>
          ))}
        </div>
        <div className="vertical-arrow-container left"><div className="guitar-arrow-down"></div></div>

        {/* ROW 5: 13 -> 14 -> 15 */}
        <div className="lesson-row-top">
          {[13, 14, 15].map((num, i) => (
            <div key={num} style={{display: 'flex', alignItems: 'center'}}>
              <div id={`lesson-box-${num}`} className={`lesson-box ${isLocked(num) ? 'locked' : ''} ${completedLessons.includes(num) ? 'completed' : ''}`} onClick={() => handleLessonClick(num)}>
                <h3>Lesson {num}</h3>
                <p>{num === 13 ? "Syncopation" : num === 14 ? "Minor Barre Chords" : "Hammer-ons & Slides"}</p>
                {isLocked(num) && <span className="lock-icon">🔒</span>}
                {completedLessons.includes(num) && <span className="checkmark">✔️</span>}
              </div>
              {i < 2 && <div className="guitar-arrow-right"></div>}
            </div>
          ))}
        </div>
        <div className="vertical-arrow-container right"><div className="guitar-arrow-down"></div></div>

        {/* ROW 6: 18 <- 17 <- 16 */}
        <div className="lesson-row-bottom">
          {[18, 17, 16].map((num, i) => (
            <div key={num} style={{display: 'flex', alignItems: 'center'}}>
              <div id={`lesson-box-${num}`} className={`lesson-box ${isLocked(num) ? 'locked' : ''} ${completedLessons.includes(num) ? 'completed' : ''}`} onClick={() => handleLessonClick(num)}>
                <h3>Lesson {num}</h3>
                <p>{num === 16 ? "12-Bar Blues" : num === 17 ? "Advanced Fingerpicking" : "Song Structure"}</p>
                {isLocked(num) && <span className="lock-icon">🔒</span>}
                {completedLessons.includes(num) && <span className="checkmark">✔️</span>}
              </div>
              {i < 2 && <div className="guitar-arrow-left"></div>}
            </div>
          ))}
        </div>
        <div className="vertical-arrow-container left"><div className="guitar-arrow-down"></div></div>

        {/* ROW 7: 19 -> 20 -> S1 TEST */}
        <div className="lesson-row-top">
          <div id="lesson-box-19" className={`lesson-box ${isLocked(19) ? 'locked' : ''} ${completedLessons.includes(19) ? 'completed' : ''}`} onClick={() => handleLessonClick(19)}>
            <h3>Lesson 19</h3><p>Vibrato & Bends</p>
            {isLocked(19) && <span className="lock-icon">🔒</span>}
            {completedLessons.includes(19) && <span className="checkmark">✔️</span>}
          </div>
          <div className="guitar-arrow-right"></div>
          <div id="lesson-box-20" className={`lesson-box ${isLocked(20) ? 'locked' : ''} ${completedLessons.includes(20) ? 'completed' : ''}`} onClick={() => handleLessonClick(20)}>
            <h3>Lesson 20</h3><p>Your Next Steps</p>
            {isLocked(20) && <span className="lock-icon">🔒</span>}
            {completedLessons.includes(20) && <span className="checkmark">✔️</span>}
          </div>
          <div className="guitar-arrow-right"></div>
          <div id="lesson-box-section1test" className={`lesson-box final-test ${isLocked('section1test') ? 'locked' : ''} ${completedLessons.includes('section1test') ? 'completed' : ''}`} onClick={() => handleLessonClick('section1test')}>
            <h3>S1 Test</h3>
            {isLocked('section1test') && <span className="lock-icon">🔒</span>}
            {completedLessons.includes('section1test') && <span className="checkmark">✔️</span>}
          </div>
        </div>

        {/* --- SECTION 2 DIVIDER --- */}
        <div className="section-divider">
            <div className="divider-line"></div>
            <div className="divider-icon">🎸</div>
            <div className="divider-line"></div>
        </div>

        {/* SECTION 2 HEADER */}
        <div className="section-header-box" id="section-2-header">
          <h2 className="section-title">Section 2: Intermediate</h2>
        </div>

        {/* ROW 8: 21 -> 22 -> 23 */}
        <div className="lesson-row-top">
          {[21, 22, 23].map((num, i) => (
            <div key={num} style={{display: 'flex', alignItems: 'center'}}>
              <div id={`lesson-box-${num}`} className={`lesson-box ${isLocked(num) ? 'locked' : ''} ${completedLessons.includes(num) ? 'completed' : ''}`} onClick={() => handleLessonClick(num)}>
                <h3>Lesson {num}</h3>
                <p>{num === 21 ? "Major Barre" : num === 22 ? "Minor Barre" : "7th Chords"}</p>
                {isLocked(num) && <span className="lock-icon">🔒</span>}
                {completedLessons.includes(num) && <span className="checkmark">✔️</span>}
              </div>
              {i < 2 && <div className="guitar-arrow-right"></div>}
            </div>
          ))}
        </div>
        <div className="vertical-arrow-container right"><div className="guitar-arrow-down"></div></div>

        {/* ROW 9: 26 <- 25 <- 24 */}
        <div className="lesson-row-bottom">
          {[26, 25, 24].map((num, i) => (
            <div key={num} style={{display: 'flex', alignItems: 'center'}}>
              <div id={`lesson-box-${num}`} className={`lesson-box ${isLocked(num) ? 'locked' : ''} ${completedLessons.includes(num) ? 'completed' : ''}`} onClick={() => handleLessonClick(num)}>
                <h3>Lesson {num}</h3>
                <p>{num === 24 ? "Adv Power Chords" : num === 25 ? "Palm Muting" : "Hammer-ons"}</p>
                {isLocked(num) && <span className="lock-icon">🔒</span>}
                {completedLessons.includes(num) && <span className="checkmark">✔️</span>}
              </div>
              {i < 2 && <div className="guitar-arrow-left"></div>}
            </div>
          ))}
        </div>
        <div className="vertical-arrow-container left"><div className="guitar-arrow-down"></div></div>

        {/* ROW 10: 27 -> 28 -> 29 */}
        <div className="lesson-row-top">
          {[27, 28, 29].map((num, i) => (
            <div key={num} style={{display: 'flex', alignItems: 'center'}}>
              <div id={`lesson-box-${num}`} className={`lesson-box ${isLocked(num) ? 'locked' : ''} ${completedLessons.includes(num) ? 'completed' : ''}`} onClick={() => handleLessonClick(num)}>
                <h3>Lesson {num}</h3>
                <p>{num === 27 ? "Pull-offs" : num === 28 ? "Pentatonic" : "Blues Scale"}</p>
                {isLocked(num) && <span className="lock-icon">🔒</span>}
                {completedLessons.includes(num) && <span className="checkmark">✔️</span>}
              </div>
              {i < 2 && <div className="guitar-arrow-right"></div>}
            </div>
          ))}
        </div>
        <div className="vertical-arrow-container right"><div className="guitar-arrow-down"></div></div>

        {/* ROW 11: 32 <- 31 <- 30 */}
        <div className="lesson-row-bottom">
          {[32, 31, 30].map((num, i) => (
            <div key={num} style={{display: 'flex', alignItems: 'center'}}>
              <div id={`lesson-box-${num}`} className={`lesson-box ${isLocked(num) ? 'locked' : ''} ${completedLessons.includes(num) ? 'completed' : ''}`} onClick={() => handleLessonClick(num)}>
                <h3>Lesson {num}</h3>
                <p>{num === 30 ? "Bending" : num === 31 ? "Vibrato" : "Major Scales"}</p>
                {isLocked(num) && <span className="lock-icon">🔒</span>}
                {completedLessons.includes(num) && <span className="checkmark">✔️</span>}
              </div>
              {i < 2 && <div className="guitar-arrow-left"></div>}
            </div>
          ))}
        </div>
        <div className="vertical-arrow-container left"><div className="guitar-arrow-down"></div></div>

        {/* ROW 12: 33 -> 34 -> 35 */}
        <div className="lesson-row-top">
          {[33, 34, 35].map((num, i) => (
            <div key={num} style={{display: 'flex', alignItems: 'center'}}>
              <div id={`lesson-box-${num}`} className={`lesson-box ${isLocked(num) ? 'locked' : ''} ${completedLessons.includes(num) ? 'completed' : ''}`} onClick={() => handleLessonClick(num)}>
                <h3>Lesson {num}</h3>
                <p>{num === 33 ? "Relative Minor" : num === 34 ? "Fingerstyle" : "Travis Picking"}</p>
                {isLocked(num) && <span className="lock-icon">🔒</span>}
                {completedLessons.includes(num) && <span className="checkmark">✔️</span>}
              </div>
              {i < 2 && <div className="guitar-arrow-right"></div>}
            </div>
          ))}
        </div>
        <div className="vertical-arrow-container right"><div className="guitar-arrow-down"></div></div>

        {/* ROW 13: 38 <- 37 <- 36 */}
        <div className="lesson-row-bottom">
          {[38, 37, 36].map((num, i) => (
            <div key={num} style={{display: 'flex', alignItems: 'center'}}>
              <div id={`lesson-box-${num}`} className={`lesson-box ${isLocked(num) ? 'locked' : ''} ${completedLessons.includes(num) ? 'completed' : ''}`} onClick={() => handleLessonClick(num)}>
                <h3>Lesson {num}</h3>
                <p>{num === 36 ? "12-Bar Blues" : num === 37 ? "Improvisation" : "Inversions"}</p>
                {isLocked(num) && <span className="lock-icon">🔒</span>}
                {completedLessons.includes(num) && <span className="checkmark">✔️</span>}
              </div>
              {i < 2 && <div className="guitar-arrow-left"></div>}
            </div>
          ))}
        </div>
        <div className="vertical-arrow-container left"><div className="guitar-arrow-down"></div></div>

        {/* ROW 14: 39 -> 40 -> S2 TEST */}
        <div className="lesson-row-top">
          <div id="lesson-box-39" className={`lesson-box ${isLocked(39) ? 'locked' : ''} ${completedLessons.includes(39) ? 'completed' : ''}`} onClick={() => handleLessonClick(39)}>
            <h3>Lesson 39</h3><p>Songwriting</p>
            {isLocked(39) && <span className="lock-icon">🔒</span>}
            {completedLessons.includes(39) && <span className="checkmark">✔️</span>}
          </div>
          <div className="guitar-arrow-right"></div>
          <div id="lesson-box-40" className={`lesson-box ${isLocked(40) ? 'locked' : ''} ${completedLessons.includes(40) ? 'completed' : ''}`} onClick={() => handleLessonClick(40)}>
            <h3>Lesson 40</h3><p>Performance</p>
            {isLocked(40) && <span className="lock-icon">🔒</span>}
            {completedLessons.includes(40) && <span className="checkmark">✔️</span>}
          </div>
          <div className="guitar-arrow-right"></div>
          <div id="lesson-box-section2test" className={`lesson-box final-test ${isLocked('section2test') ? 'locked' : ''} ${completedLessons.includes('section2test') ? 'completed' : ''}`} onClick={() => handleLessonClick('section2test')}>
            <h3>S2 Test</h3>
            {isLocked('section2test') && <span className="lock-icon">🔒</span>}
            {completedLessons.includes('section2test') && <span className="checkmark">✔️</span>}
          </div>
        </div>
        
      </div>
    </div>
  );
}

export default Guitar;