import { useState, useEffect, useRef, useCallback } from 'react';
import './metronome.css';

const Metronome = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [bpm, setBpm] = useState(120);
  const [currentBeat, setCurrentBeat] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [inputValue, setInputValue] = useState('120');

  const audioContextRef = useRef(null);
  const nextNoteTimeRef = useRef(0); // when the next note should play (AudioContext time)
  const timerIDRef = useRef(null);
  const inputRef = useRef(null);

  // Refs for mutable values used by scheduler to avoid stale closures
  const bpmRef = useRef(bpm);
  const currentBeatRef = useRef(0);

  // keep bpmRef in sync
  useEffect(() => {
    bpmRef.current = bpm;
  }, [bpm]);

  // initialize audio context
  useEffect(() => {
    audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
    return () => {
      if (audioContextRef.current) audioContextRef.current.close();
    };
  }, []);

  // play a click at a scheduled time (precise)
  const playClickAt = (time, isAccent = false) => {
    const audioContext = audioContextRef.current;
    if (!audioContext) return;
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    oscillator.frequency.value = isAccent ? 1000 : 800;
    // use a short attack/decay to avoid pops and allow scheduling
    gainNode.gain.setValueAtTime(0.0, time);
    gainNode.gain.linearRampToValueAtTime(0.3, time + 0.001);
    gainNode.gain.exponentialRampToValueAtTime(0.001, time + 0.06);
    oscillator.start(time);
    oscillator.stop(time + 0.06);
  };

  // scheduler - schedules clicks slightly ahead of time
  const scheduler = useCallback(() => {
    const audioContext = audioContextRef.current;
    if (!audioContext) return;

    // schedule notes while nextNoteTime < lookahead window
    const lookaheadSec = 0.1; // schedule 100ms ahead
    while (nextNoteTimeRef.current < audioContext.currentTime + lookaheadSec) {
      const isAccent = currentBeatRef.current === 0;
      // schedule a click at nextNoteTimeRef.current
      playClickAt(nextNoteTimeRef.current, false);

      // update refs for beat
      currentBeatRef.current = (currentBeatRef.current + 1) % 4;
      // also update visible state less often to avoid re-render spam:
      // update the visible currentBeat if the scheduled note is about to play now/very soon
      // (this keeps UI in sync without causing closure problems)
      setCurrentBeat(currentBeatRef.current);

      // advance to next note time based on current bpm
      const secondsPerBeat = 60.0 / bpmRef.current;
      nextNoteTimeRef.current += secondsPerBeat;
    }

    // loop the scheduler
    timerIDRef.current = setTimeout(scheduler, 25);
  }, []); // no deps because we use refs for dynamic values

  // manage start/stop
  useEffect(() => {
    const audioContext = audioContextRef.current;
    if (isPlaying && audioContext) {
      // if the audio context is suspended (autoplay policy), resume it
      if (audioContext.state === 'suspended') {
        audioContext.resume();
      }
      // set start time and kick off scheduler
      nextNoteTimeRef.current = audioContext.currentTime + 0.05; // small offset to begin
      currentBeatRef.current = currentBeat % 4; // keep continuity if toggled
      setCurrentBeat(currentBeatRef.current);
      scheduler();
    } else {
      // stopped: clear timer and reset beat
      if (timerIDRef.current) {
        clearTimeout(timerIDRef.current);
        timerIDRef.current = null;
      }
      currentBeatRef.current = 0;
      setCurrentBeat(0);
    }

    return () => {
      if (timerIDRef.current) {
        clearTimeout(timerIDRef.current);
        timerIDRef.current = null;
      }
    };
    
  }, [isPlaying]);

  const togglePlay = () => setIsPlaying((p) => !p);

  const handleSliderChange = (e) => {
    const newBpm = parseInt(e.target.value, 10);
    setBpm(newBpm);
    bpmRef.current = newBpm; // keep ref in sync immediately
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
    bpmRef.current = newBpm; // sync ref
    setInputValue(newBpm.toString());
    setIsEditing(false);
  };

  const handleInputKeyPress = (e) => {
    if (e.key === 'Enter') handleInputBlur();
  };

  return (
    <div className="simple-metronome-bar">
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
