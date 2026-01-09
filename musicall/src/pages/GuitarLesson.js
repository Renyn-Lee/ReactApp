// pages/GuitarLesson.js
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import './GuitarLessons.css';
import { useUser } from '@clerk/clerk-react';

const guitarLessonData = {
  1: {
    title: "Lesson 1:",
    description: "Getting Started & Anatomy",
    customClass: "lesson-one",
    content: `
      <h2>Welcome to the Guitar! Here are cool facts to start.</h2>
      <h3>Did you know?</h3>
      <ul>
        <li>The six strings exert over 150-200 lbs of pressure on the neck!</li>
        <li>Before steel, strings were made from "catgut" (sheep intestines).</li>
        <li>Leo Fender, creator of the Stratocaster, couldn't actually play guitar!</li>
      </ul>
      <hr/>
      <h2>The Setup of a Guitar</h2>
      <p>

[Image of guitar parts: Headstock, Frets, Body, Bridge]
</p>
      
      <h3>Tuning Pegs</h3>
      <p>Used to tighten or loosen strings to change their pitch.</p>

      <h3>Frets</h3>
      <p>Metal strips that divide the neck. Pressing behind them changes the note.</p>

      <h3>Acoustic vs. Electric</h3>
      <p><strong>Acoustic:</strong> Uses a hollow body to amplify sound naturally.</p>
      <p><strong>Electric:</strong> Uses "pickups" (magnets) to send a signal to an amp.</p>
      
      <hr/>
      <h2>String Names</h2>
      <p></p>
      <h3>The strings from thickest to thinnest are: <strong>E A D G B e</strong>.</h3>
      <p>Mnemonic: <strong>E</strong>ddy <strong>A</strong>te <strong>D</strong>ynamite, <strong>G</strong>ood <strong>B</strong>ye <strong>E</strong>ddy.</p>

      <h2>Posture & Holding a Pick</h2>
      <h3>Hold the pick between your thumb and the side of your index finger. Keep your wrist loose and try a few down-strokes on the thickest string (Low E).</h3>
      <hr/>
      <h2>Optional Homework:</h2>
      <ul>
        <li>Memorize the string names using the mnemonic.</li>
        <li>Practice 5 minutes of steady down-strokes on the open strings.</li>
      </ul>
    `,
    backgroundColor: "#D09691"
  },
  2: {
    title: "Lesson 2:", 
    description: "Rhythm & Tablature",
    customClass: "lesson-two",
    content: `
      <h2>Rhythm Basics</h2>
      <h3>Use a metronome (there's one at the bottom of the screen). Count "1 - 2 - 3 - 4" and play a down-stroke (this is a downward motion strum) on the Low E string for every beat. This is called a quarter note.</h3>
      
      <hr/>
      <h2>Reading Tablature (TAB)</h2>
      <p></p>
      <h3>TAB has 6 lines (the strings). A number on a line tells you which fret to press.</h3>
      <p><strong>Example:</strong> A "2" on the 3rd line means play the 2nd fret of the D string.</p>

      <hr/>
      <h2>Fretting Hand Technique</h2>
      <p></p>
      <h3>Use your <strong>fingertips</strong>. Press down just behind the metal fret wire. If it buzzes, press a little harder or move closer to the fret!</h3>

      <hr/>
      <h2>The 1-2-3-4 Exercise</h2>
      <h3>Play fret 1, then 2, then 3, then 4 on the same string using four different fingers. This builds strength!</h3>
      <p>The beginning of your journey may cause pain in your finger, if that is the case, take a break. You'll develop calluses in around a week or two.</p>
      
      <hr/>
      <h2>Optional Homework:</h2>
      <ul>
        <li>Practice the 1-2-3-4 exercise for 5 minutes a day.</li>
        <li>Try to play a simple "0 - 2 - 4" pattern on the D string perfectly in time with a beat.</li>
      </ul>
    `,
    backgroundColor: "#D09691"
  },
  3: {
    title: "Lesson 3:",
    description: "The First Chords (Em, Cmaj7 & Am)",
    customClass: "guitar-lesson-three",
    content: `
      <h2>The Easy Duo</h2>
      <h3>Three of the easiest chords: <strong>E minor (Em)</strong>, <strong>C Major 7 (Cmaj7)</strong>, and <strong>A minor (Am)</strong></h3>
      <h3>Try to focus on arching the fingers so your fingertips press the strings cleanly and not muting adjacent strings. Don't worry about going fast; take time to place each finger and let the chord ring before moving on.</h3>
      <h3><strong>Em fingering:</strong> 0-2-2-0-0-0 (low to high). Place the middle and ring fingers on the 2nd fret of the A and D strings.</h3>
      <h3><strong>Cmaj7 fingering:</strong> X-3-2-0-0-0 — place the ring finger on the 3rd fret of the A string and the middle finger on the 2nd fret of the D string; the low E is muted (X).</h3>
      <h3><strong>Am fingering:</strong> X-0-2-2-0-0 — place the middle finger on the 2nd fret of the D string and the ring finger on the 2nd fret of the B string; the low E is muted (X).</h3>
      <p> With muted strings marked as "X", you shouldn't hear them. it's up to you how you want to mute the string.</p>
      <hr></hr>

      <h2>Chord Transitions</h2>
      <h3>The hardest part is switching smoothly between chords. Practice moving from Em to Cmaj, spending four beats on each chord (count "1-2-3-4" on each). </h3>
      <p>Use the concept of <em>anchor fingers</em> — notice which fingers stay in place or move minimally when switching.</p>
      <h3>For Em → Cmaj7: keep your middle finger close to the D string when you move your ring finger to the A string; this will make transitioning smoother.</h3>

      <hr></hr>
      <h2>Core Chords (The G, C, D Group)</h2>
      <h3>Next are the three common chords used in many songs: G Major, C Major, and D Major. Practice each slowly and watch for muted strings.</h3>
      <h3><strong>G Major:</strong> 3-2-0-0-0-3 — fingers: middle on A2, index on E2 (or alternative fingerings). Avoid muting higher strings.</h3>
      <h3><strong>C Major:</strong> X-3-2-0-1-0 — ring finger on A3, middle finger on D2, index finger on B1; low E muted (X).</h3>
      <h3><strong>D Major:</strong> X-X-0-2-3-2 — fingers: index on G2, middle on E2, ring on B3; avoid hitting the low E and A strings (mark them X).</h3>

      <hr></hr>
      <h2>Basic Strumming Patterns</h2>
      <h3>Pattern 1: <strong>D D D D</strong> — downstroke on every beat (counts: 1 2 3 4). Keep the strumming hand moving with a steady down motion on each count.</h3>
      <h3>Pattern 2: <strong>D D U U D U</strong> (written as D DU UDU) — count with the rhythm and keep the wrist moving constantly even on the up-beats where you may not hit the strings.</h3>
      <h3>Practice: play Em for four beats using Pattern 1, then switch to Cmaj7 for four beats using the same pattern. Repeat slowly until changes feel natural.</h3>
      <p>As you get into the rhythm, try to relax your wrists as a common issue with beginners is keeping an overly tense wrist and  only using their arms to strum.</p>
    `,
    backgroundColor: "#D09691"
  },
  // Placeholders for remaining lessons
  4: { title: "Lesson 4:", description: "The G and D Chords", customClass: "guitar-lesson-four", content: `<h2>Content Coming Soon</h2>`, backgroundColor: "#D09691" },
  5: { title: "Lesson 5:", description: "Strumming Patterns", customClass: "guitar-lesson-five", content: `<h2>Content Coming Soon</h2>`, backgroundColor: "#D09691" },
  6: { title: "Lesson 6:", description: "Chord Progressions", customClass: "guitar-lesson-six", content: `<h2>Content Coming Soon</h2>`, backgroundColor: "#D09691" },
  7: { title: "Lesson 7:", description: "Your First Song", customClass: "guitar-lesson-seven", content: `<h2>Content Coming Soon</h2>`, backgroundColor: "#D09691" },
  8: { title: "Lesson 8:", description: "A Minor & Dynamics", customClass: "guitar-lesson-eight", content: `<h2>Content Coming Soon</h2>`, backgroundColor: "#D09691" },
  9: { title: "Lesson 9:", description: "The Simplified F Chord", customClass: "guitar-lesson-nine", content: `<h2>Content Coming Soon</h2>`, backgroundColor: "#D09691" },
  10: { title: "Lesson 10:", description: "Final Review", customClass: "guitar-lesson-ten", content: `<h2>Content Coming Soon</h2>`, backgroundColor: "#D09691" },
  test1: { title: "Optional Test", description: "Basics Quiz", customClass: "guitar-lesson-test", content: `<h2>Coming Soon</h2>`, backgroundColor: "#D09691" }
};

