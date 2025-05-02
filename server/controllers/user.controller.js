const express = require('express');
const router = express.Router();
const User = require('../models/user.model.js');

router.get('/me', async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-passwordHash');
    res.json({ user });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
