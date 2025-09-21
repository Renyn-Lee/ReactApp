import '../styles.css';
import { useEffect } from 'react';
import {
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/clerk-react";

function Piano() {
  useEffect(() => {
    document.body.style.backgroundColor = '#E5D8CE';
    
    return () => {
      document.body.style.backgroundColor = '';
    };
  }, []);

  return ( 
    <div>
        <SignedOut>
        <SignUpButton mode="modal">
           <button className='accessbutton' heref=" "> Log in for full access </button>
        </SignUpButton>
        </SignedOut>
    </div>
  );
}

export default Piano;