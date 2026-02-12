import "../styles.css";
import { useNavigate } from 'react-router-dom';
import {
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/clerk-react";

export default function Home() {
  const navigate = useNavigate(); // Hook must be inside the component

  return (
    <main>
      <div className="Homescreen-Box">
        <h1 className="Home-Title">Legatto</h1>
        <h2 className="Homescreen-Motto">Learning That Lasts</h2>
        <h1 className="homebox3">Start Your Journey Now!</h1>

        <SignedOut>
          <SignUpButton mode="modal">
            <button className="HomeButton">Get Started</button>
          </SignUpButton>
        </SignedOut>

        <SignedIn>
          {/* Use navigate() here too for a smoother SPA experience */}
          <button className="HomeButton" onClick={() => navigate('/dashboard')}>
            Go to Dashboard
          </button>
        </SignedIn>
      </div>

      <div className="home-desc">
        <h3>
          Learning music has never been this fast and easy! Legatto is a free
          resource created by students to help you easily learn music. Our
          lessons are short and easy, helping you learn faster than your
          friends.
        </h3>
      </div>

      <div className="twond-box">
        <img src='/imgs/learn.jpg' alt="Learn with Legatto" />
        <div>
          <h1 className="twond-box-title">Learn With Legatto!</h1>
          <ul className="twond-box-text">
            <li>Faster</li>
            <li>Better</li>
            <li>Easier</li>
            <li className="extraItalics">Learning That Lasts</li>
          </ul>
        </div>
      </div>

      <div className="home-desc2">
        <img src='/imgs/pianoplayer.jpg' alt="Piano Player" />
        <div>
          <h1 className='home-desc2-title'>Learn Piano</h1>
          <h3>Piano has never been this easy! Learn from experienced piano players today.</h3>
        </div>
      </div>

      <div className="sato-box">
        <h1>Learn better with our free music chatbot Sato!</h1>
        <h3>Ask Sato any music-related questions and get instant answers! </h3>
      </div>

      {/* Your clickable navigation text */}
      <div style={{ display: 'flex', gap: '20px', cursor: 'pointer', padding: '20px', justifyContent: 'center' }}>
        <span onClick={() => navigate('/piano')}>Piano</span>
        <span onClick={() => navigate('/guitar')}>Guitar</span>
        <span onClick={() => navigate('/aboutus')}>About Us and Contact</span>
        <span onClick={() => navigate('/musictools')}>Music Tools</span>
      </div>
    </main>
  );
}