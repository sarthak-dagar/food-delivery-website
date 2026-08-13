# Foodie - Food Delivery Website

A full-stack food delivery web application. Users can browse a menu, sign up / log in, add items to a cart, place orders, and view their order history.

- **Frontend:** HTML, CSS (custom), Vanilla JavaScript, Swiper.js (reviews slider)
- **Backend:** Node.js + Express
- **Database:** SQLite via `better-sqlite3` (no MongoDB needed)
- **Auth:** JWT (JSON Web Tokens) + bcryptjs password hashing

---

## Features

- Responsive navbar with smooth scroll navigation (Home, Menu, Services, About, Contact)
- Mobile hamburger menu
- Product menu loaded dynamically from the backend API
- User sign up / sign in (JWT stored in localStorage)
- Cart with add / remove / quantity controls, live total and badge count
- Checkout - places an order from the current cart
- Order history ("My Orders") with status
- Reviews slider (Swiper)
- Newsletter / Subscribe UI section
- Sticky header

---

## Project Structure

```
food delivery website/
├── index.html              # Frontend page
├── style.css               # All styles
├── main.js                 # Frontend logic (API calls, cart, auth, nav)
├── products.json           # Seed product data
├── package.json            # Root scripts (start, seed)
├── .env.example            # Environment variable template
├── render.yaml             # Render.com deployment config
├── images/                 # Static images
└── backend/
    ├── server.js           # Express app entry point
    ├── db.js               # SQLite setup + table creation (auto-seeds if empty)
    ├── seed.js             # Re-seeds the products table
    ├── .env                # Local environment variables (gitignored)
    ├── models/
    │   ├── User.js
    │   ├── Product.js
    │   ├── Cart.js
    │   └── Order.js
    ├── middleware/
    │   └── authMiddleware.js   # JWT verification
    ├── routes/
    │   ├── auth.js
    │   ├── products.js
    │   ├── cart.js
    │   └── orders.js
    ├── controllers/
    │   ├── authController.js
    │   ├── productController.js
    │   ├── cartController.js
    │   └── orderController.js
    └── data/
        └── fooddelivery.db    # SQLite database (auto-created)
```

---

## Requirements

- [Node.js](https://nodejs.org/) v18 or newer (npm comes with it)

> Note: `better-sqlite3` is a native module. On Windows, building tools are usually not needed because prebuilt binaries are downloaded automatically. On older Node versions it may require a C++ toolchain.

---

## Setup & Run (Local)

```bash
# 1. Install dependencies
npm install

# 2. (Optional) Re-seed products into the database
npm run seed

# 3. Start the server
npm start
```

Then open **http://localhost:5000** in your browser.

The database file `backend/data/fooddelivery.db` is created automatically on first run, and the products table is seeded from `products.json` if it is empty.

### Running backend only

```bash
cd backend
npm install
npm start        # or: node server.js
```

---

## Environment Variables

Copy `.env.example` to `backend/.env` (a `.env` already exists locally):

```
# Optional. If not set, a random JWT secret is generated at startup.
JWT_SECRET=change-me-to-a-long-random-string

# Render supplies PORT automatically; leave blank for local run (defaults to 5000)
PORT=5000
```

---

## API Endpoints

| Method | Endpoint            | Auth | Description                     |
| ------ | ------------------- | ---- | ------------------------------- |
| GET    | `/api/products`     | No   | List all products               |
| GET    | `/api/products/:id` | No   | Get a single product            |
| POST   | `/api/auth/signup`  | No   | Register `{name, email, password}` |
| POST   | `/api/auth/login`   | No   | Login `{email, password}`       |
| GET    | `/api/cart`         | Yes  | Get current user's cart         |
| POST   | `/api/cart`         | Yes  | Add item `{productId, quantity}` (negative quantity removes) |
| DELETE | `/api/cart/:itemId` | Yes  | Remove a cart item              |
| POST   | `/api/orders`       | Yes  | Create an order from the cart   |
| GET    | `/api/orders`       | Yes  | Get current user's order history |

Auth endpoints return a JWT which must be sent as `Authorization: Bearer <token>` header.

---

## Database Schema

Tables are created automatically by `backend/db.js`:

- `users` - id, name, email (unique), password (hashed), createdAt
- `products` - id, name, price, image
- `carts` - id, userId (unique, one cart per user)
- `cart_items` - id, cartId, productId, quantity
- `orders` - id, userId, total, status ('pending'), createdAt
- `order_items` - orderId, productId, name, price, image, quantity

---

## Deployment (Render.com)

This project includes `render.yaml` for Render.com free-tier deployment:

1. Push this repository to GitHub/GitLab.
2. In Render, choose **Blueprint** and connect the repo.
3. Render uses `render.yaml` automatically - it runs the app from the `backend` directory.
4. Set the `JWT_SECRET` environment variable (marked as secret in the blueprint).

The static frontend files are served by Express from the project root, so no separate static hosting is needed.

---

## Testing Manually

1. Open **http://localhost:5000**
2. Click **Sign In** and create an account
3. **Add to Cart** on any product
4. Open the cart (bag icon), change quantities, then **Check out**
5. Check the **My Orders** section for the placed order
6. On a narrow window, test the hamburger menu and all navbar links (Home, Menu, Services, About, Contact)

---

## Troubleshooting

| Problem | Fix |
| ------- | --- |
| `better-sqlite3` build error | Use Node 18+ or run `npm rebuild better-sqlite3` |
| `EADDRINUSE: 5000` | Port busy - another process using 5000; kill it or change `PORT` |
| Changes not showing | `index.html`/`main.js` are served statically - just refresh (hard refresh Ctrl+F5) |
| Cart/orders "Sign in karo" | You must be logged in - JWT is stored in localStorage |

---

## Scripts

| Command        | Description                         |
| -------------- | ----------------------------------- |
| `npm start`    | Run the server (default port 5000)  |
| `npm run seed` | Re-seed the products table          |
