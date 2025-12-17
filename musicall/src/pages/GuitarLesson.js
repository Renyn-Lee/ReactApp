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
    backgroundColor: "#D09691"
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
  6: {
    title: "Lesson 6:",
    description: "",
    customClass: "guitar-lesson-six",
    content: ``,
    backgroundColor: "#D09691"
  },
  7: {
    title: "Lesson 7:",
    description: "",
    customClass: "guitar-lesson-seven",
    content: ``,
    backgroundColor: "#D09691"
  },
  8: {
    title: "Lesson 8:",
    description: "",
    customClass: "guitar-lesson-eight",
    content: ``,
    backgroundColor: "#D09691"
  },
  9: {
    title: "Lesson 9:",
    description: "",
    customClass: "guitar-lesson-nine",
    content: ``,
    backgroundColor: "#D09691"
  },
  10: {
    title: "Lesson 10:",
    description: "",
    customClass: "guitar-lesson-ten",
    content: ``,
    backgroundColor: "#D09691"
  },
  11: {
    title: "Lesson 11:",
    description: "",
    customClass: "guitar-lesson-eleven",
    content: ``,
    backgroundColor: "#D09691"
  },
  12: {
    title: "Lesson 12:",
    description: "",
    customClass: "guitar-lesson-twelve",
    content: ``,
    backgroundColor: "#D09691"
  },
  13: {
    title: "Lesson 13:",
    description: "",
    customClass: "guitar-lesson-thirteen",
    content: ``,
    backgroundColor: "#D09691"
  },
  14: {
    title: "Lesson 14:",
    description: "",
    customClass: "guitar-lesson-fourteen",
    content: ``,
    backgroundColor: "#D09691"
  },
  15: {
    title: "Lesson 15:",
    description: "",
    customClass: "guitar-lesson-fifteen",
    content: ``,
    backgroundColor: "#D09691"
  },
  16: {
    title: "Lesson 16:",
    description: "",
    customClass: "guitar-lesson-sixteen",
    content: ``,
    backgroundColor: "#D09691"
  },
  17: {
    title: "Lesson 17:",
    description: "",
    customClass: "guitar-lesson-seventeen",
    content: ``,
    backgroundColor: "#D09691"
  },
  18: {
    title: "Lesson 18:",
    description: "",
    customClass: "guitar-lesson-eighteen",
    content: ``,
    backgroundColor: "#D09691"
  },
  19: {
    title: "Lesson 19:",
    description: "",
    customClass: "guitar-lesson-nineteen",
    content: ``,
    backgroundColor: "#D09691"
  },
  20: {
    title: "Lesson 20:",
    description: "",
    customClass: "guitar-lesson-twenty",
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
    document.body.style.backgroundColor = lesson?.backgroundColor || '#D09691';
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