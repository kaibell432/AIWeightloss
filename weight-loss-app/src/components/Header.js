import React from "react";
import { Menu } from "semantic-ui-react";
import { NavLink } from 'react-router-dom';
import './css/Header.css';

const Header = () => (
    <Menu fixed="top" inverted>
        <Menu.Item header>
            <NavLink to="/" exact>
                Weight Loss App
            </NavLink>
        </Menu.Item>
        <Menu.Item header>
            <NavLink as={NavLink} to="/" exact>
                Home
            </NavLink>
        </Menu.Item>
        <Menu.Item header>
        <NavLink as={NavLink} to="/" exact>
                Meal Plan Generator
            </NavLink>
        </Menu.Item>
    </Menu>
);

export default Header;