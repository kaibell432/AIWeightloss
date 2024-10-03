import React from "react";
// import './Header.css';

const Header = () => (
    <header className="header">
        <div className="container">
            <h1 className="logo">Weight Loss App</h1>
            <nav className="nav">
                <ul className="nav-list">
                    <li><a href="#home">Home</a></li>
                    <li><a href="#features">Features</a></li>
                </ul>
            </nav>
        </div>
    </header>
);

export default Header;