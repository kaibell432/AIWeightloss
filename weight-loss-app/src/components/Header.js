import React from "react";
import { Menu, MenuMenu, } from "semantic-ui-react";
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

        <MenuMenu fixed="top" position="right">
        <   Menu.Item as={NavLink} to="/login" className="login">
                Log In
            </Menu.Item>
            <Menu.Item as={NavLink} to="/register" className="login">
                Register
            </Menu.Item>
        </MenuMenu>
    </Menu>
);

export default Header;