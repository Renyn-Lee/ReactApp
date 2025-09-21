import './styles.css';
import { SignInButton, SignUpButton, SignedIn, SignedOut, UserButton } from "@clerk/clerk-react";
export default function Navbar(){
  const path = window.location.pathname
  return<nav className='nav'>
<a href="/" className='site-title'>Legatto</a>
<ul> 
  <CustomLink href="/Piano"> Piano </CustomLink>
  <CustomLink href="/Guitar"> Guitar </CustomLink>
  <CustomLink href="/Aboutus"> About us </CustomLink>
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
}

function CustomLink({href, children, ...props}) {
  const path = window.location.pathname
  return (
    <li className= {path === href ? "active" :""} >
        <a href={href} {...props}>{children}</a>
    </li>
  )
}