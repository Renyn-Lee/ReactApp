// pages/Lesson.js
import { useParams, Link } from 'react-router-dom';
import { useEffect } from 'react';
import './Lessons.css';

const lessonData = {
  1: {
    title: "Lesson 1:",
    description: " Getting Started",
    customClass: "lesson-one",
    content: `<h1>hello</h1>
  <ul className='Lessoncontentone'>
    <li>nig</li>
    <li>chasen</li>
    <li>renyn</li>
  </ul>`,
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