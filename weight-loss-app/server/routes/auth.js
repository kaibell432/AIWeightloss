const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const User = require('../models/User');

// Registration Route
router.post('/register', async (req, res) => {
    try {
      let { username, password } = req.body;
  
      if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required.' });
      }
  
      username = username.toLowerCase();
      
      // Check if user exists already
      const userExists = await User.findOne({ username });
      if (userExists) {
        return res.status(400).json({ message: 'Username already taken' });
      }
  
      // Encrypt Pass
      const saltRounds = 10;
      const hashedPass = await bcrypt.hash(password, saltRounds);
  
      // Create user
      const newUserData = new User({
        username,
        password: hashedPass,
      });
  
      const newUser = new User(newUserData);
      await newUser.save();
  
      // Auto login after registration
      req.session.userId = newUser._id;
  
      res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
      console.error('Registration error:', error);
      res.status(500).json({ message: 'Server error during registration' });
    }
  });
  
  // Login Route
  router.post('/login', async (req, res) => {
    try {
      console.log('req.body', req.body);
      let {username, password} = req.body;
  
      if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required' });
      }
  
      username = username.toLowerCase();
  
      // Find user
      const user = await User.findOne({ username });
      if (!user) {
        return res.status(400).json({ message: 'Invalid username or password' });
      }
  
      // Compare passwords
      const passwordMatch = await bcrypt.compare(password, user.password);
      if (!passwordMatch) {
        return res.status(400).json({ message: 'Invalid username or password' });
      }
  
      // Set user session
      req.session.userId = user._id;
  
      res.json({ message: 'Login successful' });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ message: 'Server error during login' });
    }
  });
  
  // Logout Route
  router.post('/logout', (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        console.error('Logout error:', err);
        return res.status(500).json({ message: 'Server error during logout' });
      }
      res.clearCookie('connect.sid');
      res.json({ message: 'Logout successful' });
    });
  });

  module.exports = router;