const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const jwtVerify = require('../middleware/jwtVerify');
const User = require('../models/User');

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d'
  });
};

// POST Register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, photoURL } = req.body;

    // Check if user exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ success: false, message: 'User already exists' });
    }

    // Create user
    const user = await User.create({
      name,
      email,
      password,
      photoURL: photoURL || ''
    });

    if (user) {
      res.status(201).json({
        success: true,
        message: 'Registration successful! Please login.',
        data: {
          _id: user._id,
          name: user.name,
          email: user.email,
          photoURL: user.photoURL
        }
      });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
      const token = generateToken(user._id);

      res.json({
        success: true,
        message: 'Login successful!',
        data: {
          _id: user._id,
          name: user.name,
          email: user.email,
          photoURL: user.photoURL,
          token
        }
      });
    } else {
      res.status(401).json({ success: false, message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET Get current user session
router.get('/me', jwtVerify, async (req, res) => {
  try {
    res.json({
      success: true,
      data: {
        _id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        photoURL: req.user.photoURL
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// PUT Update profile (protected)
router.put('/profile', jwtVerify, async (req, res) => {
  try {
    const { name, photoURL } = req.body;

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    user.name = name || user.name;
    user.photoURL = photoURL || user.photoURL;

    await user.save();

    res.json({
      success: true,
      message: 'Profile updated successfully!',
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        photoURL: user.photoURL
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST Google OAuth Login/Register
router.post('/google', async (req, res) => {
  try {
    const { email, name, photoURL, googleId } = req.body;

    let user = await User.findOne({ email });

    if (!user) {
      // Create new user with Google
      user = await User.create({
        name,
        email,
        photoURL: photoURL || '',
        googleId,
        provider: 'google',
        password: null
      });
    }

    const token = generateToken(user._id);

    res.json({
      success: true,
      message: 'Google login successful!',
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        photoURL: user.photoURL,
        token
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
