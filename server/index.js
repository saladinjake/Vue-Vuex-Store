const express = require('express');
const cors = require('cors');
const { initDb, all, run } = require('./db');
const { seedDb } = require('./seed');
require('dotenv').config();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5001;

app.post('/api/create-checkout-session', async (req, res) => {
  const { items, email } = req.body;
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: items.map(item => ({
        price_data: {
          currency: 'usd',
          product_data: { name: item.name },
          unit_amount: Math.round(item.price * 100),
        },
        quantity: item.quantity,
      })),
      mode: 'payment',
      success_url: `${req.headers.origin}/dashboard?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.origin}/checkout`,
      customer_email: email,
    });
    res.json({ id: session.id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
const productRoutes = require('./routes/products');
const orderRoutes = require('./routes/orders');
const authRoutes = require('./routes/auth');
const categoryRoutes = require('./routes/categories');
const sellerRoutes = require('./routes/sellers');

app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/sellers', sellerRoutes);

// Admin Routes
app.get('/api/admin/pending-sellers', async (req, res) => {
  try {
    const sellers = await all("SELECT s.*, u.email FROM sellers s JOIN users u ON s.user_id = u.id WHERE s.verification_status = 'pending'");
    res.json(sellers);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/admin/pending-products', async (req, res) => {
  try {
    const products = await all("SELECT p.*, s.store_name as seller FROM products p JOIN sellers s ON p.seller_id = s.id WHERE p.status = 'pending'");
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/admin/sellers/:id/verify', async (req, res) => {
  const { status } = req.body;
  try {
    await run("UPDATE sellers SET verification_status = ? WHERE id = ?", [status, req.params.id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/admin/products/:id/verify', async (req, res) => {
  const { status } = req.body;
  try {
    await run("UPDATE products SET status = ? WHERE id = ?", [status, req.params.id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const start = async () => {
  try {
    await initDb();
    await seedDb();
    app.listen(PORT, () => console.log(`Vuex Server running on http://localhost:${PORT}`));
  } catch (err) {
    console.error('Server failed to start:', err);
  }
};

start();
