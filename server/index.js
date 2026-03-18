const express = require('express');
const cors = require('cors');
const { initDb, all, run } = require('./db');
const { seedDb } = require('./seed');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5001;

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
