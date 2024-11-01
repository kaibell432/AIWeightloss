import React from "react";
import { Menu, MenuMenu, Icon } from "semantic-ui-react";
import { NavLink } from 'react-router-dom';
import './css/Header.css';

const Header = ({ isAuthenticated, onLogout, isMobile, handleToggle }) => {
    return (
        <>
            {isMobile ? (
                <Menu className="navbar" fixed="top" inverted>
                    <Menu.Item onClick={handleToggle}>
                        <Icon name="sidebar" />
                    </Menu.Item>
                    <Menu.Item as={NavLink} to="/" header>
                        Home
                    </Menu.Item>
                </Menu>
            ) : (
                <Menu className="navbar" fixed="top" inverted>
                    <Menu.Item as={NavLink} to="/" header className="home">
                    Home
                    </Menu.Item>
                    <Menu.Item as={NavLink} to="/weight-suggestions" className="weight-loss-app">
                    Weight Suggestions
                    </Menu.Item>
                    <Menu.Item as={NavLink} to="/meal-plan-generator" className="meal-plan-generator">
                    Meal Plan Generator
                    </Menu.Item>

                    <MenuMenu fixed="top" position="right">
                        {isAuthenticated ? (
                            <>
                                <Menu.Item as={NavLink} to="/account" className="account">
                                    Account
                                </Menu.Item>
                                <Menu.Item onClick={onLogout} className="logout">
                                    Log Out
                                </Menu.Item>
                            </>
                        ) : (
                            <>
                                <Menu.Item as={NavLink} to="/login" className="login">
                                Log In
                                </Menu.Item>
                                <Menu.Item as={NavLink} to="/register" className="register">
                                    Register
                                </Menu.Item>
                            </>
                        )}
                    </MenuMenu>
                </Menu>
            )}
        </>
    );
};

export default Header;