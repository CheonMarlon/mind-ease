import React from 'react';
import './Navbar.css';  

const Navbar = () => {
    return (
        <nav className="navbar">
            <div className="navbar-logo">
                <div className="circle-logo"></div>
                <h1 className="mind-ease-title">
                    <span className="mind">Mind</span>
                    <span className="ease">Ease</span>
                </h1>            
            </div>
        </nav>
    );
}

export default Navbar;
