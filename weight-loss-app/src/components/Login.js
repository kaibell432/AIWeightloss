import React, { useState, useEffect } from 'react';
import {
    FormGroup,
    Button,
    Form,
    Input,
  } from 'semantic-ui-react';
import './css/LoginRegister.css';
import { useNavigate } from 'react-router-dom';

function Login( { setIsAuthenticated } ) {

    useEffect(() => {
        // On component mount, prevent scrolling
        document.body.style.overflow = 'hidden';
    
        // Cleanup function to reset the overflow when the component unmounts
        return () => {
          document.body.style.overflow = 'auto';
        };
      }, []);

      
    const [formData, setFormData] = useState({
        username: '',
        password: '',
    });

    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        fetch('/api/login', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(formData),
            credentials: 'include',
        })
        .then(res => res.json())
        .then(data => {
            if (data.message === 'Login successful') {
                setIsAuthenticated(true);
                navigate('/');
                alert(data.message);
            } else {
                alert(data.message);
            }
        })
        .catch(error => {
            console.error('Login error:', error);
            setMessage('An error occurred during login.');
            alert(message);
        });
    };

    return (
        <body className="login-body">
            <div className="login-container">
                <div className="logreg-header">
                    <h2>Login</h2>
                </div>
                <Form onSubmit={handleSubmit} inverted className="login-form">
                    <FormGroup widths='equal'>
                        <Form.Field
                            control={Input}
                            type="text"
                            name="username"
                            placeholder="Username"
                            onChange={handleChange}
                            value={formData.username}
                            required
                        />
                        <Form.Field
                            control={Input}
                            type="password"
                            name="password"
                            placeholder="Password"
                            onChange={handleChange}
                            value={formData.password}
                            required
                        />
                    </FormGroup>
                    <Button type="submit" className="login-button">Login</Button>
                </Form>
            </div>
        </body>    
    );
}

export default Login;