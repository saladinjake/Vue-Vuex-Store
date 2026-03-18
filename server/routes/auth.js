const express = require('express');
const router = express.Router();
const { all, run } = require('../db');

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = (await all("SELECT * FROM users WHERE email = ?", [email]))[0];
    if (user) {
      // bcrypt check and JWT generation would go here
      res.json({ success: true, user: { id: user.id, email: user.email, role: user.role } });
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
    const result = await run("INSERT INTO users (email, password, role) VALUES (?, ?, ?)", [email, password, role || 'customer']);
    res.json({ success: true, userId: result.lastID });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
