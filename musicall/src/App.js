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
import Section1Test from "./pages/Section1test"
import Section1GuitarTest from "./pages/Section1GuitarTest"
import MusicTools from "./pages/MusicTools"

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
                    <Route path="/section1test" element={<Section1Test />} />
                    <Route path="/guitar-section1test" element={<Section1GuitarTest />} />
                    <Route path="/musictools" element={<MusicTools />} />
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