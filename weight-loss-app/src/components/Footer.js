import React from "react";
// import './Footer.css';

const Footer = () => (
    <footer className="footer">
        <div className="container">
            <p>&copy; {new Date().getFullYear()} Weight Loss App. All rights reserved.</p>
            <nav className="footer-nav">
                <ul className="footer-nav-list">
                    <li><a href="#privacy">Privacy Policy</a></li>
                    <li><a href="#terms">Terms of Service</a></li>
                </ul>
            </nav>
        </div>
    </footer>
);

export default Footer;