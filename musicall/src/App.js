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
import Section1Test from "./pages/Section1test"
import Section1GuitarTest from "./pages/Section1GuitarTest"
import MusicTools from "./pages/MusicTools"
import Flashcards from "./pages/Flashcards"
import TrebleSightReading from './pages/trebleclefreading';
import BassSightReading from './pages/baseclefreading';
import EarTraining from './pages/eartraining';
import VirtualPiano from './pages/VituralPiano';
//import { Analytics } from "@vercel/analytics/react"


function App(){
    const { isSignedIn } = useUser();
    
    return (
        <Router>
            <Navbar/>
            <Routes>
                <Route 
                    path="/" 
                    element={
                        <div className="container">
                            {isSignedIn ? <Dashboard /> : <Home/>}
                        </div>
                    } 
                />
                <Route path="/aboutus" element={<div className="container"><Aboutus/></div>} />
                <Route path="/guitar" element={<div className="container"><Guitar/></div>} />
                <Route path="/piano" element={<div className="container"><Piano/></div>} />
                <Route path="/lesson/:lessonId" element={<div className="container"><Lesson /></div>} />
                <Route path="/guitar-lesson/:lessonId" element={<div className="container"><GuitarLesson /></div>} />
                <Route path="/dashboard" element={<div className="container"><Dashboard /></div>} />
                <Route path="/home" element={<div className="container"><Home/></div>} />
                <Route path="/section1test" element={<div className="container"><Section1Test /></div>} />
                <Route path="/guitar-section1test" element={<div className="container"><Section1GuitarTest /></div>} />
                
                {/* Music Tools */}
                <Route path="/musictools" element={<MusicTools />} />
                <Route path="/musictools/flashcards" element={<Flashcards />} />
                <Route path="/musictools/treblesightreading" element={<TrebleSightReading />} />
                <Route path="/musictools/basssightreading" element={<BassSightReading />} />
                <Route path="/musictools/eartrainer" element={<EarTraining />} />
                <Route path="/musictools/virtualpiano" element={<VirtualPiano />} />
            </Routes>
            
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