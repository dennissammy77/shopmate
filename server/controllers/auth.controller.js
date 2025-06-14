// routes/auth.js
const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/user.model.js');
const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET; // Use env in production

// POST /signup
router.post('/signup', async (req, res) => {
  try {
    const { email, password, name } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ error: 'User already exists' });

    const user = new User({ email, passwordHash: password, name });
    await user.save();

    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '7d' });
    res.status(201).json({ token, user: { id: user._id, name: user.name, email: user.email } });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// POST /login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).send({ error: 'Invalid email' });

    const isMatch = await user.comparePassword(password);
    if (!isMatch) return res.status(400).send({ error: 'Invalid password' });

    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '7d' });
    return res.send({ token, user: { id: user._id, name: user.name, email: user.email } });
  } catch (err) {
    console.log(err)
    return res.status(500).send({ error: 'Server error' });
  }
});

module.exports = router;