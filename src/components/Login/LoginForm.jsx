import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, set } from 'firebase/database'; // Import Realtime Database methods
import './LoginForm.css';

const LoginForm = () => {
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupUsername, setSignupUsername] = useState('');

  const navigate = useNavigate();

  const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL, // Realtime Database URL
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
    measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
  };

  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);
  const database = getDatabase(app); // Initialize Realtime Database

  // Login Handler
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await signInWithEmailAndPassword(auth, loginEmail, loginPassword);
      alert('Login successful!');

      navigate('/loading');
      setTimeout(() => {
        navigate('/emotes');
      }, 3000);
    } catch (err) {
      alert(err.message || 'Login failed');
    }
  };

  // Signup Handler
  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      // Create user with email and password
      const userCredential = await createUserWithEmailAndPassword(auth, signupEmail, signupPassword);
      const user = userCredential.user;

      // Save username and email to Realtime Database (instead of Firestore)
      const userRef = ref(database, 'users/' + user.uid); // Create a reference for the user
      await set(userRef, {
        username: signupUsername,
        email: signupEmail,
        createdAt: new Date().toISOString(), // You can store more info as needed
      });

      alert('Signup successful! Please log in.');
    } catch (err) {
      alert(err.message || 'Signup failed');
    }
  };

  return (
    <div className="login-modal-wrapper">
      <div className="wrapper">
        <div className="card-switch">
          <label className="switch">
            <input className="toggle" type="checkbox" />
            <span className="slider" />
            <span className="card-side" />
            <div className="flip-card__inner">
              {/* Login Form Front */}
              <div className="flip-card__front">
                <div className="title">Log in</div>
                <form className="flip-card__form" onSubmit={handleLogin}>
                  <input
                    type="email"
                    placeholder="Email"
                    className="flip-card__input"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    required
                  />
                  <input
                    type="password"
                    placeholder="Password"
                    className="flip-card__input"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    required
                  />
                  <button className="flip-card__btn" type="submit">Let's go!</button>
                </form>
              </div>

              {/* Sign Up Form Back */}
              <div className="flip-card__back">
                <div className="title">Sign up</div>
                <form className="flip-card__form" onSubmit={handleSignup}>
                  <input
                    type="text"
                    placeholder="Username"
                    className="flip-card__input"
                    value={signupUsername}
                    onChange={(e) => setSignupUsername(e.target.value)}
                    required
                  />
                  <input
                    type="email"
                    placeholder="Email"
                    className="flip-card__input"
                    value={signupEmail}
                    onChange={(e) => setSignupEmail(e.target.value)}
                    required
                  />
                  <input
                    type="password"
                    placeholder="Password"
                    className="flip-card__input"
                    value={signupPassword}
                    onChange={(e) => setSignupPassword(e.target.value)}
                    required
                  />
                  <button className="flip-card__btn" type="submit">Confirm!</button>
                </form>
              </div>
            </div>
          </label>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
