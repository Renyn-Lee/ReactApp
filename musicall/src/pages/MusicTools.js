import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function MusicTools() {
  const navigate = useNavigate();

  useEffect(() => {
    document.body.style.backgroundColor = '#ffffff';
    return () => {
      document.body.style.backgroundColor = '';
    };
  }, []);

  return (
    <div style={{ 
      maxWidth: '1200px', 
      margin: '0 auto', 
      padding: '40px 20px',
      minHeight: '100vh',
      backgroundColor: '#ffffff'
    }}>
      <h1 style={{ 
        textAlign: 'center', 
        fontSize: '2.5rem', 
        color: '#000',
        marginBottom: '10px'
      }}>
        Music Learning Tools
      </h1>
      <p style={{ 
        textAlign: 'center', 
        color: '#333', 
        marginBottom: '50px',
        fontSize: '1.2rem'
      }}>
        Practice and improve your musical skills
      </p>

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
        gap: '30px',
        padding: '20px'
      }}>
        {/* Flashcards */}
        <div 
          onClick={() => navigate('/musictools/flashcards')}
          style={{
            background: '#4CAF50',
            borderRadius: '12px',
            padding: '30px',
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
            cursor: 'pointer',
            textAlign: 'center',
            transition: 'transform 0.3s ease'
          }}
          onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
        >
          <div style={{ fontSize: '3rem', marginBottom: '15px' }}>🎴</div>
          <h3 style={{ fontSize: '1.5rem', marginBottom: '10px', color: 'white' }}>
            Music Flashcards
          </h3>
          <p style={{ color: 'white', marginBottom: '20px' }}>
            Practice note reading and music theory
          </p>
          <button style={{
            backgroundColor: 'white',
            color: '#4CAF50',
            border: 'none',
            padding: '12px 24px',
            borderRadius: '8px',
            fontSize: '1rem',
            cursor: 'pointer',
            fontWeight: 'bold'
          }}>
            Open Tool →
          </button>
        </div>

        {/* Treble Clef Sight Reading */}
        <div 
          onClick={() => navigate('/musictools/treble-sight-reading')}
          style={{
            background: '#2196F3',
            borderRadius: '12px',
            padding: '30px',
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
            cursor: 'pointer',
            textAlign: 'center',
            transition: 'transform 0.3s ease'
          }}
          onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
        >
          <div style={{ fontSize: '3rem', marginBottom: '15px' }}>🎼</div>
          <h3 style={{ fontSize: '1.5rem', marginBottom: '10px', color: 'white' }}>
            Treble Clef Sight Reading
          </h3>
          <p style={{ color: 'white', marginBottom: '20px' }}>
            Practice reading notes on the treble clef
          </p>
          <button style={{
            backgroundColor: 'white',
            color: '#2196F3',
            border: 'none',
            padding: '12px 24px',
            borderRadius: '8px',
            fontSize: '1rem',
            cursor: 'pointer',
            fontWeight: 'bold'
          }}>
            Open Tool →
          </button>
        </div>

        {/* Bass Clef Sight Reading */}
        <div 
          onClick={() => navigate('/musictools/bass-sight-reading')}
          style={{
            background: '#FF9800',
            borderRadius: '12px',
            padding: '30px',
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
            cursor: 'pointer',
            textAlign: 'center',
            transition: 'transform 0.3s ease'
          }}
          onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
        >
          <div style={{ fontSize: '3rem', marginBottom: '15px' }}>🎵</div>
          <h3 style={{ fontSize: '1.5rem', marginBottom: '10px', color: 'white' }}>
            Bass Clef Sight Reading
          </h3>
          <p style={{ color: 'white', marginBottom: '20px' }}>
            Practice reading notes on the bass clef
          </p>
          <button style={{
            backgroundColor: 'white',
            color: '#FF9800',
            border: 'none',
            padding: '12px 24px',
            borderRadius: '8px',
            fontSize: '1rem',
            cursor: 'pointer',
            fontWeight: 'bold'
          }}>
            Open Tool →
          </button>
        </div>

        {/* Coming Soon */}
        <div 
          style={{
            background: '#ccc',
            borderRadius: '12px',
            padding: '30px',
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
            textAlign: 'center',
            opacity: 0.6
          }}
        >
          <div style={{ fontSize: '3rem', marginBottom: '15px' }}>⏱️</div>
          <h3 style={{ fontSize: '1.5rem', marginBottom: '10px', color: '#333' }}>
            More Tools
          </h3>
          <p style={{ color: '#666', marginBottom: '20px' }}>
            Coming soon...
          </p>
        </div>
      </div>
    </div>
  );
}

export default MusicTools;