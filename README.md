# B2B Nexus | Premium Industrial Marketplace (Vuex Edition)

A full-stack B2B e-commerce platform built with Vue 3, Vuex 4, and Node.js (SQLite) — featuring role-based dashboards, Paystack payment integration, seller verification, and dynamic product management.

---

## Project Overview

B2B Nexus (Vuex Edition) is a production-grade marketplace application targeting industrial and wholesale commerce. It implements a three-tier role system — Customer, Seller, and Admin — each with dedicated views and scoped permissions. Sellers can list products and manage inventory, customers can browse, add to cart, checkout, and track orders, while admins verify sellers and moderate the platform.

This variant uses Vuex for centralized state management and Paystack as the primary payment gateway, making it a direct complement to the Pinia-based `vue-app-market-place` project.

---

## Setup

1. **Server**: `cd server && npm install && node index.js`
2. **Client**: `cd client && npm install && npm run dev`

> Create a `.env` file in both `client/` and `server/` before running. See Environment Variables below.

---

## Default Credentials

All accounts use the password: `password123`

| Role | Email |
| :--- | :--- |
| Admin | `user1@example.com`, `user2@example.com`, `user3@example.com` |
| Seller | `user6@example.com`, `user7@example.com`, `user8@example.com` |
| Customer | `user16@example.com`, `user17@example.com`, `user18@example.com` |

---

## Tech Stack

| Layer | Technology |
| :--- | :--- |
| Frontend | Vue 3, Vite, Vuex 4 |
| Styling | Custom CSS |
| Backend | Node.js, Express |
| Database | SQLite (via `better-sqlite3`) |
| Auth | JWT + BcryptJS |
| Payments | Paystack |

---

## Architecture

```
Vue-Vuex-Store/
├── client/                  # Vue 3 SPA (Vite + Vuex)
│   └── src/
│       ├── pages/           # Home, Products, ProductDetail, Cart, Checkout,
│       │                    # Dashboard, Orders, OrderDetail, VendorStore,
│       │                    # Vendors, Admin, AddProduct, Login, Signup
│       └── store/
│           └── modules/     # Vuex modules (auth, cart, products, orders)
└── server/                  # Express REST API
    ├── index.js             # Entry point and route registration
    ├── db.js                # SQLite schema and seed logic
    └── routes/              # Auth, products, orders, users routes
```

---

## Key Features

### 1. Role-Based Authentication
- Dedicated dashboards for Customers, Sellers, and Admins with scoped navigation menus.
- JWT tokens stored securely and validated on every protected API route.
- Frontend route guards implemented in Vue Router using Vuex auth state.

### 2. Paystack Payment Integration
- Inline Paystack popup triggered at checkout with amount and reference pre-filled.
- Server-side verification endpoint confirms payment status before order creation.
- Redirect flow handles both successful and cancelled payment outcomes gracefully.

### 3. Dynamic Marketplace
- Product catalog filterable by category, price range, and availability.
- Seller storefronts aggregate all listings from a single seller with contact and rating info.
- Inventory management panel allows sellers to add, edit, and delist products.

### 4. Admin Control Center
- Pending seller queue with one-click approve/reject and email-style notification.
- Product moderation tools for flagging or removing non-compliant listings.
- User management table with account status, role, and last-login visibility.

### 5. Order Management
- Full lifecycle: cart assembly, checkout, payment, confirmation, and detailed order view.
- Customers track order status (Pending, Processing, Shipped, Delivered) in real time.
- Sellers receive a live order feed with per-item fulfilment actions.

---

## Environment Variables

**Server** (`server/.env`):
```env
PORT=5001
JWT_SECRET=your_jwt_secret
PAYSTACK_SECRET_KEY=sk_test_...
```

**Client** (`client/.env`):
```env
VITE_API_URL=http://localhost:5001
VITE_PAYSTACK_PUBLIC_KEY=pk_test_...
```

---

Developed as part of the FixNuewYearBug project portfolio. Last updated May 2026.

