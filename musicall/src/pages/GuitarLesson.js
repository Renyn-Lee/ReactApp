// pages/GuitarLesson.js
import { useParams, Link } from 'react-router-dom';
import { useEffect } from 'react';
import './GuitarLessons.css';

const guitarLessonData = {
  1: {
    title: "Lesson 1:",
    description: "",
    customClass: "guitar-lesson-one",
    content: ``,
    backgroundColor: "#D09691"
  },
  2: {
    title: "Lesson 2:", 
    description: "",
    customClass: "guitar-lesson-two",
    content: ``,
    backgroundColor: "#D09691; "
  },
  3: {
    title: "Lesson 3:",
    description: "",
    customClass: "guitar-lesson-three",
    content: ``,
    backgroundColor: "#D09691"
  },
  4: {
    title: "Lesson 4:", 
    description: "",
    customClass: "guitar-lesson-four",
    content: ``,
    backgroundColor: "#D09691"
  },
  5: {
    title: "Lesson 5:",
    description: "",
    customClass: "guitar-lesson-five",
    content: ``,
    backgroundColor: "#D09691"
  },
  test1: {
    title: "Optional Test",
    description: "",
    customClass: "guitar-lesson-test",
    content: ``,
    backgroundColor: "#D09691"
  }
};

function GuitarLesson() {
  const { lessonId } = useParams();
  const lesson = guitarLessonData[lessonId];

  useEffect(() => {
    window.scrollTo(0, 0);
    document.body.style.backgroundColor = lesson?.backgroundColor || '#F5F1ED';
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