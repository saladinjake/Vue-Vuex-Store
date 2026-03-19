const express = require('express');
const router = express.Router();
const { all } = require('../db');

router.get('/', async (req, res) => {
  try {
    const { category, search, featured, new_arrival, top_seller, discount, limit } = req.query;
    let query = "SELECT * FROM products WHERE status = 'approved'";
    const params = [];

    if (category) { query += " AND category_id = ?"; params.push(category); }
    if (search) { query += " AND name LIKE ?"; params.push(`%${search}%`); }
    if (featured) { query += " AND featured = 1"; }
    if (new_arrival) { query += " AND new_arrival = 1"; }
    if (top_seller) { query += " AND top_seller = 1"; }
    if (discount) { query += " AND discount = 1"; }
    if (limit) { query += ` LIMIT ${parseInt(limit)}`; }

    const products = await all(query, params);
    res.json(products.map(p => ({
      ...p,
      images: JSON.parse(p.images || '[]'),
      variants: JSON.parse(p.variants || '[]')
    })));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const product = (await all("SELECT * FROM products WHERE id = ?", [req.params.id]))[0];
    if (!product) return res.status(404).json({ error: 'Product not found' });
    res.json({
      ...product,
      images: JSON.parse(product.images || '[]'),
      variants: JSON.parse(product.variants || '[]')
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
