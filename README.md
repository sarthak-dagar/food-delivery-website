# 🍕 Foodie - Food Delivery Website

A complete full-stack food delivery application where customers can browse products, register, manage their cart, place orders, and track delivery status. Admins can monitor all orders and update statuses from a dedicated dashboard.

## Tech Stack

| Layer      | Technology                          |
| ---------- | ----------------------------------- |
| Frontend   | HTML, CSS, Vanilla JavaScript, Swiper.js |
| Backend    | Node.js, Express (REST API)         |
| Database   | SQLite (better-sqlite3) or Turso (cloud SQLite) |
| Auth       | JWT + bcrypt password hashing       |

## Features

- Responsive navbar with smooth scroll (Home, Menu, Services, About, Contact)
- Mobile hamburger menu
- Product menu loaded dynamically from the backend
- Sign up / Sign in (JWT stored in localStorage)
- Cart with live total, badge count, and quantity controls
- Checkout and order history with status
- Admin panel (`/admin`) — stats (total, pending, completed orders + revenue), list all orders, update order status
- Swiper reviews slider, newsletter section, sticky header
- SQLite auto-seeded with products on first run

## Pages / Routes

| Route    | File          | Description                          |
| -------- | ------------- | ------------------------------------ |
| `/`      | `index.html`  | Main storefront page                 |
| `/home`  | `index.html`  | Alias for the main page              |
| `/admin` | `admin.html`  | Admin dashboard for all orders       |
| Static   | `style.css`, `main.js`, `admin.js`, `images/` | Served automatically |

## Getting Started

```bash
npm install      # install dependencies
npm run seed     # optional: re-seed products from products.json
npm start        # start server on http://localhost:5000
```

Then open `http://localhost:5000` in your browser. The admin panel is at `http://localhost:5000/admin`.

Database file `backend/data/fooddelivery.db` is created automatically on first run and auto-seeded if empty.

## Project Structure

```
├── index.html               # Frontend page
├── style.css                # Styles
├── main.js                  # Frontend logic (API calls, cart, auth, nav)
├── admin.html               # Admin dashboard page
├── admin.js                 # Admin logic (list/update orders)
├── products.json            # Seed product data
├── render.yaml              # Render.com deployment config
├── images/                  # Static images
└── backend/
    ├── server.js            # Express entry point
    ├── db.js                # SQLite/Turso setup + table creation + auto-seed
    ├── seed.js              # Re-seed products
    ├── routes/              # API routes (auth, products, cart, orders)
    ├── controllers/         # Business logic
    ├── models/              # Database operations
    ├── middleware/          # JWT auth verification
    └── data/                # Local SQLite database (auto-created)
```

## API Endpoints

All endpoints below were verified working against a running server.

### Public pages & static files

| Method | Endpoint     | Description                       |
| ------ | ------------ | --------------------------------- |
| GET    | `/`          | Storefront page                   |
| GET    | `/home`      | Alias for the storefront          |
| GET    | `/admin`     | Admin dashboard                   |
| GET    | `/` (static) | CSS, JS, and images               |

### Products

| Method | Endpoint          | Auth | Description            |
| ------ | ----------------- | ---- | ---------------------- |
| GET    | `/api/products`   | No   | List all products      |
| GET    | `/api/products/:id` | No  | Get single product     |           

### Auth

| Method | Endpoint           | Auth | Description                        |
| ------ | ------------------ | ---- | ---------------------------------- |
| POST   | `/api/auth/signup` | No   | Register `{name, email, password}` |
| POST   | `/api/auth/login`  | No   | Login `{email, password}`          |

### Cart (auth required)

| Method | Endpoint            | Auth | Description              |
| ------ | ------------------- | ---- | ------------------------ |
| GET    | `/api/cart`         | Yes  | Get user's cart          |
| POST   | `/api/cart`         | Yes  | Add/update item `{productId, quantity}` |
| DELETE | `/api/cart/:itemId` | Yes  | Remove cart item         |

### Orders

| Method | Endpoint                    | Auth | Description                       |
| ------ | --------------------------- | ---- | --------------------------------- |
| POST   | `/api/orders`               | Yes  | Create order from cart            |
| GET    | `/api/orders`               | Yes  | Get logged-in user's order history |
| GET    | `/api/orders/all`           | No   | All orders + user info (admin)    |
| PATCH  | `/api/orders/:id/status`    | No   | Update order status (admin)       |

Protected routes require `Authorization: Bearer <token>` header.

> Note: `GET /api/orders/all` and `PATCH /api/orders/:id/status` are admin endpoints and are currently **not** protected with auth middleware.

### Errors

Any unmatched route returns `404` with `{ "message": "Route not found" }`.

## Environment Variables

Copy `.env.example` to `backend/.env`:

```
# Optional - random one is generated at startup if not set
JWT_SECRET=your-long-random-string
# Defaults to 5000 locally
PORT=5000
# Turso (cloud SQLite) - optional. Leave blank to use local SQLite.     
TURSO_DATABASE_URL=    
TURSO_AUTH_TOKEN=
```
