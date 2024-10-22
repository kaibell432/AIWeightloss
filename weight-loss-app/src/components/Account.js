import React, { useState, useEffect } from 'react';
import { Form, Button, Menu, Segment, Message } from 'semantic-ui-react';
import './css/Account.css';
import SavedMealPlans from './SavedMealPlans';

function Account () {
    const [activeItem, setActiveItem] = useState('accountInfo');
    const [userInfo, setUserInfo] = useState({
        username: '',
        firstName: '',
        lastName: '',
    });
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    // Fetch user info
    useEffect(() => {
        const fetchUserInfo = async () => {
            try {
                const response = await fetch('/api/user', {
                    credentials: 'include',
                });
                const data = await response.json();
                if (response.ok) {
                    setUserInfo(data.user);
                } else {
                    setError(data.message || 'Failed to fetch user information');
                }
            } catch (err) {
                console.error('Error fetching user info:', err);
                setError('An error occurred while fetching user information;')
            }
        };

        fetchUserInfo();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('/api/user', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({
                    firstName: userInfo.firstName,
                    lastName: userInfo.lastName,
                }),
            });
            const data = await response.json();
            if (response.ok) {
                setUserInfo(data.user);
                setMessage(data.message);
                setError('');
            } else {
                setError(data.message || 'Failed to update user information');
                setMessage('');
            }
        } catch (err) {
            console.error('Error updating user info:', err);
            setError('An error occurred while updating user information');
            setMessage('');
        }
    };

    const handleChange = (e, { name, value }) => {
        setUserInfo((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleItemClick = (e, { name }) => {
        setActiveItem(name);
        setMessage('');
        setError('');
    }

    const renderContent = () => {
        switch (activeItem) {
            case 'accountInfo':
                return (
                    <>
                        <Form onSubmit={handleSubmit}>
                            <Form.Input
                                label="Username"
                                name="username"
                                value={userInfo.username}
                                disabled
                            />
                            <Form.Input
                                label="Email"
                                name="email"
                                value={userInfo.email || ''}
                                onChange={handleChange}
                                placeholder="Enter your email (optional)"
                            />
                            <Form.Input
                                label="First Name"
                                name="firstName"
                                value={userInfo.firstName || ''}
                                onChange={handleChange}
                                placeholder="Enter your first name (optional)"
                            />
                            <Form.Input
                                label="Lst Name"
                                name="lastName"
                                value={userInfo.lastName || ''}
                                onChange={handleChange}
                                placeholder="Enter your last name (optional)"
                            />
                            <Button type="submit" primary>Save changes</Button>
                        </Form>
                        {message && <Message positive>{message}</Message>}
                        {error && <Message negative>{error}</Message>}
                    </>
                );
            case 'savedMealPlans':
                return <SavedMealPlans />;
            default:
                return null;
        }
    };

    return (
        <div className="account-page">
            <h2>My Account</h2>
            <Menu pointing secondary inverted className="account-menu">
                <Menu.Item
                    name="accountInfo"
                    active={activeItem === 'accountInfo'}
                    onClick={handleItemClick}
                    >
                        Account Information
                </Menu.Item>
                <Menu.Item
                    name="savedMealPlans"
                    active={activeItem === 'savedMealPlans'}
                    onClick={handleItemClick}
                >
                    Saved Meal Plans
                </Menu.Item>
            </Menu>
            <Segment className="account-content">{renderContent()}</Segment>
        </div>
    );

}

export default Account;