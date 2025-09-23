// pages/Lesson.js
import { useParams, Link } from 'react-router-dom';
import { useEffect } from 'react';


//basic lesson code I found from who knows where
const lessonData = {
  1: {
    title: "Lesson 1:",
    description: "<h1> hello</h1>",
    content: `
    `,
    backgroundColor: "#E5D8CE"
  },
  2: {
    title: "Lesson 2: ",
    description: "", 
    content: ``,
    backgroundColor: "#D4E5F7"
  },
  3: {
    title: "Lesson 3:",
    description: "",
    content: ``,
    backgroundColor: "#F0E5D8"
  },
  4: {
    title: "Lesson 4:", 
    description: "",
    content: ``,
    backgroundColor: "#E8F4E6"
  },
  5: {
    title: "Lesson 5:",
    description: "", 
    content: ``,
    backgroundColor: "#F4E8F8"
  },
  test1: {
    title: "Optional Test",
    description: "Test your knowledge",
    content: ``,
    backgroundColor: "#FFF2E5"
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
    return <div>Lesson not found</div>;
  }

  return (
    <div className="lesson-container">
      <Link to="/piano" className="back-button">← Back to Roadmap</Link>
      <h1>{lesson.title}</h1>
      <p className="lesson-description">{lesson.description}</p>
      <div 
        className="lesson-content" 
        dangerouslySetInnerHTML={{ __html: lesson.content }}
      />
    </div>
  );
}

export default Lesson;