function GuitarLesson() {
  const { lessonId } = useParams();
  const navigate = useNavigate();
  const { isLoaded, isSignedIn, user } = useUser();
  
  const lessonKey = isNaN(lessonId) ? lessonId : Number(lessonId);
  const lesson = guitarLessonData[lessonKey];

  useEffect(() => {
    window.scrollTo(0, 0);
    if (lesson) {
      document.body.style.backgroundColor = lesson.backgroundColor;
    }
    return () => {
      document.body.style.backgroundColor = '';
    };
  }, [lesson]);

  const handleCompleteLesson = async () => {
    console.log('=== GUITAR LESSON SAVE DEBUG ===');
    console.log('lessonId from URL:', lessonId);
    console.log('lessonVal (converted):', isNaN(lessonId) ? lessonId : Number(lessonId));
    console.log('isLoaded:', isLoaded);
    console.log('isSignedIn:', isSignedIn);
    
    if (isLoaded && isSignedIn && user) {
      try {
        const currentLessons = user.unsafeMetadata.completedGuitarLessons || [];
        const lessonVal = isNaN(lessonId) ? lessonId : Number(lessonId);

        console.log('Current completed lessons:', currentLessons);
        console.log('Already includes this lesson?', currentLessons.includes(lessonVal));

        // Update Clerk Metadata if not already completed
        if (!currentLessons.includes(lessonVal)) {
          const updatedLessons = [...currentLessons, lessonVal];
          console.log('Saving to Clerk:', updatedLessons);
          
          await user.update({
            unsafeMetadata: {
              ...user.unsafeMetadata,
              completedGuitarLessons: updatedLessons
            }
          });
          
          console.log('✅ Save successful!');
        } else {
          console.log('⚠️ Lesson already completed, skipping save');
        }
      } catch (err) {
        console.error("❌ Error saving lesson progress:", err);
      }
    } else {
      console.log('❌ Cannot save - not loaded or not signed in');
    }
    
    navigate('/guitar', { state: { fromLesson: true } });
  };

  if (!lesson) {
    return (
      <div className="guitar-lesson-container">
        <h1>Lesson not found</h1>
        <Link to="/guitar" className="guitar-back-button">← Back to Roadmap</Link>
      </div>
    );
  }

  return (
    <div className={`guitar-lesson-container ${lesson.customClass || ''}`}>
      <Link to="/guitar" className="guitar-back-button">← Back to Roadmap</Link>
      
      <h1 className="guitar-lesson-title">{lesson.title}</h1>
      <p className="guitar-lesson-description">{lesson.description}</p>
      <div className="guitar-lesson-content" dangerouslySetInnerHTML={{ __html: lesson.content }}/>
      
      <button onClick={handleCompleteLesson} className="guitar-back-button bottom-button">
        Finish Lesson & Return to Roadmap
      </button>
    </div>
  );
}

export default GuitarLesson;