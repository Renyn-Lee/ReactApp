import { useUser } from '@clerk/clerk-react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import React from 'react';
import Navbar from "./Navbar"
import Aboutus from "./pages/Aboutus"
import Guitar from "./pages/Guitar"
import Home from "./pages/Home"
import Piano from "./pages/Piano"
import Lesson from "./pages/Lessons"
import FloatingChatbot from "./FloatingChatbot"
import Dashboard from "./pages/Dashboard"
import Metronome from './metronome';
import GuitarLesson from "./pages/GuitarLesson"

function App(){
    // IMPORTANT: Check both signed-in status AND if the data is loaded
    const { isSignedIn, isLoaded } = useUser();
    
    // --- APP-LEVEL LOADING CHECK ---
    if (!isLoaded) {
        // When Clerk is loading, render the core structure but force the Piano component
        // to display its skeleton screen instead of just a blank message.
        return (
            <Router>
                <Navbar/> 
                <div className="container">
                    {/* Pass prop to trigger the skeleton mode in Piano.jsx */}
                    <Piano isAppLoading={true} /> 
                </div>
            </Router>
        );
    }
    
    // --- FULLY LOADED APPLICATION ---
    return (
        <Router>
            <Navbar/>
            <div className="container">
                <Routes>
                    {/* Root route decision is now safe because isLoaded is true */}
                    <Route 
                        path="/" 
                        element={isSignedIn ? <Dashboard /> : <Home/>} 
                    />
                    
                    <Route path="/aboutus" element={<Aboutus/>} />
                    <Route path="/guitar" element={<Guitar/>} />
                    <Route path="/piano" element={<Piano/>} />
                    <Route path="/lesson/:lessonId" element={<Lesson />} />
                    <Route path="/guitar-lesson/:lessonId" element={<GuitarLesson />} />
                    
                    {/* Redundant routes for clarity */}
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/home" element={<Home/>} /> 
                </Routes>
            </div>
            
            {/* These components only show if the user is signed in */}
            {isSignedIn && (
                <>
                <FloatingChatbot />
                <Metronome/>
                </>
            )}
        </Router>
    )
}

export default App;