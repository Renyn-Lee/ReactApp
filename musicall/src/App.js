import { useUser } from '@clerk/clerk-react';
import Navbar from "./Navbar"
import Aboutus from "./pages/Aboutus"
import Guitar from "./pages/Guitar"
import Home from "./pages/Home"
import Piano from "./pages/Piano"
import FloatingChatbot from "./FloatingChatbot"
import Dashboard from "./pages/Dashboard"

function App(){
    const { isSignedIn } = useUser(); // Only get sign-in status, no loading check
    
    let component
    const currentPath = window.location.pathname.toLowerCase();
    
    switch (currentPath) {
    case "/":
        // Smart home page: Dashboard for signed-in users, Home for others
        component = isSignedIn ? <Dashboard/> : <Home/>
        break
    case "/aboutus":
        component = <Aboutus/>
        break
    case "/guitar":
        component = <Guitar/>
        break
    case "/piano":
        component = <Piano/>
        break
    case "/dashboard":
        component = <Dashboard/>
        break
    // Add more routes as needed
    case "/home":
        component = <Home/>
        break
    default:
        // Fallback to home for unknown routes
        component = <Home/>
        break
    }
    
    return (
        <>
            <Navbar/>
            <div className="container">{component}</div>
            {isSignedIn && (
            <FloatingChatbot />
            )}
        </>
    )
}

export default App;
/* be sure to do 'func start' in api  and npm start in musicall*/