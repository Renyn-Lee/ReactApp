import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';
import './GuitarLessons.css';

const questions = [
 {
    id: 1,
    question: "What mnemonic helps you remember the six guitar strings from thickest to thinnest?",
    options: [
      "Every Ant Does Great Big Exercises",
      "Eddy Ate Dynamite, Goodbye Eddy",
      "Every American Dog Gets Bones Eventually",
      "Eat All Day, Get Big Eventually"
    ],
    correct: 1
  },
  {
    id: 2,
    question: "In guitar TAB, what does a number written on one of the six lines represent?",
    options: [
      "Which finger to use",
      "How many times to strum",
      "Which fret to press on that string",
      "The beat count"
    ],
    correct: 2
  },
  {
    id: 3,
    question: "When learning the 1-2-3-4 exercise, what is its primary purpose?",
    options: [
      "To memorize string names",
      "To practice reading TAB",
      "To build finger strength and independence",
      "To learn the major scale"
    ],
    correct: 2
  },
  {
    id: 4,
    question: "What interval pattern defines a major scale? (W = Whole step, H = Half step)",
    options: [
      "W H W W H W W",
      "W W W H W W H",
      "W W H W W W H",
      "H W W W H W W"
    ],
    correct: 2
  },
  {
    id: 5,
    question: "What makes power chords especially useful on electric guitar with distortion?",
    options: [
      "They use all six strings for a full sound",
      "They only use the root and 5th, sounding powerful and moveable up the neck",
      "They require no fretting hand pressure",
      "They are always played open"
    ],
    correct: 1
  },
  {
    id: 6,
    question: "When switching from Em to Cmaj7, which concept helps make the transition smoother?",
    options: [
      "Lifting all fingers at once and replacing them",
      "Using anchor fingers — keeping fingers that move minimally close to their position",
      "Strumming faster through the change",
      "Muting all strings during the switch"
    ],
    correct: 1
  },
  {
    id: 7,
    question: "In fingerpicking, which finger is assigned to the bass strings (low E, A, and D)?",
    options: [
      "Index finger (i)",
      "Middle finger (m)",
      "Ring finger (a)",
      "Thumb (p)"
    ],
    correct: 3
  },
  {
    id: 8,
    question: "The minor pentatonic scale is called 'pentatonic' because it contains how many notes?",
    options: [
      "4",
      "5",
      "6",
      "7"
    ],
    correct: 1
  },
  {
    id: 9,
    question: "What does the CAGED system describe?",
    options: [
      "Five strumming patterns for beginners",
      "The five open chord shapes that link together to cover the entire fretboard",
      "A method for tuning a guitar by ear",
      "The five finger positions used in classical guitar"
    ],
    correct: 1
  },
  {
    id: 10,
    question: "In the 12-bar blues in A, which three chords are used throughout the progression?",
    options: [
      "Am, Dm, Em",
      "G7, C7, D7",
      "A7, D7, E7",
      "A, D, E"
    ],
    correct: 2
  },
  {
    id: 11,
    question: "What is the correct technique for a string bend?",
    options: [
      "Pull the string toward the floor with one finger only",
      "Push the string upward while supporting the bending finger with the fingers behind it",
      "Slide quickly to a higher fret",
      "Press harder on the same fret to raise the pitch"
    ],
    correct: 1
  },
  {
    id: 12,
    question: "What is syncopation in strumming?",
    options: [
      "Strumming only on the downbeats",
      "Skipping a strum entirely",
      "Accenting the off-beats or 'ands' between the main counts to create groove",
      "Strumming as fast as possible"
    ],
    correct: 2
  },
  {
    id: 13,
    question: "A minor and C major are called 'relative keys' because they share what?",
    options: [
      "The same root note",
      "The same chord shapes",
      "All the same notes",
      "The same tempo"
    ],
    correct: 2
  },
  {
    id: 14,
    question: "In legato technique, what is the difference between a hammer-on and a pull-off?",
    options: [
      "A hammer-on goes to a lower note; a pull-off goes to a higher note",
      "A hammer-on goes to a higher note; a pull-off goes to a lower note",
      "They are the same technique with different names",
      "A hammer-on uses a pick; a pull-off uses your fingers"
    ],
    correct: 1
  },
  {
    id: 15,
    question: "Where you pick on the guitar (near the neck vs. near the bridge) affects what?",
    options: [
      "The tempo of your playing",
      "Which chord sounds",
      "The tone — neck produces warmth, bridge produces brightness",
      "The tuning of the strings"
    ],
    correct: 2
  },
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
            <h2>Answer all 15 questions to submit the test</h2>
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