// /api/emotes.js
import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getDatabase } from 'firebase-admin/database';
import { getAuth } from 'firebase-admin/auth';
import { readFileSync } from 'fs';
import path from 'path';

const firebaseConfig = {
  credential: cert(JSON.parse(readFileSync(process.env.FIREBASE_KEY_PATH))),
  databaseURL: process.env.DATABASE_URL,
};

if (!getApps().length) {
  initializeApp(firebaseConfig);
}

const db = getDatabase();
const auth = getAuth();

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    const { idToken, emotes } = req.body;

    if (!idToken || !emotes) {
      return res.status(400).json({ message: 'Missing ID Token or emoji' });
    }

    const decodedToken = await auth.verifyIdToken(idToken);
    const uid = decodedToken.uid;

    const userRef = db.ref(`users/${uid}`);
    const snapshot = await userRef.get();

    if (!snapshot.exists()) {
      return res.status(404).json({ message: 'User not found in Firebase' });
    }

    const today = new Date().toLocaleDateString('en-US', { weekday: 'long' });
    const timestamp = new Date().toISOString();

    const emojiRef = db.ref(`emoji_tracker/${uid}/${today}`);
    await emojiRef.push({
      emotes,
      timestamp
    });

    return res.status(200).json({ message: `${emotes} saved for ${today} at ${timestamp}` });

  } catch (error) {
    return res.status(500).json({ message: `Error: ${error.message}` });
  }
}
