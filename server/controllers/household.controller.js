const express = require('express');
const router = express.Router();
const User = require('../models/user.model.js');
const Household = require('../models/household.model.js');
const LOGGER = require("../lib/LOGGER.lib.js");
const axios = require('axios');
const ShoppingList = require('../models/shoppingList.model.js');

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
    LOGGER.log('error',`Error while creating household!\n${err}`);
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
    LOGGER.log('error',`Error while getting household details!\n${err}`);
    res.status(500).json({ message: 'Server error' });
  }
});

router.delete('/me', async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user.householdId) {
      return res.status(404).json({ message: 'Household not found' });
    }

    const household = await Household.findById(user.householdId);
    if (!household) {
      return res.status(404).json({ message: 'Household not found' });
    }

    // Remove householdId from all members
    await User.updateMany(
      { _id: { $in: household.members } },
      { $unset: { householdId: "" } }
    );

    await Household.findByIdAndDelete(user.householdId);

    res.status(200).json({ message: 'Household deleted successfully' });
  } catch (err) {
    LOGGER.log('error',`Error while deleting household!\n${err}`);
    res.status(500).json({ message: 'Server error' });
  }
});
router.put('/me', async (req, res) => {
  try {
    const { name } = req.body;
    const user = await User.findById(req.user.id);

    if (!user.householdId) {
      return res.status(404).json({ message: 'Household not found' });
    }

    const household = await Household.findById(user.householdId);
    if (!household) {
      return res.status(404).json({ message: 'Household not found' });
    }

    if (name) household.name = name;

    await household.save();

    res.status(200).json({ message: 'Household updated', household });
  } catch (err) {
    LOGGER.log('error',`Error while updating household!\n${err}`);
    res.status(500).json({ message: 'Server error' });
  }
});
router.patch('/members', async (req, res) => {
  const { add = [], remove = [] } = req.body;

  try {
    const user = await User.findById(req.user.id);
    const household = await Household.findById(user.householdId);

    if (!household) return res.status(404).json({ message: 'Household not found' });

    // Add members
    for (const userId of add) {
      const member = await User.findById(userId);
      if (member && !household.members.includes(member._id)) {
        household.members.push(member._id);
        member.householdId = household._id;
        await member.save();
      }
    }

    // Remove members
    for (const userId of remove) {
      household.members = household.members.filter(id => id.toString() !== userId);
      const member = await User.findById(userId);
      if (member) {
        member.householdId = null;
        await member.save();
      }
    }

    await household.save();

    res.status(200).json({ message: 'Household members updated', household });
  } catch (err) {
    LOGGER.log('error',`Error while managing members in household!\n${err}`);
    res.status(500).json({ message: 'Server error' });
  }
});
router.post('/:id/join', async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ message: 'Household Id is required' });
    };
    const user = await User.findById(req.user.id);
    const household = await Household.findById(id);
    if (user && !household.members.includes(user._id)) {
      household.members.push(user._id);
      user.householdId = household._id;
      await user.save();
      await household.save();
    }

    res.status(201).json({message: "Joined Household successfully"});
  } catch (err) {
    LOGGER.log('error',`Error while joining household!\n${err}`);
    res.status(500).json({ message: 'Server error' });
  }
});
router.get('/recommend/list', async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const householdId = user?.householdId;
    // 1. Fetch all shopping lists for this household
    const shoppingLists = await ShoppingList.find({ householdId });

    if (!shoppingLists.length) {
      return res.status(404).json({ message: 'No shopping lists found for this household.' });
    }

    // 2. Extract all item names
    const allItemNames = shoppingLists.flatMap(list =>
      list.items.map(item => item.name.toLowerCase())
    );
    console.log(allItemNames)

    // 3. Send data to recommendation API
    const { data: recommendedItems } = await axios.post(
      'https://recommend-vfaq.onrender.com/recommend',
      { cart: allItemNames }
      // { cart: ['meat','cheese'] }
    );
    console.log(recommendedItems)

    if (!Array.isArray(recommendedItems?.recommended_products) || recommendedItems?.recommended_products.length === 0) {
      return res.status(400).json({ message: 'No recommendations received.' });
    }

    // 4. Create a new list with the recommended items
    const newList = await ShoppingList.create({
      name: 'Recommended List',
      description: 'List generated from recommendation engine',
      householdId,
      createdBy: req.user._id, // Make sure `req.user` is populated
      items: recommendedItems?.recommended_products.map(itemName => ({
        name: itemName,
        quantity: 1,
        lastModifiedBy: req.user._id,
        history: [
          {
            action: 'add',
            userId: req.user._id,
          },
        ],
      }))
    });
    console.log(newList);

    res.status(201).json(newList);
  } catch (err) {
    console.error('Error creating recommended list:', err.message);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;