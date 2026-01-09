import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';
import './GuitarLessons.css';

const questions = [
  {
    id: 1,
    question: "What are the six strings of a guitar in standard tuning (from lowest to highest)?",
    options: [
      "A, B, C, D, E, F",
      "E, A, D, G, B, E",
      "G, C, D, A, E, B",
      "D, G, C, F, A, D"
    ],
    correct: 1
  },
  {
    id: 2,
    question: "What does TAB stand for in guitar tablature?",
    options: ["Table", "Tablature", "Tabular", "Tablet"],
    correct: 1
  },
  {
    id: 3,
    question: "In a chord diagram, what do the numbers represent?",
    options: [
      "String numbers",
      "Finger numbers",
      "Fret numbers",
      "Beat numbers"
    ],
    correct: 1
  },
  {
    id: 4,
    question: "What is a power chord?",
    options: [
      "A chord with 6 notes",
      "A chord with only the root and fifth",
      "A chord played loudly",
      "A chord with all strings"
    ],
    correct: 1
  },
  {
    id: 5,
    question: "What does an 'X' above a string in a chord diagram mean?",
    options: [
      "Play that string",
      "Mute that string",
      "Don't play that string",
      "Play it twice"
    ],
    correct: 2
  },
  {
    id: 6,
    question: "What is the proper posture for holding an acoustic guitar?",
    options: [
      "Rest it on your lap with the waist against your body",
      "Hold it horizontally",
      "Stand with it behind your back",
      "Lay it flat on a table"
    ],
    correct: 0
  },
  {
    id: 7,
    question: "What is a barre chord?",
    options: [
      "A chord played on one string",
      "A chord where one finger presses multiple strings",
      "A chord with no open strings",
      "A chord played with a pick"
    ],
    correct: 1
  },
  {
    id: 8,
    question: "What is the purpose of alternate strumming?",
    options: [
      "To play louder",
      "To create rhythm efficiency by alternating up and down strokes",
      "To tune the guitar",
      "To change chords faster"
    ],
    correct: 1
  },
  {
    id: 9,
    question: "What is fingerpicking?",
    options: [
      "Picking strings with your fingers instead of a pick",
      "Choosing which fingers to use",
      "Pressing the frets",
      "Cleaning your guitar"
    ],
    correct: 0
  },
  {
    id: 10,
    question: "What are the three most common beginner open chords?",
    options: [
      "A, B, C",
      "C, G, D",
      "E, F, G",
      "D, E, F"
    ],
    correct: 1
  }
];

function Section1GuitarTest() {
  const navigate = useNavigate();
  const { user, isLoaded, isSignedIn } = useUser();
  
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  useEffect(() => {
    window.scrollTo(0, 0);
    document.body.style.backgroundColor = '#D09691';
    return () => {
      document.body.style.backgroundColor = '';
    };
  }, []);

  const handleAnswerSelect = (questionId, answerIndex) => {
    if (!submitted) {
      setAnswers({ ...answers, [questionId]: answerIndex });
    }
  };

  const handleSubmit = async () => {
    let correctCount = 0;
    questions.forEach(q => {
      if (answers[q.id] === q.correct) {
        correctCount++;
      }
    });
    
    const finalScore = Math.round((correctCount / questions.length) * 100);
    setScore(finalScore);
    setSubmitted(true);

    if (isLoaded && isSignedIn && user) {
      try {
        const currentLessons = user.unsafeMetadata.completedGuitarLessons || [];
        const currentScores = user.unsafeMetadata.guitarTestScores || {};
        
        if (!currentLessons.includes('section1test')) {
          currentLessons.push('section1test');
        }

        await user.update({
          unsafeMetadata: {
            ...user.unsafeMetadata,
            completedGuitarLessons: currentLessons,
            guitarTestScores: {
              ...currentScores,
              section1test: finalScore
            }
          }
        });
      } catch (err) {
        console.error("Error saving test score:", err);
      }
    }
  };

  const handleRetry = () => {
    setAnswers({});
    setSubmitted(false);
    setScore(0);
    window.scrollTo(0, 0);
  };

  const handleReturnToRoadmap = () => {
    navigate('/guitar');
  };

  return (
    <div className="guitar-lesson-container">
      <Link to="/guitar" className="guitar-back-button">← Back to Roadmap</Link>
      
      <h1 className="guitar-lesson-title">Section 1 Test</h1>
      <p className="guitar-lesson-description">Test Your Knowledge - 80% Required to Pass</p>
      
      <div className="guitar-lesson-content">
        {!submitted ? (
          <>
            <h2>Answer all 10 questions to complete the test</h2>
            <p>Select the best answer for each question.</p>
            <hr />
            
            {questions.map((q, idx) => (
              <div key={q.id} className="quiz-question">
                <h3>Question {idx + 1}: {q.question}</h3>
                <div className="quiz-options">
                  {q.options.map((option, optIdx) => (
                    <div key={optIdx} className="quiz-option">
                      <label>
                        <input
                          type="radio"
                          name={`question-${q.id}`}
                          checked={answers[q.id] === optIdx}
                          onChange={() => handleAnswerSelect(q.id, optIdx)}
                        />
                        <span>{option}</span>
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            ))}
            
            <hr />
            <div className="quiz-submit-container">
              <button 
                onClick={handleSubmit}
                className="guitar-back-button"
                disabled={Object.keys(answers).length < questions.length}
              >
                Submit Test
              </button>
            </div>
            {Object.keys(answers).length < questions.length && (
              <p className="quiz-submit-message">
                Please answer all questions before submitting
              </p>
            )}
          </>
        ) : (
          <>
            <h2>Review Your Answers</h2>
            
            {questions.map((q, idx) => {
              const userAnswer = answers[q.id];
              const isCorrect = userAnswer === q.correct;
              
              return (
                <div key={q.id} className={`quiz-answer ${isCorrect ? 'correct' : 'incorrect'}`}>
                  <h3>Question {idx + 1}: {q.question}</h3>
                  <p className={`quiz-answer-status ${isCorrect ? 'correct' : 'incorrect'}`}>
                    {isCorrect ? '✓ Correct' : '✗ Incorrect'}
                  </p>
                  <p>Your answer: {q.options[userAnswer]}</p>
                  {!isCorrect && (
                    <p>Correct answer: {q.options[q.correct]}</p>
                  )}
                </div>
              );
            })}
            
            <hr />
            
            <h2>Test Results</h2>
            <div className={`quiz-result-box ${score >= 80 ? 'passed' : 'failed'}`}>
              <h1 className={`quiz-score ${score >= 80 ? 'passed' : 'failed'}`}>
                {score}%
              </h1>
              <h3 className={`quiz-result-title ${score >= 80 ? 'passed' : 'failed'}`}>
                {score >= 80 ? '🎉 Congratulations! You Passed!' : '❌ Keep Practicing!'}
              </h3>
              <p className={`quiz-result-message ${score >= 80 ? 'passed' : 'failed'}`}>
                {score >= 80 
                  ? 'Section 2 is now unlocked! Great job!'
                  : 'You need 80% or higher to unlock Section 2. Review the lessons and try again!'}
              </p>
            </div>
            
            <div className="quiz-button-group">
              <button onClick={handleRetry} className="guitar-back-button">
                Retake Test
              </button>
              <button onClick={handleReturnToRoadmap} className="guitar-back-button">
                Return to Roadmap
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Section1GuitarTest;