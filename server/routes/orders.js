const express = require('express');
const router = express.Router();
const { all, run } = require('../db');

router.post('/', async (req, res) => {
  const { userId, total, items, shipping, shippingMethod, shippingCost, tax, paymentMethod } = req.body;
  try {
    const result = await run(
      `INSERT INTO orders (user_id, total_amount, shipping_method, shipping_cost, tax, shipping_details, payment_method) 
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [userId, total, shippingMethod, shippingCost, tax, JSON.stringify(shipping), paymentMethod]
    );
    const orderId = result.lastID;

    for (const item of items) {
      await run(
        "INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)",
        [orderId, item.productId, item.quantity, item.price]
      );
    }
    res.json({ success: true, orderId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/', async (req, res) => {
  const { userId } = req.query;
  try {
    const orders = await all("SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC", [userId]);
    res.json(orders.map(o => ({
      ...o,
      shipping_details: JSON.parse(o.shipping_details || '{}')
    })));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const order = (await all("SELECT * FROM orders WHERE id = ?", [req.params.id]))[0];
    if (!order) return res.status(404).json({ error: 'Order not found' });

    const items = await all(
      `SELECT oi.*, p.name, p.images 
       FROM order_items oi 
       JOIN products p ON oi.product_id = p.id 
       WHERE oi.order_id = ?`,
      [req.params.id]
    );

    res.json({
      ...order,
      shipping_details: JSON.parse(order.shipping_details || '{}'),
      items: items.map(i => ({
        ...i,
        images: JSON.parse(i.images || '[]')
      }))
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
