# Foodie - Food Delivery Website

Full-stack food delivery web app. Browse menu, sign up/login, add items to cart, place orders, and view order history.

## Tech Stack

- **Frontend:** HTML, CSS, Vanilla JavaScript, Swiper.js
- **Backend:** Node.js + Express
- **Database:** SQLite (better-sqlite3)
- **Auth:** JWT + bcrypt

## Setup

```bash
npm install
npm run seed   # optional: re-seed products
npm start
```

Open http://localhost:5000

## Features

- Responsive design with mobile hamburger menu
- Smooth scroll navigation (Home, Menu, Services, About, Contact)
- Sign up / Sign in with JWT
- Cart with live totals and quantity controls
- Checkout and order history
- Swiper reviews slider

## API

| Method | Endpoint            | Auth | Description          |
| ------ | ------------------- | ---- | -------------------- |
| GET    | `/api/products`     | No   | List products        |
| POST   | `/api/auth/signup`  | No   | Register user        |
| POST   | `/api/auth/login`   | No   | Login user           |
| GET    | `/api/cart`         | Yes  | Get cart             |
| POST   | `/api/cart`         | Yes  | Add to cart          |
| POST   | `/api/orders`       | Yes  | Place order          |
| GET    | `/api/orders`       | Yes  | Order history        |

## Structure

```
├── index.html, style.css, main.js   # Frontend
├── products.json                     # Seed data
└── backend/                          # Express app (routes, controllers, models)
```

## Deployment

Render.com ready — see `render.yaml`. Set `JWT_SECRET` env var.
