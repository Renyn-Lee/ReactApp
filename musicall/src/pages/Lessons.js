// pages/Lesson.js
import { useParams, Link } from 'react-router-dom';
import { useEffect } from 'react';
import './Lessons.css';

const lessonData = {
  1: {
    title: "Lesson 1:",
    description: " Getting Started",
    customClass: "lesson-one",
    content: `
    <h2>Welcome to the Piano! Here is a cool facts to start. </h2>
    <h2>Did you know?</h2>
    <p>(you can skip this if you want)</p>
    <ul>
    <li> The piano was invented in Italy by Bartolomeo Cristofori around the year 1700. </li>
    <li> It is called "piano" because it can play both soft (piano) and loud (forte) sounds. </li>
    <li> The modern piano has 88 keys, consisting of 52 white keys and 36 black keys. </li>
    <li> The piano is often referred to as the "king of instruments" due to its wide range and versatility. </li>
    <li> Piano is a member of the percussion family just like drums because the sound is produced by hammers striking strings. </li>
    <li> Pianos have three pedals that can change the sound, such as sustaining notes or softening the volume. </li>
    <li> The most expensive piano ever sold was a Steinway & Sons piano that went for $3.22 million in 2013. </li>
    <li> Playing the piano can improve cognitive skills, memory, and coordination. </li>
    <li> A standard piano has 230 strings inside it. </li>
    </ul>
    <hr></hr>
    <h2>Geography of the Piano</h2>
    <h3>The piano keyboard is a map. Instead of North and South, we have High and Low.</h3>
    <h3>The left side of the keyboard produces lower-pitched sounds, while the right side produces higher-pitched sounds</h3>
    <img src='/imgs/piano.png' alt="Piano Player" />
    <h2>Try:</h2>
    <h3>Play the lowest note you can find on the left side of the keyboard.</h3>
    <h3>Now, play the highest note you can find on the right side of the keyboard.</h3>
    <h3>Notice how the sound changes as you move from left to right?</h3>
    <hr></hr>
    <h1>Middle C</h1>
    <h3> The key in red is "Middle C".</h3>
    <img src='/imgs/pianoimg.png' alt="Piano Player" />
    <h3> It is called "Middle C" because it is located near the middle of the keyboard and serves as a central reference point for musicians.</h3>
    <h3> Middle C is also described as the home note for pianists, as it is often the first note beginners learn to play and is used as a starting point for reading sheet music.</h3>
    <h3>Remember this as this is your starting point for learning!</h3>
    <h2>Try:</h2>
    <h3>Find Middle C on your keyboard and play it.</h3>
    <h3>Now, try playing the note just to the left of Middle C (B) and the note just to the right of Middle C (D).</h3>
    <h3>Notice how these notes sound in relation to Middle C?</h3>
    <hr></hr>
    <h2>Black and White Keys</h2>
    <h3>The piano keyboard consists of both white and black keys.</h3>
    <h3>The white keys represent the natural notes (A, B, C, D, E, F, G), while the black keys represent the sharp (#) and flat (b) notes.</h3>
    <p> (we will learn more about this later)</p>
    <h3>Lastly, look at the keyboard and notice the pattern of black keys.</h3>
    <h3>The black keys are arranged in groups of two and three, which helps pianists identify different notes and navigate the keyboard more easily.</h3>
    <hr></hr>
    <h2>Optional Homework:</h2>
    <h3> Practice finding Middle C and playing it multiple times throughout the day.</h3>
    <h3> Play the white keys and black keys to get familiar with their locations on the keyboard.</h3>
    <h3> Have fun and enjoy your musical journey!</h3>
    <hr></hr>
    `,
    backgroundColor: "#E5D8CE"
  },
  2: {
    title: "Lesson 2:", 
    description: "",
    customClass: "lesson-two",
    content: `
    <h2>Recap from last lesson:</h2>
    <h3> Remember how Middle C is your starting point for learning the piano? Try play Middle C again</h3>
    <h3> The piano keyboard consists of both white and black keys.</h3>
    <h3> The black keys are arranged in groups of two and three, which helps pianists identify different notes and navigate the keyboard more easily.</h3>
    <hr></hr>
    <h2>The only time you are actually growing is when you are uncomfortable," by T. Harv Eker</h2>
    <p> Learning a new instrument can be challenging, but remember that growth happens outside of your comfort zone. Embrace the discomfort and keep pushing forward!</p>
    <hr></hr>
    <h2>Posture and Positioning</h2>
    <h3> Proper posture and positioning are essential for playing the piano comfortably and effectively.</h3>
    <h3> Beginners need to learn this from the start to avoid developing bad habits that can lead to discomfort or injury later on.</h3>
    <h2> How far should you be from the piano?</h2>
    <h3> Make a fist and stick it straight out in front of you. Your knuckles should just touch the edge of the keyboards music stand.</h3>
    <h3> This distance allows for optimal reach and control over the keys.</h3>
    <h2> Seating Position</h2>
    <h3> Sit on the front half of the bench (don't slouch against the back!). You need to be able to lean forward.</h3>
    <h3> Keep your feet flat on the floor for stability and balance.</h3>
    <hr></hr>
    <h2>Hand Position</h2>
    <h3> Curve your fingers slightly, as if you were holding a small ball.</h3>
    <h3> Your fingertips should make contact with the keys, not the pads of your fingers.</h3>
    <h3> Keep your wrists level with the keyboard, avoiding excessive bending or tension.</h3>
    <h3> Its going to be uncomfortable at first but with practice it will feel natural!</h3>
    <hr></hr>
    <h2>Try:</h2>
    <h3> Sit at your piano or keyboard and practice getting into the correct posture and positioning.</h3>
    <h3> Focus on maintaining a relaxed and comfortable position while playing.</h3>
    <h3> Remember to take breaks if you feel any discomfort or tension.</h3>
    <hr></hr>
    <h2> Optional Homework:</h2>
    <h3> Practice sitting at your piano or keyboard with the correct posture.</h3>
    <h3> Play Middle C and the keys around it while maintaining proper hand position.</h3>
    <h3> Focus on developing a comfortable and relaxed playing position.</h3>
    <hr></hr>
    <h2> Keep up the great work on your musical journey!</h2>

    `,
    backgroundColor: "#E5D8CE"
  },
  3: {
    title: "Lesson 3:",
    description: "",
    customClass: "lesson-three",
    content: ``,
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
    document.body.style.backgroundColor = lesson?.backgroundColor || '#E5D8CE';
    return () => {
      document.body.style.backgroundColor = '';
    };
  }, [lesson]);

  const scrollToNextSection = () => {
    const hrElements = document.querySelectorAll('.lesson-content hr');
    
    if (hrElements.length === 0) return;

    const scrollPosition = window.scrollY;
    let nextHr = null;

    // Find the next hr element below current scroll position
    for (let hr of hrElements) {
      const hrPosition = hr.offsetTop;
      if (hrPosition > scrollPosition + 100) {
        nextHr = hr;
        break;
      }
    }
    // If we found a next hr, scroll to it
    if (nextHr) {
      nextHr.scrollIntoView({ behavior: 'smooth', block: 'center' });
    } else {
      // If no next hr found, scroll back to top
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

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
      {/* BUTTON AT THE TOP (Existing) */}
      <Link to="/piano" className="back-button">← Back to Roadmap</Link>
      
      <h1 className="lesson-title">{lesson.title}</h1>
      <p className="lesson-description">{lesson.description}</p>
      <div 
        className="lesson-content" 
        dangerouslySetInnerHTML={{ __html: lesson.content }}
      />
      
      <button className="next-section-button" onClick={scrollToNextSection} title="Next Section">
        Skip to next section ⬇️
      </button>

      {/* NEW BUTTON AT THE BOTTOM (Added Here) */}
      <Link to="/piano" className="back-button bottom-button">← Back to Roadmap</Link>

    </div> // End of lesson-container
  );
}
//title in the button tag makes a tooltip appear on hover
export default Lesson;