import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './MusicTools.css'; 

function MusicTools() {
  const navigate = useNavigate();

  useEffect(() => {
    document.body.style.backgroundColor = '#ffffff';
    return () => {
      document.body.style.backgroundColor = '';
    };
  }, []);

  const tools = [
    {
      title: "Music Flashcards",
      desc: "Practice note reading and music theory",
      icon: "🎴",
      path: "/musictools/flashcards",
      color: "#4CAF50" // Green
    },
    {
      title: "Treble Clef Reading",
      desc: "Practice reading notes on the treble clef",
      icon: "🎼",
      path: "/musictools/treblesightreading",
      color: "#2196F3" // Blue
    },
    {
      title: "Bass Clef Reading",
      desc: "Practice reading notes on the bass clef",
      icon: "🎵",
      path: "/musictools/basssightreading",
      color: "#FF9800" // Orange
    },
    {
      title: "Ear Training",
      desc: "Identify musical notes by sound",
      icon: "👂",
      path: "/musictools/eartrainer",
      color: "#0065D1" // Darker Blue
    },
    {
      title: "Virtual Piano",
      desc: "Play and visualize notes on the keys",
      icon: "🎹",
      path: "/musictools/virtualpiano",
      color: "#0065D1" // Darker Blue
    }
  ];

  return (
    <div className="music-tools-container">
      <h1 className="music-tools-title">Music Learning Tools</h1>
      <p className="music-tools-subtitle">
        Practice and improve your musical skills
      </p>

      <div className="tools-grid">
        {tools.map((tool, index) => (
          <div 
            key={index} 
            className="tool-card" 
            onClick={() => navigate(tool.path)}
            /* FIXED: Applied color to the card background and set text to white */
            style={{ backgroundColor: tool.color, color: 'white' }} 
          >
            <div className="tool-icon">{tool.icon}</div>
            <h3 className="tool-title" style={{ color: 'white' }}>{tool.title}</h3>
            <p className="tool-description" style={{ color: 'white' }}>{tool.desc}</p>
            <button 
              className="tool-button" 
              style={{ backgroundColor: 'white', color: tool.color }}
            >
              Open Tool →
            </button>
          </div>
        ))}

        {/* Coming Soon Card */}
        <div className="tool-card" style={{ backgroundColor: '#ccc', opacity: 0.6, cursor: 'default' }}>
          <div className="tool-icon">⏱️</div>
          <h3 className="tool-title">More Tools</h3>
          <p className="tool-description">Coming soon...</p>
        </div>
      </div>
    </div>
  );
}

export default MusicTools;