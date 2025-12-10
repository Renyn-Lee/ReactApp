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

        {/* Show User Button when signed in */}
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
        <div>
          <h1>Learn With Legatto!</h1>
          <ul className="twond-box-text">
            <li>Faster</li>
            <li>Better</li>
            <li>Funner</li>
            <li className="extraItalics">Learning That Lasts</li>
          </ul>
          </div>
         <img src='/imgs/learn.jpg' alt="Piano Player" />
      </div>
      <div>
      <div className="home-desc2">
        <div>
          <h1> Learn Piano </h1>
          <img src='/imgs/pianoplayer.jpg' alt="Piano Player" />
          <h3> Piano has never been this easy!
             Learn from expirenced piano players today.</h3>
        </div>

      </div>

      </div>
    </main>
  );
}