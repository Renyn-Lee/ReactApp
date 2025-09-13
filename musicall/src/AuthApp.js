//clerk stuff for sign in/signup components
import { SignedIn, SignedOut, UserButton } from "@clerk/clerk-react";
import { SignIn, SignUp } from "@clerk/clerk-react";

export default function App() {
  return (
    <div>
      <SignedOut>
        <h2>Please sign in</h2>
        <SignIn path="/sign-in" routing="path" signUpUrl="/sign-up" />
      </SignedOut>

      <SignedIn>
        <h2>Welcome! You’re signed in 🎉</h2>
        <UserButton />
      </SignedIn>
    </div>
  );
}