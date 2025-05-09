import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { getDatabase, ref, get, child } from 'firebase/database';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import './Analytics.css';
import NaviMain from '../NaviMain/NaviMain';

const EMOJI_COLORS = {
  '😠': '#ff4d4d',
  '😢': '#4da6ff',
  '😐': '#a6a6a6',
  '😊': '#ffd966',
  '🤩': '#a3ff57'
};

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

const getEmotionInterpretation = (emotion) => {
  const interpretations = {
    '😠': "Hey, it's okay to feel angry. That fire inside you? It’s trying to protect something important. Pause. Breathe. Use that energy to speak up, set boundaries, or take action for what truly matters to you. You’re not out of control—you’re learning where your lines are. 💪",
  
    '😢': "It’s alright to feel down. Sadness isn’t weakness—it’s your heart being honest. Let the tears fall if they need to. Healing often starts with feeling. You’re allowed to slow down. You're allowed to hurt. Just don’t forget: this won't last forever. 🌧️➡️☀️",
  
    '😐': "Feeling numb doesn’t mean you’re broken—it means you’ve been holding too much for too long. Give yourself space to rest, to just be. You’re still here, and that’s something. Even flat days are part of the story. One step at a time is still progress. 🕊️",
  
    '😊': "You’re glowing right now—let yourself feel it fully. Celebrate this joy, no matter how small. You’ve earned this peace, this light moment. Keep collecting the things that make you smile—you never know who you’re inspiring just by being happy. ✨",
  
    '🤩': "Your heart’s racing because something great is coming—don’t hold back. Let the spark move you forward. You’re meant to chase the things that make you feel alive. Keep that thrill close; it's your compass pointing to passion and purpose. 🚀"
  };

  return interpretations[emotion] || 'No interpretation available';
};

const Analytics = () => {
  const [user, setUser] = useState(null);
  const [weeklyData, setWeeklyData] = useState([]);
  const [dateRange, setDateRange] = useState('');
  const [todayEmotion, setTodayEmotion] = useState(null);
  const [todayEmotionInterpretation, setTodayEmotionInterpretation] = useState('');

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        fetchWeeklyEmotions(currentUser.uid);
        setDateRange(getCurrentWeekRange());
      }
    });

    return () => unsubscribe();
  }, []);

  const getCurrentWeekRange = () => {
    const now = new Date();
    const dayOfWeek = now.getDay();
    const monday = new Date(now);
    monday.setDate(now.getDate() - ((dayOfWeek + 6) % 7));
    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);

    const format = (date) => date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });

    return `${format(monday)} – ${format(sunday)}`;
  };

  const fetchWeeklyEmotions = async (userId) => {
    const dbRef = ref(getDatabase());
    const emotesPath = `emotes/${userId}`;
    const snapshot = await get(child(dbRef, emotesPath));

    if (snapshot.exists()) {
      const allEmotions = Object.values(snapshot.val());

      // Initialize counts for each day of the week and each emoji
      const weeklyCounts = {
        Sunday: { '😠': 0, '😢': 0, '😐': 0, '😊': 0, '🤩': 0 },
        Monday: { '😠': 0, '😢': 0, '😐': 0, '😊': 0, '🤩': 0 },
        Tuesday: { '😠': 0, '😢': 0, '😐': 0, '😊': 0, '🤩': 0 },
        Wednesday: { '😠': 0, '😢': 0, '😐': 0, '😊': 0, '🤩': 0 },
        Thursday: { '😠': 0, '😢': 0, '😐': 0, '😊': 0, '🤩': 0 },
        Friday: { '😠': 0, '😢': 0, '😐': 0, '😊': 0, '🤩': 0 },
        Saturday: { '😠': 0, '😢': 0, '😐': 0, '😊': 0, '🤩': 0 }
      };

      // Count emotions for each day
      allEmotions.forEach(entry => {
        const entryDate = new Date(entry.timestamp);
        const day = DAYS[entryDate.getDay()];
        if (weeklyCounts[day]) {
          weeklyCounts[day][entry.emoji]++;
        }
      });

      // Convert weeklyCounts to the format needed for BarChart
      const data = Object.keys(weeklyCounts).map(day => ({
        day,
        '😠': weeklyCounts[day]['😠'],
        '😢': weeklyCounts[day]['😢'],
        '😐': weeklyCounts[day]['😐'],
        '😊': weeklyCounts[day]['😊'],
        '🤩': weeklyCounts[day]['🤩']
      }));

      setWeeklyData(data);

      // Get today's most frequent emotion
      const today = new Date();
      const todayDay = DAYS[today.getDay()];
      const todayMaxEmoji = Object.keys(weeklyCounts[todayDay]).reduce((a, b) => 
        weeklyCounts[todayDay][a] > weeklyCounts[todayDay][b] ? a : b
      );

      setTodayEmotion(todayMaxEmoji);
      setTodayEmotionInterpretation(getEmotionInterpretation(todayMaxEmoji));
    }
  };

  return (
    <div className="analytics-main">
      <div className="nav-con">
        <NaviMain />
      </div>
      <img src="/assets/backgrounds/Analytics.png" alt="Analytics Background" className="analytics-bg" />

      <div className="analytics-con">
        <div style={{ width: '100%', maxWidth: '600px', margin: '-1rem auto', textAlign: 'center' }}>
          <h2>Today's Mood</h2>
          <p style={{ fontSize: '0.9rem', color: '#555', marginBottom: '0.5rem' }}>
            {dateRange}
          </p>
        </div>

        {/* Add BarChart below */}
        <div style={{ width: '100%', maxWidth: '700px', margin: '0.5rem auto' }}>
          <h3>Weekly Emotion Trends</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={weeklyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Legend />
              {['😠', '😢', '😐', '😊', '🤩'].map(emoji => (
                <Bar key={emoji} dataKey={emoji} fill={EMOJI_COLORS[emoji]} />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </div>
        {todayEmotion ? (
            <>
              <div className="emotion-section">
                <h3 className="emotion-title">Emotion of The Day: {todayEmotion}</h3>
                <p className="emotion-interpretation">{todayEmotionInterpretation}</p>
              </div>
            </>
          ) : (
            <p>No mood data available for today.</p>
          )}
      </div>
    </div>
  );
};

export default Analytics;
