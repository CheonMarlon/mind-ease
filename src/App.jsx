import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

import LandingPage from './components/LandingPage/LandingPage'
import Emotes from './components/Emotes/Emotes'
import MedTimer from './components/MedTimer/MedTimer'
import Podcast from './components/Podcast/Podcast'
import Book from './components/Books/Book'
import Journal from './components/Journal/Journal'
import Loading from './components/Loading/Loading'
import ArtSpace from './components/ArtSpace/ArtSpace'
import Homepage from './components/Homepage/Homepage'
import Analytics from './components/Analytics/Analytics'



const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/loading" element={<Loading />} />
        <Route path="/main" element={<Homepage />} />
        <Route path="/emotes" element={<Emotes />} />
        <Route path="/timer" element={<MedTimer />} />
        <Route path="/podcast" element={<Podcast />} />
        <Route path="/books" element={<Book />} />
        <Route path="/journal" element={<Journal />} />
        <Route path='/art' element={<ArtSpace />}/>
        <Route path="/analytics" element={<Analytics />} />
      </Routes>
    </Router>
  )
}

export default App
