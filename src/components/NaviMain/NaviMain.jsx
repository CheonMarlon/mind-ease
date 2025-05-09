import React from 'react';
import { useNavigate } from 'react-router-dom';
import './NaviMain.css';

const NaviMain = () => {
  const navigate = useNavigate();

  return (
    <div className="nav-container">
      <div className="nav-item" onClick={() => navigate('/main')}>
        <i className="fas fa-home"></i>
        <div className="tooltip">Home</div>
      </div>

      <div className="nav-item" onClick={() => navigate('/books')}>
        <i className="fas fa-book"></i>
        <div className="tooltip">Library</div>
      </div>

      <div className="nav-item" onClick={() => navigate('/podcast')}>
        <i className="fas fa-podcast"></i>
        <div className="tooltip">Podcast</div>
      </div>

      <div className="nav-item" onClick={() => navigate('/journal')}>
        <i className="fas fa-pencil"></i>
        <div className="tooltip">Journal</div>
      </div>

      <div className="nav-item" onClick={() => navigate('/timer')}>
        <i className="fas fa-spa"></i>
        <div className="tooltip">Meditation</div>
      </div>

      <div className="nav-item" onClick={() => navigate('/art')}>
        <i className="fas fa-paint-brush"></i>
        <div className="tooltip">Artspace</div>
      </div>

      <div className="nav-item" onClick={() => navigate('/analytics')}>
        <i className="fas fa-chart-pie"></i>
        <div className="tooltip">Analytics</div>
      </div>

      <div className="nav-item" onClick={() => navigate('/')}>
        <i className="fas fa-sign-out-alt"></i>
        <div className="tooltip">Logout</div>
      </div>
    </div>
  );
};

export default NaviMain;
