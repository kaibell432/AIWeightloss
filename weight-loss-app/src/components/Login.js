import React, { useState } from 'react';
import {
    FormInput,
    FormGroup,
    FormCheckbox,
    Button,
    Form,
    Segment,
    Input,
  } from 'semantic-ui-react';
import './css/Register.css';

function Login() {
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

        fetch('/api/login', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(formData),
            credentials: 'include',
        })
        .then(res => res.json())
        .then(data => {
            if (data.message === 'Login successful') {
            } else {
                alert(data.message);
            }
        })
        .catch(error => {
            console.error('Login error:', error);
            setMessage('An error occurred during login.');
        });
    };

    return (
        <div className="form-container">
            <h2 className="form-header">Login</h2>
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
                <Button type="submit">Login</Button>
            </Form>
        </div>
    );
}

export default Login;