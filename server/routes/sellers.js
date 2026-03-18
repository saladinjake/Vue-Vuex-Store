const express = require('express');
const router = express.Router();
const { all } = require('../db');

router.get('/', async (req, res) => {
  try {
    const sellers = await all(`
      SELECT s.*, u.email as user_email 
      FROM sellers s 
      JOIN users u ON s.user_id = u.id 
      WHERE s.verification_status = 'pending' OR s.verification_status = 'verified'
    `);
    res.json(sellers);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const seller = (await all("SELECT * FROM sellers WHERE id = ?", [req.params.id]))[0];
    if (!seller) return res.status(404).json({ error: 'Seller not found' });

    const products = await all("SELECT * FROM products WHERE seller_id = ?", [req.params.id]);
    res.json({
      ...seller,
      products: products.map(p => ({
        ...p,
        images: JSON.parse(p.images || '[]')
      }))
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
