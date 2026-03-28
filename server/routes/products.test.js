const request = require('supertest');
const { describe, it, expect, beforeAll } = require('vitest');
const app = require('../index');
const { initDb } = require('../db');

describe('Products API', () => {
  beforeAll(async () => {
    // Ensure DB is initialized before tests
    await initDb();
  });

  it('GET /api/products should return a list of products', async () => {
    const res = await request(app).get('/api/products');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('GET /api/products/:id should return 404 for non-existent product', async () => {
    const res = await request(app).get('/api/products/999999');
    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty('error', 'Product not found');
  });
});
