import { useEffect, useState } from 'react';
import './Piano.css'; 
import { SignInButton, UserButton, useUser } from "@clerk/clerk-react";
import { useNavigate, useLocation } from 'react-router-dom';

function Piano() {
  const { isSignedIn, user, isLoaded } = useUser(); 
  const navigate = useNavigate();
  const location = useLocation(); 
  
  const [completedLessons, setCompletedLessons] = useState([]);
  const [testScores, setTestScores] = useState({});

  useEffect(() => {
    document.body.style.backgroundColor = '#E5D8CE';
    return () => { document.body.style.backgroundColor = ''; };
  }, []);

  // FIX: Force a reload of user data when the component mounts
  // This ensures we get the latest 'completedLessons' immediately after finishing a lesson
  useEffect(() => {
    const refreshUserData = async () => {
      if (isLoaded && isSignedIn && user) {
        try {
          await user.reload(); // <--- THIS LINE FIXES THE SAVING ISSUE
        } catch (error) {
          console.error("Error reloading user data:", error);
        }
      }
    };
    refreshUserData();
  }, [isLoaded, isSignedIn]); // Run once on load/signin

  // Update local state whenever the user object changes (including after the reload above)
  useEffect(() => {
    if (isLoaded && isSignedIn && user) {
      setCompletedLessons(user.unsafeMetadata?.completedPianoLessons || []);
      setTestScores(user.unsafeMetadata?.pianoTestScores || {});
    }
  }, [isLoaded, isSignedIn, user]);

  // Scroll to latest lesson
  useEffect(() => {
    if (isLoaded && completedLessons.length > 0) {
      const numericLessons = completedLessons.filter(l => typeof l === 'number');
      if (numericLessons.length > 0) {
        const maxLesson = Math.max(...numericLessons);
        const element = document.getElementById(`lesson-box-${maxLesson}`);
        if (element) {
          setTimeout(() => {
            element.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }, 300);
        }
      }
    }
  }, [completedLessons, isLoaded]); // Removed 'location' to prevent jumpiness

  const section1Unlocked = testScores['section1test'] >= 80 || false;

  const isLocked = (num) => {
    if (!isLoaded) return true;
    if (num === 1 || num === 2) return false;
    if (!isSignedIn) return true;
    const isSection2 = (typeof num === 'number' && num >= 21) || num === 'section2test';
    if (isSection2 && !section1Unlocked) return true;
    return false;
  };

  const handleLessonClick = async (lessonNumber) => {
    if (!isLoaded) return;
    
    // 1. Check Auth
    if (!isSignedIn && lessonNumber !== 1 && lessonNumber !== 2) {
      alert('Please sign in to access this lesson!');
      return;
    }

    // 2. Check Section 2 Lock
    const isSection2 = (typeof lessonNumber === 'number' && lessonNumber >= 21) || lessonNumber === 'section2test';
    if (isSection2 && !section1Unlocked) {
      alert('You need to complete the Section 1 Test with a score of 80% or higher first!');
      return;
    }

    // 3. Navigate
    navigate(`/lesson/${lessonNumber}`);
  };

  if (!isLoaded) return <div className="piano-container">Loading Roadmap...</div>;

  return (
    <div className="piano-container">
      {/* ... (The rest of your JSX remains exactly the same) ... */}
      <h1 className="piano-lesson-roadmap">Piano Lesson Roadmap</h1>
      
      <div className="auth-section">
        {!isSignedIn ? (
          <SignInButton mode="modal">
            <button className="access-button">Log in for full access</button>
          </SignInButton>
        ) : (
          <div className="logged-in-container">
            <UserButton afterSignOutUrl="/piano"/>
          </div>
        )}
      </div>

      <div className="roadmap-container">
        <div className="section-header-box">
          <h2 className="section-title">Section 1: The Foundation & Sight Reading</h2>
        </div>

        {/* ROW 1: 1, 2, 3 */}
        <div className="lesson-row-top">
          <div id="lesson-box-1" className={`lesson-box ${isLocked(1) ? 'locked' : ''} ${completedLessons.includes(1) ? 'completed' : ''}`} onClick={() => handleLessonClick(1)}>
            <h3>Lesson 1</h3><p>Middle C & Facts</p>
            {completedLessons.includes(1) && <span className="checkmark">✔️</span>}
          </div>
          <div className="arrow-right"></div>
          <div id="lesson-box-2" className={`lesson-box ${isLocked(2) ? 'locked' : ''} ${completedLessons.includes(2) ? 'completed' : ''}`} onClick={() => handleLessonClick(2)}>
            <h3>Lesson 2</h3><p>Posture & Hands</p>
            {completedLessons.includes(2) && <span className="checkmark">✔️</span>}
          </div>
          <div className="arrow-right"></div>
          <div id="lesson-box-3" className={`lesson-box ${isLocked(3) ? 'locked' : ''} ${completedLessons.includes(3) ? 'completed' : ''}`} onClick={() => handleLessonClick(3)}>
            <h3>Lesson 3</h3><p>Notes & Fingers</p>
            {isLocked(3) && <span className="lock-icon">🔒</span>}
            {completedLessons.includes(3) && <span className="checkmark">✔️</span>}
          </div>
        </div>
        <div className="vertical-arrow-container right"><div className="arrow-down"></div></div>

        {/* ROW 2: 6, 5, 4 */}
        <div className="lesson-row-bottom">
          <div id="lesson-box-6" className={`lesson-box ${isLocked(6) ? 'locked' : ''} ${completedLessons.includes(6) ? 'completed' : ''}`} onClick={() => handleLessonClick(6)}>
            <h3>Lesson 6</h3><p>The Grand Staff</p>
            {isLocked(6) && <span className="lock-icon">🔒</span>}
            {completedLessons.includes(6) && <span className="checkmark">✔️</span>}
          </div>
          <div className="arrow-left"></div>
          <div id="lesson-box-5" className={`lesson-box ${isLocked(5) ? 'locked' : ''} ${completedLessons.includes(5) ? 'completed' : ''}`} onClick={() => handleLessonClick(5)}>
            <h3>Lesson 5</h3><p>Basic Rhythm</p>
            {isLocked(5) && <span className="lock-icon">🔒</span>}
            {completedLessons.includes(5) && <span className="checkmark">✔️</span>}
          </div>
          <div className="arrow-left"></div>
          <div id="lesson-box-4" className={`lesson-box ${isLocked(4) ? 'locked' : ''} ${completedLessons.includes(4) ? 'completed' : ''}`} onClick={() => handleLessonClick(4)}>
            <h3>Lesson 4</h3><p>Review & Practice</p>
            {isLocked(4) && <span className="lock-icon">🔒</span>}
            {completedLessons.includes(4) && <span className="checkmark">✔️</span>}
          </div>
        </div>
        <div className="vertical-arrow-container left"><div className="arrow-down"></div></div>

        {/* ROW 3: 7, 8, 9 */}
        <div className="lesson-row-top">
          <div id="lesson-box-7" className={`lesson-box ${isLocked(7) ? 'locked' : ''} ${completedLessons.includes(7) ? 'completed' : ''}`} onClick={() => handleLessonClick(7)}>
            <h3>Lesson 7</h3><p>Treble Clef Notes</p>
            {isLocked(7) && <span className="lock-icon">🔒</span>}
            {completedLessons.includes(7) && <span className="checkmark">✔️</span>}
          </div>
          <div className="arrow-right"></div>
          <div id="lesson-box-8" className={`lesson-box ${isLocked(8) ? 'locked' : ''} ${completedLessons.includes(8) ? 'completed' : ''}`} onClick={() => handleLessonClick(8)}>
            <h3>Lesson 8</h3><p>Bass Clef Notes</p>
            {isLocked(8) && <span className="lock-icon">🔒</span>}
            {completedLessons.includes(8) && <span className="checkmark">✔️</span>}
          </div>
          <div className="arrow-right"></div>
          <div id="lesson-box-9" className={`lesson-box ${isLocked(9) ? 'locked' : ''} ${completedLessons.includes(9) ? 'completed' : ''}`} onClick={() => handleLessonClick(9)}>
            <h3>Lesson 9</h3><p>Intervals (2nds/3rds)</p>
            {isLocked(9) && <span className="lock-icon">🔒</span>}
            {completedLessons.includes(9) && <span className="checkmark">✔️</span>}
          </div>
        </div>
        <div className="vertical-arrow-container right"><div className="arrow-down"></div></div>

        {/* ROW 4: 12, 11, 10 */}
        <div className="lesson-row-bottom">
          <div id="lesson-box-12" className={`lesson-box ${isLocked(12) ? 'locked' : ''} ${completedLessons.includes(12) ? 'completed' : ''}`} onClick={() => handleLessonClick(12)}>
            <h3>Lesson 12</h3><p>Dynamic: Forte</p>
            {isLocked(12) && <span className="lock-icon">🔒</span>}
            {completedLessons.includes(12) && <span className="checkmark">✔️</span>}
          </div>
          <div className="arrow-left"></div>
          <div id="lesson-box-11" className={`lesson-box ${isLocked(11) ? 'locked' : ''} ${completedLessons.includes(11) ? 'completed' : ''}`} onClick={() => handleLessonClick(11)}>
            <h3>Lesson 11</h3><p>Dynamic: Piano</p>
            {isLocked(11) && <span className="lock-icon">🔒</span>}
            {completedLessons.includes(11) && <span className="checkmark">✔️</span>}
          </div>
          <div className="arrow-left"></div>
          <div id="lesson-box-10" className={`lesson-box ${isLocked(10) ? 'locked' : ''} ${completedLessons.includes(10) ? 'completed' : ''}`} onClick={() => handleLessonClick(10)}>
            <h3>Lesson 10</h3><p>Hands Together</p>
            {isLocked(10) && <span className="lock-icon">🔒</span>}
            {completedLessons.includes(10) && <span className="checkmark">✔️</span>}
          </div>
        </div>
        <div className="vertical-arrow-container left"><div className="arrow-down"></div></div>

        {/* ROW 5: 13, 14, 15 */}
        <div className="lesson-row-top">
          <div id="lesson-box-13" className={`lesson-box ${isLocked(13) ? 'locked' : ''} ${completedLessons.includes(13) ? 'completed' : ''}`} onClick={() => handleLessonClick(13)}>
            <h3>Lesson 13</h3><p>Mezzo markings</p>
            {isLocked(13) && <span className="lock-icon">🔒</span>}
            {completedLessons.includes(13) && <span className="checkmark">✔️</span>}
          </div>
          <div className="arrow-right"></div>
          <div id="lesson-box-14" className={`lesson-box ${isLocked(14) ? 'locked' : ''} ${completedLessons.includes(14) ? 'completed' : ''}`} onClick={() => handleLessonClick(14)}>
            <h3>Lesson 14</h3><p>Sustain Pedal</p>
            {isLocked(14) && <span className="lock-icon">🔒</span>}
            {completedLessons.includes(14) && <span className="checkmark">✔️</span>}
          </div>
          <div className="arrow-right"></div>
          <div id="lesson-box-15" className={`lesson-box ${isLocked(15) ? 'locked' : ''} ${completedLessons.includes(15) ? 'completed' : ''}`} onClick={() => handleLessonClick(15)}>
            <h3>Lesson 15</h3><p>Pedal Timing</p>
            {isLocked(15) && <span className="lock-icon">🔒</span>}
            {completedLessons.includes(15) && <span className="checkmark">✔️</span>}
          </div>
        </div>
        <div className="vertical-arrow-container right"><div className="arrow-down"></div></div>

        {/* ROW 6: 18, 17, 16 */}
        <div className="lesson-row-bottom">
          <div id="lesson-box-18" className={`lesson-box ${isLocked(18) ? 'locked' : ''} ${completedLessons.includes(18) ? 'completed' : ''}`} onClick={() => handleLessonClick(18)}>
            <h3>Lesson 18</h3><p>Sight-Reading Tips</p>
            {isLocked(18) && <span className="lock-icon">🔒</span>}
            {completedLessons.includes(18) && <span className="checkmark">✔️</span>}
          </div>
          <div className="arrow-left"></div>
          <div id="lesson-box-17" className={`lesson-box ${isLocked(17) ? 'locked' : ''} ${completedLessons.includes(17) ? 'completed' : ''}`} onClick={() => handleLessonClick(17)}>
            <h3>Lesson 17</h3><p>Mixed Dynamics</p>
            {isLocked(17) && <span className="lock-icon">🔒</span>}
            {completedLessons.includes(17) && <span className="checkmark">✔️</span>}
          </div>
          <div className="arrow-left"></div>
          <div id="lesson-box-16" className={`lesson-box ${isLocked(16) ? 'locked' : ''} ${completedLessons.includes(16) ? 'completed' : ''}`} onClick={() => handleLessonClick(16)}>
            <h3>Lesson 16</h3><p>Legato & Staccato</p>
            {isLocked(16) && <span className="lock-icon">🔒</span>}
            {completedLessons.includes(16) && <span className="checkmark">✔️</span>}
          </div>
        </div>
        <div className="vertical-arrow-container left"><div className="arrow-down"></div></div>

        {/* ROW 7: 19, 20, Test 1 */}
        <div className="lesson-row-top">
          <div id="lesson-box-19" className={`lesson-box ${isLocked(19) ? 'locked' : ''} ${completedLessons.includes(19) ? 'completed' : ''}`} onClick={() => handleLessonClick(19)}>
            <h3>Lesson 19</h3><p>Ledger Lines</p>
            {isLocked(19) && <span className="lock-icon">🔒</span>}
            {completedLessons.includes(19) && <span className="checkmark">✔️</span>}
          </div>
          <div className="arrow-right"></div>
          <div id="lesson-box-20" className={`lesson-box ${isLocked(20) ? 'locked' : ''} ${completedLessons.includes(20) ? 'completed' : ''}`} onClick={() => handleLessonClick(20)}>
            <h3>Lesson 20</h3><p>Sheet Music Recap</p>
            {isLocked(20) && <span className="lock-icon">🔒</span>}
            {completedLessons.includes(20) && <span className="checkmark">✔️</span>}
          </div>
          <div className="arrow-right"></div>
          <div id="lesson-box-section1test" className={`lesson-box final-test ${isLocked('section1test') ? 'locked' : ''} ${completedLessons.includes('section1test') ? 'completed' : ''}`} onClick={() => handleLessonClick('section1test')}>
            <h3>S1 Test</h3>
            {isLocked('section1test') && <span className="lock-icon">🔒</span>}
            {completedLessons.includes('section1test') && <span className="checkmark">✔️</span>}
          </div>
        </div>

        {/* --- SECTION 2 --- */}
        <div className="section-divider">
            <div className="divider-line"></div>
            <div className="divider-icon">🎹</div>
            <div className="divider-line"></div>
        </div>

        <div className="section-header-box">
          <h2 className="section-title">Section 2: Musical Artistry & Theory</h2>
        </div>

        {/* Row 8: 21, 22, 23 */}
        <div className="lesson-row-top">
          <div id="lesson-box-21" className={`lesson-box ${isLocked(21) ? 'locked' : ''} ${completedLessons.includes(21) ? 'completed' : ''}`} onClick={() => handleLessonClick(21)}>
            <h3>Lesson 21</h3><p>C Major Scale</p>
            {isLocked(21) && <span className="lock-icon">🔒</span>}
            {completedLessons.includes(21) && <span className="checkmark">✔️</span>}
          </div>
          <div className="arrow-right"></div>
          <div id="lesson-box-22" className={`lesson-box ${isLocked(22) ? 'locked' : ''} ${completedLessons.includes(22) ? 'completed' : ''}`} onClick={() => handleLessonClick(22)}>
            <h3>Lesson 22</h3><p>Primary Chords</p>
            {isLocked(22) && <span className="lock-icon">🔒</span>}
            {completedLessons.includes(22) && <span className="checkmark">✔️</span>}
          </div>
          <div className="arrow-right"></div>
          <div id="lesson-box-23" className={`lesson-box ${isLocked(23) ? 'locked' : ''} ${completedLessons.includes(23) ? 'completed' : ''}`} onClick={() => handleLessonClick(23)}>
            <h3>Lesson 23</h3><p>Sharps & Flats</p>
            {isLocked(23) && <span className="lock-icon">🔒</span>}
            {completedLessons.includes(23) && <span className="checkmark">✔️</span>}
          </div>
        </div>
        <div className="vertical-arrow-container right"><div className="arrow-down"></div></div>

        {/* Row 9: 26, 25, 24 */}
        <div className="lesson-row-bottom">
          <div id="lesson-box-26" className={`lesson-box ${isLocked(26) ? 'locked' : ''} ${completedLessons.includes(26) ? 'completed' : ''}`} onClick={() => handleLessonClick(26)}>
            <h3>Lesson 26</h3><p>Crescendo</p>
            {isLocked(26) && <span className="lock-icon">🔒</span>}
            {completedLessons.includes(26) && <span className="checkmark">✔️</span>}
          </div>
          <div className="arrow-left"></div>
          <div id="lesson-box-25" className={`lesson-box ${isLocked(25) ? 'locked' : ''} ${completedLessons.includes(25) ? 'completed' : ''}`} onClick={() => handleLessonClick(25)}>
            <h3>Lesson 25</h3><p>8th Note Rhythms</p>
            {isLocked(25) && <span className="lock-icon">🔒</span>}
            {completedLessons.includes(25) && <span className="checkmark">✔️</span>}
          </div>
          <div className="arrow-left"></div>
          <div id="lesson-box-24" className={`lesson-box ${isLocked(24) ? 'locked' : ''} ${completedLessons.includes(24) ? 'completed' : ''}`} onClick={() => handleLessonClick(24)}>
            <h3>Lesson 24</h3><p>Key Signatures</p>
            {isLocked(24) && <span className="lock-icon">🔒</span>}
            {completedLessons.includes(24) && <span className="checkmark">✔️</span>}
          </div>
        </div>
        <div className="vertical-arrow-container left"><div className="arrow-down"></div></div>

        {/* Row 10: 27, 28, 29 */}
        <div className="lesson-row-top">
          <div id="lesson-box-27" className={`lesson-box ${isLocked(27) ? 'locked' : ''} ${completedLessons.includes(27) ? 'completed' : ''}`} onClick={() => handleLessonClick(27)}>
            <h3>Lesson 27</h3><p>Diminuendo</p>
            {isLocked(27) && <span className="lock-icon">🔒</span>}
            {completedLessons.includes(27) && <span className="checkmark">✔️</span>}
          </div>
          <div className="arrow-right"></div>
          <div id="lesson-box-28" className={`lesson-box ${isLocked(28) ? 'locked' : ''} ${completedLessons.includes(28) ? 'completed' : ''}`} onClick={() => handleLessonClick(28)}>
            <h3>Lesson 28</h3><p>A Minor Scale</p>
            {isLocked(28) && <span className="lock-icon">🔒</span>}
            {completedLessons.includes(28) && <span className="checkmark">✔️</span>}
          </div>
          <div className="arrow-right"></div>
          <div id="lesson-box-29" className={`lesson-box ${isLocked(29) ? 'locked' : ''} ${completedLessons.includes(29) ? 'completed' : ''}`} onClick={() => handleLessonClick(29)}>
            <h3>Lesson 29</h3><p>The Una Corda</p>
            {isLocked(29) && <span className="lock-icon">🔒</span>}
            {completedLessons.includes(29) && <span className="checkmark">✔️</span>}
          </div>
        </div>
        <div className="vertical-arrow-container right"><div className="arrow-down"></div></div>

        {/* Row 11: 32, 31, 30 */}
        <div className="lesson-row-bottom">
          <div id="lesson-box-32" className={`lesson-box ${isLocked(32) ? 'locked' : ''} ${completedLessons.includes(32) ? 'completed' : ''}`} onClick={() => handleLessonClick(32)}>
            <h3>Lesson 32</h3><p>Slurs & Phrasing</p>
            {isLocked(32) && <span className="lock-icon">🔒</span>}
            {completedLessons.includes(32) && <span className="checkmark">✔️</span>}
          </div>
          <div className="arrow-left"></div>
          <div id="lesson-box-31" className={`lesson-box ${isLocked(31) ? 'locked' : ''} ${completedLessons.includes(31) ? 'completed' : ''}`} onClick={() => handleLessonClick(31)}>
            <h3>Lesson 31</h3><p>Relative Minors</p>
            {isLocked(31) && <span className="lock-icon">🔒</span>}
            {completedLessons.includes(31) && <span className="checkmark">✔️</span>}
          </div>
          <div className="arrow-left"></div>
          <div id="lesson-box-30" className={`lesson-box ${isLocked(30) ? 'locked' : ''} ${completedLessons.includes(30) ? 'completed' : ''}`} onClick={() => handleLessonClick(30)}>
            <h3>Lesson 30</h3><p>Finger Crossings</p>
            {isLocked(30) && <span className="lock-icon">🔒</span>}
            {completedLessons.includes(30) && <span className="checkmark">✔️</span>}
          </div>
        </div>
        <div className="vertical-arrow-container left"><div className="arrow-down"></div></div>

        {/* Row 12: 33, 34, 35 */}
        <div className="lesson-row-top">
          <div id="lesson-box-33" className={`lesson-box ${isLocked(33) ? 'locked' : ''} ${completedLessons.includes(33) ? 'completed' : ''}`} onClick={() => handleLessonClick(33)}>
            <h3>Lesson 33</h3><p>Arpeggios</p>
            {isLocked(33) && <span className="lock-icon">🔒</span>}
            {completedLessons.includes(33) && <span className="checkmark">✔️</span>}
          </div>
          <div className="arrow-right"></div>
          <div id="lesson-box-34" className={`lesson-box ${isLocked(34) ? 'locked' : ''} ${completedLessons.includes(34) ? 'completed' : ''}`} onClick={() => handleLessonClick(34)}>
            <h3>Lesson 34</h3><p>Dotted 8ths</p>
            {isLocked(34) && <span className="lock-icon">🔒</span>}
            {completedLessons.includes(34) && <span className="checkmark">✔️</span>}
          </div>
          <div className="arrow-right"></div>
          <div id="lesson-box-35" className={`lesson-box ${isLocked(35) ? 'locked' : ''} ${completedLessons.includes(35) ? 'completed' : ''}`} onClick={() => handleLessonClick(35)}>
            <h3>Lesson 35</h3><p>Accent Marks</p>
            {isLocked(35) && <span className="lock-icon">🔒</span>}
            {completedLessons.includes(35) && <span className="checkmark">✔️</span>}
          </div>
        </div>
        <div className="vertical-arrow-container right"><div className="arrow-down"></div></div>

        {/* Row 13: 38, 37, 36 */}
        <div className="lesson-row-bottom">
          <div id="lesson-box-38" className={`lesson-box ${isLocked(38) ? 'locked' : ''} ${completedLessons.includes(38) ? 'completed' : ''}`} onClick={() => handleLessonClick(38)}>
            <h3>Lesson 38</h3><p>Compound Time</p>
            {isLocked(38) && <span className="lock-icon">🔒</span>}
            {completedLessons.includes(38) && <span className="checkmark">✔️</span>}
          </div>
          <div className="arrow-left"></div>
          <div id="lesson-box-37" className={`lesson-box ${isLocked(37) ? 'locked' : ''} ${completedLessons.includes(37) ? 'completed' : ''}`} onClick={() => handleLessonClick(37)}>
            <h3>Lesson 37</h3><p>Syncopation</p>
            {isLocked(37) && <span className="lock-icon">🔒</span>}
            {completedLessons.includes(37) && <span className="checkmark">✔️</span>}
          </div>
          <div className="arrow-left"></div>
          <div id="lesson-box-36" className={`lesson-box ${isLocked(36) ? 'locked' : ''} ${completedLessons.includes(36) ? 'completed' : ''}`} onClick={() => handleLessonClick(36)}>
            <h3>Lesson 36</h3><p>6/8 Time</p>
            {isLocked(36) && <span className="lock-icon">🔒</span>}
            {completedLessons.includes(36) && <span className="checkmark">✔️</span>}
          </div>
        </div>
        <div className="vertical-arrow-container left"><div className="arrow-down"></div></div>

        {/* ROW 14: 39, 40, Final Test */}
        <div className="lesson-row-top">
          <div id="lesson-box-39" className={`lesson-box ${isLocked(39) ? 'locked' : ''} ${completedLessons.includes(39) ? 'completed' : ''}`} onClick={() => handleLessonClick(39)}>
            <h3>Lesson 39</h3><p>Improvisation</p>
            {isLocked(39) && <span className="lock-icon">🔒</span>}
            {completedLessons.includes(39) && <span className="checkmark">✔️</span>}
          </div>
          <div className="arrow-right"></div>
          <div id="lesson-box-40" className={`lesson-box ${isLocked(40) ? 'locked' : ''} ${completedLessons.includes(40) ? 'completed' : ''}`} onClick={() => handleLessonClick(40)}>
            <h3>Lesson 40</h3><p>Classical Eras</p>
            {isLocked(40) && <span className="lock-icon">🔒</span>}
            {completedLessons.includes(40) && <span className="checkmark">✔️</span>}
          </div>
          <div className="arrow-right"></div>
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

export default Piano;