import React, { useState, useEffect, useRef } from 'react';
import './MedTimer.css';
import NaviMain from '../NaviMain/NaviMain';

const MedTimer = () => {
  const [timeLeft, setTimeLeft] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [showMessage, setShowMessage] = useState(false);
  const [quote, setQuote] = useState('');
  const audioRef = useRef(null);

  const quotes = [
    "✨ You did it. Take this moment with you. ✨",
    "Remember, it's okay to take a pause. You are doing your best. 💙",
    "In this moment, you are safe, enough, and worthy. 💚",
    "You are stronger than you think. Every step counts. 🌿",
    "Even on tough days, you're doing amazing. Take a deep breath. 🌸",
    "You are not alone. One moment at a time. 💫",
    "Breathe in peace, breathe out stress. You're okay. 🌙"
  ];

  const formatTime = (time) => {
    const minutes = String(Math.floor(time / 60)).padStart(2, '0');
    const seconds = String(time % 60).padStart(2, '0');
    return `${minutes}:${seconds}`;
  };

  const startTimer = (minutes) => {
    setTimeLeft(minutes * 60);
    setIsRunning(true);
    setShowMessage(false);
    setQuote('');

    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(e => console.log('Autoplay blocked:', e));
    }
  };

  const getRandomQuote = () => {
    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
    setQuote(randomQuote);
  };

  useEffect(() => {
    if (!isRunning || timeLeft <= 0) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setIsRunning(false);
          getRandomQuote();
          setShowMessage(true);

          // Pause the music
          if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.currentTime = 0;
          }

          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning, timeLeft]);

  return (
    <div className="timer-main">
      <div className="nav-main">
        <NaviMain/>
      </div>
      {/* Hidden audio element */}
      <audio ref={audioRef} src="/assets/music/calm.mp3" loop style={{ display: 'none' }} />

      {showMessage && (
        <div className="popup-message">{quote}</div>
      )}

      <div className="timer-container">
        <div className="time-display">
          <div className="clock-text">{formatTime(timeLeft)}</div>
          <div className="quick-buttons-inside">
            {[1, 3, 5, 10].map((min) => (
              <button key={min} onClick={() => startTimer(min)}>
                {min} min
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MedTimer;
