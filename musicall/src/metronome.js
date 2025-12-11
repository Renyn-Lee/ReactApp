import React, { useState, useEffect, useRef, useCallback } from 'react';
import './metronome.css';

const Metronome = () => {
  const [isVisible, setIsVisible] = useState(true); 
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [bpm, setBpm] = useState(120);
  const [currentBeat, setCurrentBeat] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [inputValue, setInputValue] = useState('120');

  const audioContextRef = useRef(null);
  const nextNoteTimeRef = useRef(0);
  const timerIDRef = useRef(null);
  const inputRef = useRef(null);
  const bpmRef = useRef(bpm);
  const currentBeatRef = useRef(0);
  const schedulerRef = useRef(null);

  useEffect(() => {
    bpmRef.current = bpm;
  }, [bpm]);

  useEffect(() => {
    audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
    return () => {
      if (audioContextRef.current) audioContextRef.current.close();
    };
  }, []);

  const playClickAt = (time, isAccent = false) => {
    const audioContext = audioContextRef.current;
    if (!audioContext) return;
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    oscillator.frequency.value = isAccent ? 1000 : 800;
    gainNode.gain.setValueAtTime(0.0, time);
    gainNode.gain.linearRampToValueAtTime(0.3, time + 0.001);
    gainNode.gain.exponentialRampToValueAtTime(0.001, time + 0.06);
    oscillator.start(time);
    oscillator.stop(time + 0.06);
  };

  const scheduler = () => {
    const audioContext = audioContextRef.current;
    if (!audioContext) return;
    const lookaheadSec = 0.1;
    while (nextNoteTimeRef.current < audioContext.currentTime + lookaheadSec) {
      playClickAt(nextNoteTimeRef.current, false);

      currentBeatRef.current = (currentBeatRef.current + 1) % 4;
      setCurrentBeat(currentBeatRef.current);

      const secondsPerBeat = 60.0 / bpmRef.current;
      nextNoteTimeRef.current += secondsPerBeat;
    }
    schedulerRef.current = setTimeout(scheduler, 25);
  };

  useEffect(() => {
    const audioContext = audioContextRef.current;
    if (isPlaying && audioContext) {
      if (audioContext.state === 'suspended') {
        audioContext.resume();
      }
      nextNoteTimeRef.current = audioContext.currentTime + 0.05;
      currentBeatRef.current = 0;
      setCurrentBeat(0);
      scheduler();
    } else {
      if (schedulerRef.current) {
        clearTimeout(schedulerRef.current);
        schedulerRef.current = null;
      }
      currentBeatRef.current = 0;
      setCurrentBeat(0);
    }
    return () => {
      if (schedulerRef.current) {
        clearTimeout(schedulerRef.current);
        schedulerRef.current = null;
      }
    };
  }, [isPlaying]); 

  const togglePlay = () => setIsPlaying((p) => !p);

  const toggleVisibility = () => {
    if (isPlaying) {
      setIsPlaying(false); 
    }
    setIsVisible((v) => !v);
  };

  const handleSliderChange = (e) => {
    const newBpm = parseInt(e.target.value, 10);
    setBpm(newBpm);
    bpmRef.current = newBpm;
  };

  const handleBpmClick = () => {
    setIsEditing(true);
    setInputValue(bpm.toString());
    setTimeout(() => inputRef.current?.select(), 0);
  };

  const handleInputChange = (e) => setInputValue(e.target.value);

  const handleInputBlur = () => {
    let newBpm = parseInt(inputValue, 10);
    if (isNaN(newBpm) || newBpm < 40) newBpm = 40;
    if (newBpm > 240) newBpm = 240;
    setBpm(newBpm);
    bpmRef.current = newBpm;
    setInputValue(newBpm.toString());
    setIsEditing(false);
  };

  const handleInputKeyPress = (e) => {
    if (e.key === 'Enter') handleInputBlur();
  };
  
  // When hidden and not playing - show centered tab
  if (!isVisible && !isPlaying) {
    return (
      <div className="metronome-show-tab">
        <button 
          className="show-tab-btn" 
          onClick={toggleVisibility}
          title="Show Metronome"
        >
          <span>▲ Metronome</span>
        </button>
      </div>
    );
  } else if (!isVisible && isPlaying) {
    // When hidden but playing - show mini bar
    return (
      <div className="metronome-mini-indicator">
        <button className="mini-toggle-btn" onClick={toggleVisibility} title="Show Metronome">
          ▲
        </button>
        <span className="running-indicator">🎧 Running @ {bpm} BPM</span>
        <button className="mini-stop-btn" onClick={togglePlay} title="Stop Metronome">⏹</button>
      </div>
    );
  }

  // Main metronome bar
  return (
    <div className="simple-metronome-bar">
      <button 
        className="toggle-btn" 
        onClick={toggleVisibility}
        title="Hide Metronome"
      >
        ▼
      </button>

      <button className={`play-btn ${isPlaying ? 'playing' : ''}`} onClick={togglePlay}>
        {isPlaying ? '⏸' : '▶'}
      </button>

      <span className="bpm-label">BPM</span>

      <input
        type="range"
        min="40"
        max="240"
        value={bpm}
        onChange={handleSliderChange}
        className="bpm-slider"
      />

      {isEditing ? (
        <input
          ref={inputRef}
          type="number"
          min="40"
          max="240"
          value={inputValue}
          onChange={handleInputChange}
          onBlur={handleInputBlur}
          onKeyPress={handleInputKeyPress}
          className="bpm-input"
        />
      ) : (
        <span className="bpm-value" onClick={handleBpmClick}>
          {bpm}
        </span>
      )}
    </div>
  );
};

export default Metronome;