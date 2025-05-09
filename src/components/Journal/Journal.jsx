import React, { useState, useEffect } from 'react';
import './Journal.css';
import NaviMain from '../NaviMain/NaviMain';
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, set, get, child, remove } from 'firebase/database';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

// Firebase configuration (use your own credentials)
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL, // Realtime Database URL
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const auth = getAuth(app);

const Journal = () => {
  const [selectedJournal, setSelectedJournal] = useState(false);
  const [noteContent, setNoteContent] = useState('');
  const [noteTitle, setNoteTitle] = useState('');
  const [savedNotes, setSavedNotes] = useState({});
  const [selectedNoteKey, setSelectedNoteKey] = useState('');
  const [userId, setUserId] = useState(null);

  // Get the current logged-in user
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserId(user.uid);
        loadNotes(user.uid); // Load notes for the current user
      } else {
        setUserId(null);
      }
    });

    return () => unsubscribe();
  }, []);

  // Load saved notes from Firebase Realtime Database
  const loadNotes = async (userId) => {
    const notesRef = ref(db, 'users/' + userId + '/notes');
    try {
      const snapshot = await get(notesRef);
      if (snapshot.exists()) {
        setSavedNotes(snapshot.val());
      } else {
        setSavedNotes({});
      }
    } catch (error) {
      alert('Error loading notes: ' + error.message);
    }
  };

  // Save a new note or overwrite an existing note in Realtime Database
  const saveNote = async () => {
    if (!noteTitle.trim()) {
      alert('Please enter a note title!');
      return;
    }

    if (!userId) {
      alert('You must be logged in to save notes!');
      return;
    }

    const noteRef = ref(db, 'users/' + userId + '/notes/' + noteTitle);
    try {
      // Save or update note in Realtime Database
      await set(noteRef, { content: noteContent });

      alert(`Saved note: "${noteTitle}"!`);

      // Update savedNotes state to reflect changes
      setSavedNotes((prev) => ({
        ...prev,
        [noteTitle]: noteContent,
      }));

      setNoteTitle('');
      setNoteContent('');
    } catch (error) {
      alert('Error saving note: ' + error.message);
    }
  };

  // Load a specific saved note into the editor
  const loadNote = (key) => {
    setNoteTitle(key); // Set the note title in the input field
    setNoteContent(savedNotes[key]); // Set the note content into the textarea
    setSelectedNoteKey(key); // Keep track of which note is selected
  };

  // Delete a specific note from Realtime Database
  const deleteNote = async (key) => {
    const noteRef = ref(db, 'users/' + userId + '/notes/' + key);

    try {
      // Delete note from Realtime Database
      await remove(noteRef);

      alert(`Deleted note "${key}"!`);

      // Update savedNotes state to reflect deletion
      const updatedNotes = { ...savedNotes };
      delete updatedNotes[key];
      setSavedNotes(updatedNotes);
    } catch (error) {
      alert('Error deleting note: ' + error.message);
    }
  };

  const journals = [
    {
      coverImage: './assets/books/journcover.png',
    },
  ];

  return (
    <div className="journal-main">
      <div className="nav-main">
        <NaviMain />
      </div>
      <div className="journal-container">
        {journals.map((journal, index) => (
          <div
            key={index}
            className="journal-cover"
            style={{ backgroundImage: `url(${journal.coverImage})` }}
            onClick={() => setSelectedJournal(true)}
          ></div>
        ))}
      </div>

      {selectedJournal && (
        <div className="modal-overlay modal-open" onClick={() => setSelectedJournal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="notebook-page left-page">
              <div className="lined-paper"></div>
              <div className="note-controls">
                <h3 className="note-header">Your Safe Space Journal</h3>
                <input
                  type="text"
                  placeholder="Enter note title..."
                  value={noteTitle}
                  onChange={(e) => setNoteTitle(e.target.value)} // Allow title to be editable
                  className="note-input"
                />
                <button className="save-btn" onClick={saveNote}>
                  🌟 Keep Going!
                </button>
                <select
                  value={selectedNoteKey}
                  onChange={(e) => loadNote(e.target.value)}
                  className="note-select"
                >
                  <option value="">Choose a saved note...</option>
                  {Object.keys(savedNotes).map((key) => (
                    <option key={key} value={key}>
                      {key}
                    </option>
                  ))}
                </select>
                {selectedNoteKey && (
                  <button className="delete-btn" onClick={() => deleteNote(selectedNoteKey)}>
                    ❌ Delete Note
                  </button>
                )}
              </div>
            </div>

            <div className="notebook-page right-page">
              <textarea
                className="notepad-textarea"
                value={noteContent}
                onChange={(e) => setNoteContent(e.target.value)}
                placeholder="Start writing your notes here..."
              ></textarea>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Journal;
