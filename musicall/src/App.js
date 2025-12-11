import { useUser } from '@clerk/clerk-react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import React from 'react';
import Navbar from "./Navbar"
import Aboutus from "./pages/Aboutus"
import Guitar from "./pages/Guitar"
import Home from "./pages/Home"
import Piano from "./pages/Piano"
import Lesson from "./pages/Lessons"  // Fixed: changed from "./pages/Lessons" to "./pages/Lesson"
import FloatingChatbot from "./FloatingChatbot"
import Dashboard from "./pages/Dashboard"
import Metronome from './metronome';
import GuitarLesson from "./pages/GuitarLesson"

function App(){
    const { isSignedIn } = useUser();
    
    return (
        <Router>
            <Navbar/>
            <div className="container">
                <Routes>
                    <Route 
                        path="/" 
                        element={isSignedIn ? <Dashboard /> : <Home/>} 
                    />
                    <Route path="/aboutus" element={<Aboutus/>} />
                    <Route path="/guitar" element={<Guitar/>} />
                    <Route path="/piano" element={<Piano/>} />
                    <Route path="/lesson/:lessonId" element={<Lesson />} />
                    <Route path="/guitar-lesson/:lessonId" element={<GuitarLesson />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/home" element={<Home/>} />
                </Routes>
            </div>
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