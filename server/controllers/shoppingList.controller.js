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
router.post('/list/:id/item/add', async (req, res) => {
  try {
    const { name, quantity } = req.body;
    const { id } = req.params;

    const list = await ShoppingList.findById(id);
    if (!list) {
      return res.status(404).json({ error: 'Shopping list not found' });
    }

    const newItem = {
      name,
      quantity,
      lastModifiedBy: req.user._id,
      history: [
        {
          action: 'add',
          userId: req.user._id,
        },
      ],
    };

    list.items.push(newItem);
    list.updatedAt = new Date();

    await list.save();

    res.status(200).json(list);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to add item to shopping list' });
  }
});
router.put('/list/:id/item/update', async (req, res) => {
  try {
    const { id } = req.params;
    const { itemId, name, quantity, status } = req.body;

    const list = await ShoppingList.findById(id);
    if (!list) return res.status(404).json({ error: 'Shopping list not found' });

    const item = list.items.id(itemId);
    if (!item) return res.status(404).json({ error: 'Item not found in list' });

    if (name) item.name = name;
    if (quantity) item.quantity = quantity;
    if (status) item.status = status;

    item.history.push({
      action: 'edit',
      userId: req.user._id
    });

    list.updatedAt = new Date();
    await list.save();

    res.status(200).json(list);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update item' });
  }
});
router.put('/list/:id/item/purchase', async (req, res) => {
  try {
    const { id } = req.params;
    const { itemId } = req.body;

    const list = await ShoppingList.findById(id);
    if (!list) return res.status(404).json({ error: 'Shopping list not found' });

    const item = list.items.id(itemId);
    if (!item) return res.status(404).json({ error: 'Item not found in list' });

    item.status = 'purchased';

    item.history.push({
      action: 'purchase',
      userId: req.user._id
    });

    list.updatedAt = new Date();
    await list.save();

    res.status(200).json(list);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to mark item as purchased' });
  }
});
router.delete('/list/:id/item/:itemId', async (req, res) => {
  try {
    const { id, itemId } = req.params;

    const list = await ShoppingList.findById(id);
    if (!list) return res.status(404).json({ error: 'Shopping list not found' });

    const item = list.items.id(itemId);
    if (!item) return res.status(404).json({ error: 'Item not found in list' });

    item.deleteOne(); // remove the subdocument

    list.updatedAt = new Date();
    await list.save();

    res.status(200).json({ message: 'Item deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete item' });
  }
});

module.exports = router;