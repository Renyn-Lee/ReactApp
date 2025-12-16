import "../styles.css";
import {
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/clerk-react";

export default function Home() {
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
          <a href="/dashboard">
            <button className="HomeButton">Go to Dashboard</button>
          </a>
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
    </main>
  );
}