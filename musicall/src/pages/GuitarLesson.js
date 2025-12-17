// pages/GuitarLesson.js
import { useParams, Link } from 'react-router-dom';
import { useEffect } from 'react';
import './GuitarLessons.css';

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
    backgroundColor: "#dc9089"
  },
  2: {
    title: "Lesson 2:", 
    description: "Rhythm & Tablature",
    customClass: "lesson-two",
    content: `
      <h2>Recap: Let's get moving!</h2>
      <hr/>
      <h2>Rhythm Basics</h2>
      <h3>Use a metronome. Count "1 - 2 - 3 - 4" and play a down-stroke on the Low E string for every beat. This is called a quarter note.</h3>
      
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
      
      <hr/>
      <h2>Optional Homework:</h2>
      <ul>
        <li>Practice the 1-2-3-4 exercise for 5 minutes a day.</li>
        <li>Try to play a simple "0 - 2 - 4" pattern on the D string perfectly in time with a beat.</li>
      </ul>
    `,
    backgroundColor: "#E5D8CE"
  },
  // Placeholders for remaining lessons
  3: { title: "Lesson 3:", description: "The First Chords (Em & Cmaj7)", customClass: "guitar-lesson-three", content: `<h2>Content Coming Soon</h2>`, backgroundColor: "#D09691" },
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
  const lesson = guitarLessonData[lessonId];

  useEffect(() => {
    window.scrollTo(0, 0);
    if (lesson) {
      document.body.style.backgroundColor = lesson.backgroundColor;
    }
    return () => {
      document.body.style.backgroundColor = '';
    };
  }, [lesson]);

  if (!lesson) {
    return (
      <div className="guitar-lesson-container">
        <h1>Lesson not found</h1>
        <Link to="/guitar" className="back-button">← Back to Roadmap</Link>
      </div>
    );
  }

  return (
    <div className={`guitar-lesson-container ${lesson.customClass || ''}`}>
      <Link to="/guitar" className="back-button">← Back to Roadmap</Link>
      
      <h1 className="guitar-lesson-title">{lesson.title}</h1>
      <p className="guitar-lesson-description">{lesson.description}</p>
      <div className="guitar-lesson-content" dangerouslySetInnerHTML={{ __html: lesson.content }}/>
      
      <Link to="/guitar" className="back-button bottom-button">← Back to Roadmap</Link>
    </div>
  );
}

export default GuitarLesson;