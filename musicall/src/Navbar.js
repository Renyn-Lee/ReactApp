import './styles.css';
import { Link, useLocation } from 'react-router-dom';
import { SignInButton, SignUpButton, SignedIn, SignedOut, UserButton } from "@clerk/clerk-react";

export default function Navbar(){
  return(
    <nav className='nav'>
      <Link to="/" className='site-title'>Legatto</Link>
      <ul> 
        <CustomLink to="/piano">Piano</CustomLink>
        <CustomLink to="/guitar">Guitar</CustomLink>
        <CustomLink to="/aboutus">About us</CustomLink>
      </ul>
      <div className='navbuttons'>
        <SignedOut>
            <SignInButton>
                <button className="login">Sign In</button>
            </SignInButton>
            <SignUpButton>
                <button className="signup">Sign Up</button>
            </SignUpButton>
        </SignedOut>
        <SignedIn>
          <UserButton/>
        </SignedIn>
      </div>
    </nav>
  );
}

function CustomLink({to, children, ...props}) {
  const location = useLocation();
  const path = location.pathname.toLowerCase();
  const linkPath = to.toLowerCase();
  
  return (
    <li className={path === linkPath ? "active" : ""}>
        <Link to={to} {...props}>{children}</Link>
    </li>
  );
}