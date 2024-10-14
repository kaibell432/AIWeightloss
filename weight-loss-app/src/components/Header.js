import React from "react";
import { Menu } from "semantic-ui-react";
import { NavLink } from 'react-router-dom';
import './css/Header.css';

const Header = () => (
    <Menu fixed="top" inverted>
        <Menu.Item as={NavLink} to="/" header className="weight-loss-app">
        Weight Loss App
        </Menu.Item>
        <Menu.Item as={NavLink} to="/meal-plan-generator" className="meal-plan-generator">
        Meal Plan Generator
        </Menu.Item>
    </Menu>
);

export default Header;