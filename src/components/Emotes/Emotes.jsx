import React, { useState, useEffect } from 'react';
import './Emotes.css';
import { useNavigate } from 'react-router-dom';
import { initializeApp } from 'firebase/app';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { getDatabase, ref, set, get } from 'firebase/database'; 


const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL, 
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getDatabase(app); 

const Emotes = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [username, setUsername] = useState(''); // Store the username here

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        // Fetch the username from Realtime Database after user logs in
        fetchUserName(currentUser.uid);
      }
    });
    return () => unsubscribe();
  }, []);

  // Fetch username from Firebase Realtime Database
  const fetchUserName = async (userId) => {
    const userRef = ref(db, 'users/' + userId);  // Path to the user's data
    const snapshot = await get(userRef);

    if (snapshot.exists()) {
      const userData = snapshot.val();
      setUsername(userData.username);  // Update the username state
    } else {
      console.log('No user data available');
      setUsername('Anonymous');
    }
  };

  // Function to get the current day of the week
  const getDayOfWeek = () => {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const currentDay = new Date().getDay();
    return days[currentDay];
  };

  const handleClick = async (emoji) => {
    if (!user) {
      alert('You need to be logged in to track your emotion.');
      return;
    }

    try {
      const idToken = await user.getIdToken();

      // Get the current day of the week
      const currentDay = getDayOfWeek();

      // Emotion data with username and day of the week
      const emotionData = {
        userId: user.uid,
        username: username || 'Anonymous',  // Use fetched username, fallback to 'Anonymous'
        emoji: emoji,
        timestamp: new Date().toISOString(),
        dayOfWeek: currentDay,
        idToken: idToken, 
      };

      // Create a unique reference in the Realtime Database
      const emotionRef = ref(db, 'emotes/' + user.uid + '/' + Date.now());
      await set(emotionRef, emotionData); // Save to Realtime Database

      console.log('Emotion saved to Realtime Database');

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
