import React, { useState } from 'react'
import './LandingPage.css'
import { useNavigate } from 'react-router-dom'
import Navbar from '../NavBar/NavBar'
import LoginForm from '../Login/LoginForm'
const LandingPage = () => {
  const [showLogin, setShowLogin] = useState(false)

  const handleJoinClick = () => {
    setShowLogin(true)
  }

  const handleCloseLogin = () => {
    setShowLogin(false)
  }

  return (
    <div className='landing-page-main'>
      <div className="landing-nav">
        <Navbar />
      </div>
      <div className="landing-page-container">
        <div className="lp-left-side">
          <div className="lp-left-side-content">
            <h1 className='lp-h1'>YOUR PERSONAL SPACE FOR WELLNESS & GROWTH</h1>
            <p className='lp-p1'>MindEase helps you track your emotions, reflect with guided journaling, and receive daily motivation to support your journey to self-awareness and a healthier mind.</p>
            <button className="lp-join-btn" onClick={handleJoinClick}>JOIN NOW</button>
          </div>
        </div>
        <div className="lp-right-side">
        </div>
      </div>

      {showLogin && (
        <div className="login-modal">
          <div className="login-overlay" onClick={handleCloseLogin}></div>
          <div className="login-content">
            <LoginForm onClose={handleCloseLogin} />
          </div>
        </div>
      )}
    </div>
  )
}

export default LandingPage
