const express = require('express');
const router = express.Router();
const User = require('../models/user.model.js');

router.get('/me', async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate('householdId').select('-passwordHash');
    res.json({ user });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.put('/me', async (req, res) => {
  const { name, preferences } = req.body;

  try {
    const updates = {};
    if (name) updates.name = name;
    if (preferences) updates.preferences = preferences;

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { $set: updates },
      { new: true, runValidators: true }
    ).select('-passwordHash');

    res.json({ user });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.delete('/me', async (req, res) => {
  try {
    await User.findByIdAndDelete(req.user.id);
    res.json({ message: 'User account deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;