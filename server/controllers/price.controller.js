const express = require('express');
const router = express.Router();
const { fetchMockPrices } = require('../services/priceComparisonService');

router.get('/compare', async (req, res) => {
  try {
    const { itemName } = req.query;
    if (!itemName) {
      return res.status(400).json({ error: 'Missing itemName in query' });
    }

    const prices = await fetchMockPrices(itemName);
    res.json({ itemName, prices });
  } catch (err) {
    console.error('Price comparison error:', err);
    res.status(500).json({ error: 'Failed to fetch prices' });
  }
});

module.exports = router;