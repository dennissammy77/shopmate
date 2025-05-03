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

module.exports = router