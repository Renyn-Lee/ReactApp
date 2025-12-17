// pages/Lesson.js
import { useParams, Link } from 'react-router-dom';
import { useEffect } from 'react';
import './Lessons.css';

const lessonData = {
  1: {
    title: "Lesson 1:",
    description: "Getting Started",
    customClass: "lesson-one",
    content: `
  <h2>Welcome to the Guitar! Here are cool facts to start.</h2>
    <h2>Did you know?</h2>
    <p>(you can skip this if you want)</p>
    <ul>
    <li>The six strings on a standard guitar exert a massive amount of tension on the neck sometimes over 150 to 200 pounds of pressure! This is why guitar necks have internal metal rods to keep them from bending.</li>
    <li>Before modern nylon and steel, guitar-like instruments were strung with "catgut," which was made from the dried, twisted intestines of animals like sheep.</li>
    <li>Playing the guitar can improve cognitive skills, memory, and coordination.</li>
    </ul>
    <hr></hr>
    <h2>Before Starting</h2>
    <h3> The basic idea of this lesson is to get comfortable holding the guitar, learn the names of the strings, and practice simple picking with a pick.</h3>
    <h3> This is the beginning of your guitar journey, so try not to stress too much as this stuff will become familiar with time.</h3>
    <hr></hr>
    <h2>The Setup of a Guitar</h2>
    
    <h3>Tuning Pegs</h3>
    <h3>Tuning pegs (machine heads) increase or decrease tension in the strings so the pitch changes. Turning a peg tightens a string to raise pitch or loosens it to lower pitch. Precise tuning keeps the instrument in tune across the fretboard.</h3>

    <h3>Frets</h3>
    <h3>Frets are the metal strips on the neck that divide the fingerboard into semitone intervals. Pressing a string down behind a fret shortens its vibrating length and raises the note allowing you to play different notes and form chords.</h3>

    <h3>Body</h3>
    <h3>The body supports the neck and bridge and shapes the instrument's tone on an Acoustic guitar.</h3>

    <h3>Acoustic vs. Electric</h3>
    <h3><strong>Acoustic:</strong> Hollow body with a soundhole that amplifies vibrations. Tone depends heavily on wood, body size, and soundboard.</h3>
    <h3><strong>Electric:</strong> Usually a solid or semi-hollow body that produces little acoustic volume. Magnetic or piezo pickups convert string vibrations into electrical signals, which are shaped by amps and effects. Pickups and electronics play a bigger role in tone.</h3>

     

    
    <hr></hr>
     <h2>Posture & Stability</h2>
      <h3>Focus on comfort and stability. Use a strap when standing or rest the guitar on your leg with the neck angled up slightly. Keep your back straight, shoulders relaxed, and the instrument positioned so you can move freely.</h3>

      <h2>String Names</h2>
      <h3>The open string names from thickest to thinnest are: E A D G B e. A simple mnemonic is "Eddy Ate Dynamite, Good Bye Eddy." Don't stress about memorizing this — familiarity comes with repetition.</h3>

      <h2>Holding a Pick & Basic Picking</h2>
      <p>(there are many different ways to pluck strings but for now we will focus on using a pick as it is the most common way to play guitar.)</p>
      <h3>Hold a pick with a firm but relaxed grip between the thumb and index finger. Practice simple, strumming(up and down motion) on the open 6th (low E) string. Keep the wrist loose and focus on steady timing rather than speed; consistency builds control.</h3>
    <hr></hr>
    
    <h2>Optional Homework:</h2>
    <h3>recite the mnemonic "Eddy Ate Dynamite, Good Bye Eddy" to remember the string names.</h3>
    <h3>get used to holding a pick and practicing simple strumming with the guitar to get used to a pick. (if using one)</h3>
    <h3>Have fun and enjoy your musical journey!</h3>
    <hr></hr>
    `,
    backgroundColor: "#dc9089"
  },
  2: {
    title: "Lesson 2:", 
    description: "Posture & Hand Positioning",
    customClass: "lesson-two",
    content: `
    <h2>Recap from last lesson:</h2>
    <hr></hr>
    <h2>"The only time you are actually growing is when you are uncomfortable," by T. Harv Eker</h2>
    <p>Learning a new instrument can be challenging, but remember that growth happens outside of your comfort zone. Embrace the discomfort and keep pushing forward!</p>
    <hr></hr>

    <h2>Rhythm Basics</h2>
    <h3>Introduce the metronome: an essential tool for developing steady time. Count along out loud: "1-2-3-4" and set the metronome to a slow tempo. Practice playing a single note (open 6th string) exactly on each beat — quarter notes — until your timing feels consistent.</h3>
    <hr></hr>

    <h2>Reading Tablature (TAB)</h2>
    <h3>TAB uses six horizontal lines that represent the six strings. Numbers on the lines show which fret to play. Practice simple melodies from TAB, for example play 0-2-4 on the D string (open, 2nd fret, 4th fret) slowly and evenly following the beat.</h3>
    <hr></hr>

    <h2>Fretting Hand Technique</h2>
    <h3>Use the finger numbering system (1=index, 2=middle, 3=ring, 4=pinky). Press with the fingertips just behind the metal fret wire (not directly on top) to avoid fret buzz. Keep the thumb roughly behind the neck and fingers curved for clean fretting.</h3>
    <hr></hr>

    <h2>Chromatic Exercise</h2>
    <h3>Practice the 1-2-3-4 chromatic exercise on a single string using index, middle, ring, pinky in order. Start very slowly, focus on producing a clean tone from each note, and only increase speed when every note rings clearly.</h3>
    <hr></hr>

    <h2>Try:</h2>
    <h3>Sit at your piano or keyboard and practice getting into the correct posture and positioning.</h3>
    <h3>Focus on maintaining a relaxed and comfortable position while playing.</h3>
    <h3>Remember to take breaks if you feel any discomfort or tension.</h3>
    <hr></hr>
    <h2>Optional Homework:</h2>
    <h3>Practice sitting at your piano or keyboard with the correct posture.</h3>
    <h3>Play Middle C and the keys around it while maintaining proper hand position.</h3>
    <h3>Focus on developing a comfortable and relaxed playing position.</h3>
    <hr></hr>
    <h2>Keep up the great work on your musical journey!</h2>
    `,
    backgroundColor: "#E5D8CE"
  },
  3: {
    title: "Lesson 3:",
    description: "Finger Numbers & Notes",
    customClass: "lesson-three",
    content: `
   <h3>Important Note: Take It Slow</h3>
    <hr></hr>
    <h2>Quick Review: Posture & Hand Position</h2>
    <h3>Proper posture and positioning are essential for playing the piano comfortably and effectively.</h3>
    <h3>Sit on the front half of the bench (don't slouch against the back!). You need to be able to lean and move your arms freely.</h3>
    <h3>Curve your fingers slightly, as if you were gently holding a small ball. Your fingertips should make contact with the keys, not the pads of your fingers.</h3>
    <hr></hr>
    <h2>Finger Numbers, Notes, and Keys</h2>
    <h3>Each finger is assigned a number to help you read sheet music and develop correct technique.</h3>
    <ul>
    <li>Thumb = 1</li>
    <li>Index Finger = 2</li>
    <li>Middle Finger = 3</li>
    <li>Ring Finger = 4</li>
    <li>Pinky Finger = 5</li>
    </ul>
    <img src='/imgs/finger.png' alt="notes.png" />
    <h3>Using these numbers is crucial for following fingerings in sheet music and developing smooth technique.</h3>
    <h3>The piano keyboard consists of both white and black keys.</h3>
    <h3>The white keys represent the natural notes (A, B, C, D, E, F, G), while the black keys represent the sharp (#) and flat (b) notes.</h3>
    <img src='/imgs/notes.png' alt="notes.png" />
    <h3>Notice the repeating pattern of the white notes on the keyboard. The full sequence of notes (A-G) repeats every 7 keys, defining an octave.</h3>
    <hr></hr>
    <h2>Try It Now: Playing Around Middle C</h2>
    <h3>Find Middle C: Locate the C key nearest the center of your piano.</h3>
    <h3>Right Hand (Ascending): From Middle C, place your Thumb (1) and play the next five white keys to the right (C, D, E, F, G) while using the correct finger numbers.</h3>
    <h3>Left Hand (Descending): Now, using your left hand, play the six white keys to the left of Middle C (C, B, A, G, F, E).</h3>
    <h3>This step is crucial as it helps you become familiar with the layout of the keyboard and the names of the notes.</h3>
    <h3>Crucial Memorization Step: Say the names of the notes out loud as you play them to reinforce your learning.</h3>
    <p>(Play Middle C and say "C," then move up one note, play it and say "D." Continue this pattern to help with memorization)</p>
    <hr></hr>
    <h2>Optional Homework:</h2>
    <h3>Practice finding Middle C and playing the notes around it using both hands.</h3>
    <h3>Focus on maintaining proper hand position and posture while playing.</h3>
    <h3>Try to memorize the names of the notes as you play them.</h3>
    <hr></hr>
    <h2>Keep up the great work on your musical journey!</h2>
    `,
    backgroundColor: "#E5D8CE"
  },
  4: {
    title: "Lesson 4:", 
    description: "",
    customClass: "lesson-four",
    content: ``,
    backgroundColor: "#E5D8CE"
  },
  5: {
    title: "Lesson 5:",
    description: "",
    customClass: "lesson-five",
    content: ``,
    backgroundColor: "#E5D8CE"
  },
  6: {
    title: "Lesson 6:",
    description: "",
    customClass: "lesson-six",
    content: ``,
    backgroundColor: "#E5D8CE"
  },
  7: {
    title: "Lesson 7:",
    description: "",
    customClass: "lesson-seven",
    content: ``,
    backgroundColor: "#E5D8CE"
  },
  8: {
    title: "Lesson 8:",
    description: "",
    customClass: "lesson-eight",
    content: ``,
    backgroundColor: "#E5D8CE"
  },
  9: {
    title: "Lesson 9:",
    description: "",
    customClass: "lesson-nine",
    content: ``,
    backgroundColor: "#E5D8CE"
  },
  10: {
    title: "Lesson 10:",
    description: "",
    customClass: "lesson-ten",
    content: ``,
    backgroundColor: "#E5D8CE"
  },
  11: {
    title: "Lesson 11:",
    description: "",
    customClass: "lesson-eleven",
    content: ``,
    backgroundColor: "#E5D8CE"
  },
  12: {
    title: "Lesson 12:",
    description: "",
    customClass: "lesson-twelve",
    content: ``,
    backgroundColor: "#E5D8CE"
  },
  13: {
    title: "Lesson 13:",
    description: "",
    customClass: "lesson-thirteen",
    content: ``,
    backgroundColor: "#E5D8CE"
  },
  14: {
    title: "Lesson 14:",
    description: "",
    customClass: "lesson-fourteen",
    content: ``,
    backgroundColor: "#E5D8CE"
  },
  15: {
    title: "Lesson 15:",
    description: "",
    customClass: "lesson-fifteen",
    content: ``,
    backgroundColor: "#E5D8CE"
  },
  16: {
    title: "Lesson 16:",
    description: "",
    customClass: "lesson-sixteen",
    content: ``,
    backgroundColor: "#E5D8CE"
  },
  17: {
    title: "Lesson 17:",
    description: "",
    customClass: "lesson-seventeen",
    content: ``,
    backgroundColor: "#E5D8CE"
  },
  18: {
    title: "Lesson 18:",
    description: "",
    customClass: "lesson-eighteen",
    content: ``,
    backgroundColor: "#E5D8CE"
  },
  19: {
    title: "Lesson 19:",
    description: "",
    customClass: "lesson-nineteen",
    content: ``,
    backgroundColor: "#E5D8CE"
  },
  20: {
    title: "Lesson 20:",
    description: "",
    customClass: "lesson-twenty",
    content: ``,
    backgroundColor: "#E5D8CE"
  },
  test1: {
    title: "Optional Test",
    description: "",
    customClass: "lesson-test",
    content: ``,
    backgroundColor: "#E5D8CE"
  }
};

function Lesson() {
  const { lessonId } = useParams();
  const lesson = lessonData[lessonId];

  useEffect(() => {
    window.scrollTo(0, 0);
    document.body.style.backgroundColor = lesson?.backgroundColor || '#E5D8CE';
    return () => {
      document.body.style.backgroundColor = '';
    };
  }, [lesson]);

  if (!lesson) {
    return (
      <div className="lesson-container">
        <h1>Lesson not found</h1>
        <Link to="/piano" className="back-button">← Back to Roadmap</Link>
      </div>
    );
  }

  return (
    <div className={`lesson-container ${lesson.customClass || ''}`}>
      <Link to="/piano" className="back-button">← Back to Roadmap</Link>
      
      <h1 className="lesson-title">{lesson.title}</h1>
      <p className="lesson-description">{lesson.description}</p>
      <div className="lesson-content" dangerouslySetInnerHTML={{ __html: lesson.content }}/>
      
      <Link to="/piano" className="back-button bottom-button">← Back to Roadmap</Link>
    </div>
  );
}

export default Lesson;