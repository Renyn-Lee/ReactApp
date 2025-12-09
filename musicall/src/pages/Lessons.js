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
    <h3>Welcome to the Piano! Here is a cool fact to start: the piano is actually a percussion instrument, just like a drum. 
    Inside the case, there are tiny hammers that hit the strings when you press a key. 
    This mechanism gives you total control—you can play a powerful beat or a soft melody just by changing how you touch the keys.</h3>
    <h2>Geography of the Piano</h2>
    <h3>The piano keyboard is a map. Instead of North and South, we have High and Low.</h3>
    <img src='/imgs/pianoimg.png' alt="Piano Player" />
    `,
    backgroundColor: "#E5D8CE"
  },
  2: {
    title: "Lesson 2:", 
    description: "",
    customClass: "lesson-two",
    content: ``,
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
      <div 
        className="lesson-content" 
        dangerouslySetInnerHTML={{ __html: lesson.content }}
      />
    </div>
  );
}

export default Lesson;