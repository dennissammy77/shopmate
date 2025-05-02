const express = require('express');
const router = express.Router();
const User = require('../models/user.model.js');
const Household = require('../models/household.model.js');

router.post('/', async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res.status(400).json({ message: 'Household name is required' });
    }

    const household = new Household({
      name,
      members: [req.user.id],
    });

    await household.save();

    await User.findByIdAndUpdate(req.user.id, {
      householdId: household._id,
    });

    res.status(201).json(household);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/me', async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user.householdId) {
      return res.status(404).json({ message: 'Household not found' });
    }

    const household = await Household.findById(user.householdId).populate('members', 'name email');

    if (!household) {
      return res.status(404).json({ message: 'Household not found' });
    }

    res.status(200).json(household);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;