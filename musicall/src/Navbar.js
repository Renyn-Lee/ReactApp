import './styles.css';
import { Link, useLocation } from 'react-router-dom';
import { SignInButton, SignUpButton, SignedIn, SignedOut, UserButton } from "@clerk/clerk-react";

export default function Navbar() {
  // We don't need useNavigate here anymore because CustomLink handles it!
  
  return (
    <nav className='nav'>
      <Link to="/" className='site-title'>Legatto</Link>
      
      {/* This is your primary navigation */}
      <ul> 
        <CustomLink to="/piano">Piano</CustomLink>
        <CustomLink to="/guitar">Guitar</CustomLink>
        <CustomLink to="/aboutus">About Us</CustomLink>
        <CustomLink to="/musictools">Music Tools</CustomLink>
      </ul>

      <div className='navbuttons'>
        <SignedOut>
          <SignInButton mode="modal">
            <button className="login">Sign In</button>
          </SignInButton>
          <SignUpButton mode="modal">
            <button className="signup">Sign Up</button>
          </SignUpButton>
        </SignedOut>
        <SignedIn>
          <UserButton afterSignOutUrl="/"/>
        </SignedIn>
      </div>
    </nav>
  );
}

function CustomLink({ to, children, ...props }) {
  const location = useLocation();
  const path = location.pathname.toLowerCase();
  const linkPath = to.toLowerCase();
  
  // This checks if the current URL matches the link to apply the "active" class
  const isActive = path === linkPath || (linkPath !== '/' && path.startsWith(linkPath + '/'));
  
  return (
    <li className={isActive ? "active" : ""}>
      <Link to={to} {...props}>{children}</Link>
    </li>
  );
}