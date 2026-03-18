const { run, all } = require('./db');
const bcrypt = require('bcryptjs');

const seedDb = async () => {
  const userCount = await all("SELECT COUNT(*) as count FROM users");
  if (userCount[0].count > 0) return;

  const hashedPassword = await bcrypt.hash('password123', 10);

  // Users
  for (let i = 1; i <= 20; i++) {
    await run("INSERT INTO users (email, password, role) VALUES (?, ?, ?)", [`user${i}@example.com`, hashedPassword, i <= 5 ? 'seller' : 'customer']);
  }

  // Categories
  const cats = ['Electronics', 'Industrial', 'Chemicals', 'Machinery'];
  for (const name of cats) {
    await run("INSERT INTO categories (name, description, image) VALUES (?, ?, ?)", [
        name, 
        `Premium ${name} assets`, 
        `https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&q=80`
    ]);
  }

  // Sellers
  const sellerUsers = await all("SELECT id FROM users WHERE role = 'seller'");
  for (const s of sellerUsers) {
    await run("INSERT INTO sellers (user_id, store_name, logo) VALUES (?, ?, ?)", [
        s.id, 
        `Enterprise Store ${s.id}`, 
        `https://picsum.photos/seed/s${s.id}/200`
    ]);
  }

  // Products
  const categories = await all("SELECT id FROM categories");
  const sellers = await all("SELECT id FROM sellers");

  for (let i = 1; i <= 40; i++) {
    const catId = categories[i % categories.length].id;
    const sellerId = sellers[i % sellers.length].id;
    const name = `B2B Asset ${i} - Industrial Grade`;
    await run(
      `INSERT INTO products (name, price, description, category_id, seller_id, inventory, images, featured)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        name,
        (Math.random() * 1200 + 100).toFixed(2),
        `High-precision asset for industrial applications. ${name} certified for global standards.`,
        catId,
        sellerId,
        100,
        JSON.stringify([`https://picsum.photos/seed/p${i}/800/600`]),
        i % 5 === 0 ? 1 : 0
      ]
    );
  }
  console.log('Database Seeded Successfully');

  // Seed some orders for the first customer (User 6 is usually first customer)
  const customers = await all("SELECT id FROM users WHERE role = 'customer' LIMIT 1");
  const seller = await all("SELECT id FROM sellers LIMIT 1");
  const products = await all("SELECT id, price FROM products LIMIT 2");
  
  if (customers.length > 0 && products.length > 1) {
    const userId = 1; // Explicitly ensure user 1 has an order for the dashboard mock
    const result = await run(
      `INSERT INTO orders (user_id, total_amount, shipping_method, shipping_cost, tax, shipping_details, payment_method, status) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [userId, 1575.00, 'Express Freight', 150.00, 75.00, JSON.stringify({
        firstName: 'Victor', lastName: 'Admin',
        company: 'Victor Manufacturing', address: '1 Enterprise Way',
        city: 'London', state: 'UK', zip: 'EC1V', country: 'UK'
      }), 'Bank Wire', 'delivered']
    );
    const orderId = result.lastID;
    
    await run(
      "INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)",
      [orderId, products[0].id, 1, products[0].price]
    );
    await run(
      "INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)",
      [orderId, products[1].id, 2, products[1].price]
    );
  }
};

module.exports = { seedDb };
