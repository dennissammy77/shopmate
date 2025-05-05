const express = require('express');
const router = express.Router();
const LOGGER = require("../lib/LOGGER.lib.js");
const ShoppingList = require('../models/ShoppingList.model.js');

router.post('/', async (req, res) => {
    try {
      const { name, description, householdId } = req.body;
    
      const newList = await ShoppingList.create({
        name,
        description,
        householdId,
        createdBy: req.user._id,
      });
    
      res.status(201).json(newList);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to create shopping list' });
    }
});

router.get('/:householdId', async (req, res) => {
  try {
    const { householdId } = req.params;

    const lists = await ShoppingList.find({ householdId }).sort({ createdAt: -1 });

    res.status(200).json(lists);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch shopping lists' });
  }
});

router.get('/list/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const list = await ShoppingList.findById(id);

    if (!list) {
      return res.status(404).json({ error: 'Shopping list not found' });
    }

    res.status(200).json(list);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch shopping list' });
  }
});
router.delete('/list/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await ShoppingList.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ error: 'Shopping list not found' });
    }

    res.status(200).json({ message: 'Shopping list deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete shopping list' });
  }
});

module.exports = router