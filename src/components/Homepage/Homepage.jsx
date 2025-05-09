import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../NavBar/NavBar';
import './Homepage.css'; 

const Homepage = () => {
  const navigate = useNavigate();

  return (
    <div className="home-main">
        <div className="nav-con">
            <Navbar />
        </div>
        <div className="blur-background"></div>
        <img className='home-board' src="./assets/backgrounds/Board.png" alt="cork-board" />
      <div className="home-container">

        <div className="upper-home">
            <div className="home-item" onClick={() => navigate('/books')}>
            <i className="fa-solid fa-book"></i>
                <h6 className='home-font'>Library</h6>
            </div>

            <div className="home-item" onClick={() => navigate('/podcast')}>
            <i className="fa-solid fa-podcast"></i>
                <h6 className='home-font'>Podcasts</h6>
            </div>

            <div className="home-item" onClick={() => navigate('/journal')}>
            <i className="fa-solid fa-pencil"></i>
                <h6 className='home-font'>Journal</h6>
            </div>
        </div>

        <div className="lower-home">
            <div className="home-item" onClick={() => navigate('/timer')}>
            <i className="fas fa-spa"></i>
                <h6 className='home-font'>Meditation</h6>
            </div>

            <div className="home-item" onClick={() => navigate('/art')}>
            <i className="fas fa-paint-brush"></i>
                <h6 className='home-font'>Artspace</h6>
            </div>

            <div className="home-item" onClick={() => navigate('/analytics')}>
            <i className="fa-solid fa-chart-pie"></i>
                <h6 className='home-font'>Analytics</h6>
            </div>
        </div>   

      </div>
    </div>
  );
};

export default Homepage;
