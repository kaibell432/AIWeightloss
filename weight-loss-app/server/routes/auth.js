const express = require('express');
const bcrypt = require('bcrypt');
const rateLimit = require('express-rate-limit');
const User = require('../models/User');
const { isAuthenticated } = require('../middleware/auth');

const router = express.Router();

// Slow down password guessing.
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 20,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: { message: 'Too many attempts. Please wait a few minutes and try again.' },
});

const USERNAME_RE = /^[a-z0-9_.-]{3,30}$/;

// Start a fresh session on login/registration (prevents session fixation).
function startSession(req, userId) {
  return new Promise((resolve, reject) => {
    req.session.regenerate((err) => {
      if (err) return reject(err);
      req.session.userId = userId;
      req.session.save((saveErr) => (saveErr ? reject(saveErr) : resolve()));
    });
  });
}

router.get('/checkAuth', (req, res) => {
  res.json({ isAuthenticated: Boolean(req.session?.userId) });
});

router.post('/register', authLimiter, async (req, res) => {
  try {
    const username = String(req.body?.username || '').trim().toLowerCase();
    const password = String(req.body?.password || '');

    if (!USERNAME_RE.test(username)) {
      return res.status(400).json({ message: 'Username must be 3-30 characters: letters, numbers, dot, dash or underscore.' });
    }
    if (password.length < 8) {
      return res.status(400).json({ message: 'Password must be at least 8 characters.' });
    }
    if (await User.exists({ username })) {
      return res.status(409).json({ message: 'That username is already taken.' });
    }

    const user = await User.create({ username, password: await bcrypt.hash(password, 12) });
    await startSession(req, user._id);
    res.status(201).json({ message: 'Account created!' });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error during registration.' });
  }
});

router.post('/login', authLimiter, async (req, res) => {
  try {
    const username = String(req.body?.username || '').trim().toLowerCase();
    const password = String(req.body?.password || '');
    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password are required.' });
    }

    const user = await User.findOne({ username });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: 'Invalid username or password.' });
    }

    await startSession(req, user._id);
    res.json({ message: 'Welcome back!' });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login.' });
  }
});

router.post('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error('Logout error:', err);
      return res.status(500).json({ message: 'Server error during logout.' });
    }
    res.clearCookie('connect.sid');
    res.json({ message: 'Logged out.' });
  });
});

router.get('/user', isAuthenticated, async (req, res) => {
  try {
    const user = await User.findById(req.session.userId).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found.' });
    res.json({ user });
  } catch (error) {
    console.error('Error fetching user info:', error);
    res.status(500).json({ message: 'Server error fetching user info.' });
  }
});

router.put('/user', isAuthenticated, async (req, res) => {
  try {
    const firstName = String(req.body?.firstName ?? '').trim().slice(0, 50);
    const lastName = String(req.body?.lastName ?? '').trim().slice(0, 50);
    const email = String(req.body?.email ?? '').trim().toLowerCase();

    // An empty email is removed rather than stored as '' (see models/User.js).
    const update = email
      ? { $set: { firstName, lastName, email } }
      : { $set: { firstName, lastName }, $unset: { email: 1 } };

    const user = await User.findByIdAndUpdate(req.session.userId, update, {
      new: true,
      runValidators: true,
    }).select('-password');

    if (!user) return res.status(404).json({ message: 'User not found.' });
    res.json({ user, message: 'Account updated.' });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ message: 'That email is already used by another account.' });
    }
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: Object.values(error.errors)[0].message });
    }
    console.error('Error updating user info:', error);
    res.status(500).json({ message: 'Server error updating user info.' });
  }
});

module.exports = router;
