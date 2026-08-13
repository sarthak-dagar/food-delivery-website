# Foodie - Food Delivery Website

A full-stack food delivery web application. Users can browse the menu, create an account, add items to the cart, place orders, and track their order history.

## Tech Stack

| Layer      | Technology                          |
| ---------- | ----------------------------------- |
| Frontend   | HTML, CSS, Vanilla JavaScript, Swiper.js |
| Backend    | Node.js, Express (REST API)         |
| Database   | SQLite (better-sqlite3)             |
| Auth       | JWT + bcrypt password hashing       |

## Features

- Responsive navbar with smooth scroll (Home, Menu, Services, About, Contact)
- Mobile hamburger menu
- Product menu loaded dynamically from the backend
- Sign up / Sign in (JWT stored in localStorage)
- Cart with live total, badge count, and quantity controls
- Checkout and order history with status
- Swiper reviews slider, newsletter section, sticky header

## Getting Started

```bash
npm install      # install dependencies
npm run seed     # optional: re-seed products from products.json
npm start        # start server on http://localhost:5000
```

Database file `backend/data/fooddelivery.db` is created automatically on first run and auto-seeded if empty.

## Project Structure

```
├── index.html               # Frontend page
├── style.css                # Styles
├── main.js                  # Frontend logic (API calls, cart, auth, nav)
├── products.json            # Seed product data
├── render.yaml              # Render.com deployment config
├── images/                  # Static images
└── backend/
    ├── server.js            # Express entry point
    ├── db.js                # SQLite setup + table creation
    ├── seed.js              # Re-seed products
    ├── routes/              # API routes (auth, products, cart, orders)
    ├── controllers/         # Business logic
    ├── models/              # Database operations
    ├── middleware/          # JWT auth verification
    └── data/                # SQLite database (auto-created)
```

## API Endpoints

| Method | Endpoint            | Auth | Description              |
| ------ | ------------------- | ---- | ------------------------ |
| GET    | `/api/products`     | No   | List all products        |
| POST   | `/api/auth/signup`  | No   | Register `{name, email, password}` |
| POST   | `/api/auth/login`   | No   | Login `{email, password}` |
| GET    | `/api/cart`         | Yes  | Get user's cart          |
| POST   | `/api/cart`         | Yes  | Add item `{productId, quantity}` |
| DELETE | `/api/cart/:itemId` | Yes  | Remove cart item         |
| POST   | `/api/orders`       | Yes  | Create order from cart   |
| GET    | `/api/orders`       | Yes  | Get order history        |

Protected routes require `Authorization: Bearer <token>` header.

## Environment Variables

Copy `.env.example` to `backend/.env`:

```
# Optional - random one is generated at startup if not set
JWT_SECRET=your-long-random-string
# Defaults to 5000 locally
PORT=5000
```

## Deployment

Render.com ready — `render.yaml` serves the app from the `backend` directory. Set `JWT_SECRET` as a secret env var. Express also serves the static frontend files, so no separate hosting is needed.

## Scripts

| Command        | Description                        |
| -------------- | ---------------------------------- |
| `npm start`    | Run the server (port 5000)         |
| `npm run seed` | Re-seed products table             |
