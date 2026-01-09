import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';
import './Lessons.css';

const questions = [
  {
    id: 1,
    question: "What is Middle C's position on the keyboard?",
    options: [
      "The leftmost white key",
      "Near the center of the keyboard",
      "The rightmost white key",
      "Next to the black keys only"
    ],
    correct: 1
  },
  {
    id: 2,
    question: "Which finger number represents the thumb?",
    options: ["5", "3", "1", "2"],
    correct: 2
  },
  {
    id: 3,
    question: "What are the white keys called?",
    options: [
      "Sharp notes",
      "Flat notes",
      "Natural notes (A-G)",
      "Chord notes"
    ],
    correct: 2
  },
  {
    id: 4,
    question: "What does 'forte' (f) mean in music?",
    options: ["Play softly", "Play loudly", "Play slowly", "Play quickly"],
    correct: 1
  },
  {
    id: 5,
    question: "What does 'piano' (p) mean in music?",
    options: ["Play loudly", "Play quickly", "Play softly", "Play slowly"],
    correct: 2
  },
  {
    id: 6,
    question: "How should you sit at the piano?",
    options: [
      "Slouch back on the bench",
      "Sit on the front half of the bench",
      "Stand while playing",
      "Sit sideways"
    ],
    correct: 1
  },
  {
    id: 7,
    question: "What is the Grand Staff?",
    options: [
      "A type of piano",
      "The treble and bass clefs combined",
      "A music teacher",
      "A brand of piano"
    ],
    correct: 1
  },
  {
    id: 8,
    question: "Which clef does the right hand typically read?",
    options: ["Bass clef", "Alto clef", "Treble clef", "Tenor clef"],
    correct: 2
  },
  {
    id: 9,
    question: "What is the purpose of the sustain pedal?",
    options: [
      "Make notes louder",
      "Change the pitch",
      "Sustain notes longer",
      "Stop all sound"
    ],
    correct: 2
  },
  {
    id: 10,
    question: "What are ledger lines used for?",
    options: [
      "To separate measures",
      "To show dynamics",
      "To write notes above or below the staff",
      "To show tempo"
    ],
    correct: 2
  }
];

function Section1Test() {
  const navigate = useNavigate();
  const { user, isLoaded, isSignedIn } = useUser();
  
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  useEffect(() => {
    window.scrollTo(0, 0);
    document.body.style.backgroundColor = '#E5D8CE';
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
        const currentLessons = user.unsafeMetadata.completedPianoLessons || [];
        const currentScores = user.unsafeMetadata.pianoTestScores || {};
        
        if (!currentLessons.includes('section1test')) {
          currentLessons.push('section1test');
        }

        await user.update({
          unsafeMetadata: {
            ...user.unsafeMetadata,
            completedPianoLessons: currentLessons,
            pianoTestScores: {
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
    navigate('/piano');
  };

  return (
    <div className="lesson-container">
      <Link to="/piano" className="back-button">← Back to Roadmap</Link>
      
      <h1 className="lesson-title">Section 1 Test</h1>
      <p className="lesson-description">Test Your Knowledge - 80% Required to Pass</p>
      
      <div className="lesson-content">
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
                className="back-button"
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
              <button onClick={handleRetry} className="back-button">
                Retake Test
              </button>
              <button onClick={handleReturnToRoadmap} className="back-button">
                Return to Roadmap
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Section1Test;