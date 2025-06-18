import React, { useState, useEffect } from 'react';
import './Emotes.css';
import { useNavigate } from 'react-router-dom';
import { initializeApp } from 'firebase/app';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const Emotes = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const handleClick = async (emoji) => {
    if (!user) {
      alert('You need to be logged in to track your emotion.');
      return;
    }

    try {
      const idToken = await user.getIdToken();

      await fetch('/api/emotes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          idToken,
          emotes: emoji,
        }),
      });

      console.log('Emotion sent to backend');

      navigate('/loading');
      setTimeout(() => navigate('/main'), 3000);
    } catch (error) {
      console.error('Error sending emoji:', error);
      alert('Failed to track emotion. Try again.');
    }
  };

  return (
    <div className='emote-main'>
      <h1 className='emote-h1'>How are you feeling today?</h1>
      <div className='emote-container'>
        <div className='emote' onClick={() => handleClick('😠')}>
          <img src='/assets/emojis/angry.png' alt='Angry' className='emote-img emote-angry' />
          <p className='emote-text'>Angry</p>
        </div>
        <div className='emote' onClick={() => handleClick('😢')}>
          <img src='/assets/emojis/sad.png' alt='Sad' className='emote-img emote-sad' />
          <p className='emote-text'>Sad</p>
        </div>
        <div className='emote' onClick={() => handleClick('😐')}>
          <img src='/assets/emojis/neutral.png' alt='Neutral' className='emote-img emote-neutral' />
          <p className='emote-text'>Neutral</p>
        </div>
        <div className='emote' onClick={() => handleClick('😊')}>
          <img src='/assets/emojis/happy.png' alt='Happy' className='emote-img emote-happy' />
          <p className='emote-text'>Happy</p>
        </div>
        <div className='emote' onClick={() => handleClick('🤩')}>
          <img src='/assets/emojis/ecstatic.png' alt='Ecstatic' className='emote-img emote-ecstatic' />
          <p className='emote-text'>Ecstatic</p>
        </div>
      </div>
    </div>
  );
};

export default Emotes;
