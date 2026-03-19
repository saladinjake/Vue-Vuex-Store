const express = require('express');
const router = express.Router();
const { all, run } = require('../db');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key';

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = (await all("SELECT * FROM users WHERE email = ?", [email]))[0];
    if (user && await bcrypt.compare(password, user.password)) {
      const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '24h' });
      res.json({ success: true, user: { id: user.id, email: user.email, role: user.role }, token });
    } else {
      res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/register', async (req, res) => {
  const { email, password, role } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await run("INSERT INTO users (email, password, role) VALUES (?, ?, ?)", [email, hashedPassword, role || 'customer']);
    const userId = result.lastID;
    const token = jwt.sign({ id: userId, email, role: role || 'customer' }, JWT_SECRET, { expiresIn: '24h' });
    res.json({ success: true, userId, token, user: { id: userId, email, role: role || 'customer' } });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
