import React from "react";
import './css/Footer.css';

const Footer = () => (
    <footer className="footer">
        <div className="container">
            <p>&copy; {new Date().getFullYear()} Weight Loss App. All rights reserved.</p>
        </div>
    </footer>
);

export default Footer;