const express = require('express');
const router = express.Router();
const { all } = require('../db');

router.get('/', async (req, res) => {
  try {
    const categories = await all("SELECT * FROM categories ORDER BY id");
    res.json(categories);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/mega', async (req, res) => {
  try {
    const parents = await all("SELECT * FROM categories WHERE parent_id IS NULL ORDER BY id");
    const result = await Promise.all(parents.map(async (cat) => {
      const subs = await all("SELECT * FROM categories WHERE parent_id = ? ORDER BY id", [cat.id]);
      // Category slides could be fetched here too if table exists
      return { ...cat, subcategories: subs };
    }));
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
