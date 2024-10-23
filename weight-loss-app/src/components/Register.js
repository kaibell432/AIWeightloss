import React, { useState, useEffect } from 'react';
import {
    FormGroup,
    Button,
    Form,
    Input,
  } from 'semantic-ui-react';
import './css/LoginRegister.css';

function Register() {

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

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        console.log('FormData before sending:', formData);

        fetch('/api/register', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(formData),
            credentials: 'include'
        })
        .then(res => res.json())
        .then(data => {
            if (data.message === 'User registered successfully') {
                alert('Registration successful! You may now log in.');
            } else {
                alert(data.message);
            }
        })
        .catch(error => {
            console.error('Registration error:', error);
            setMessage('An error occurred during registration.');
        });
    };

    return (
        <body className="reg-body">
            <div className="register-container">
                <div className="logreg-header">
                    <h2>Register</h2>
                </div>
                <Form onSubmit={handleSubmit} inverted className="reg-form">
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
                    <Button type="submit" className="reg-button">Register</Button>
                </Form>
            </div>
        </body>
    );
}

export default Register;