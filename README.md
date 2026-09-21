# 🍕 Foodie — Food Delivery Website

Foodie is a full-stack food delivery website. Customers can browse food, create an account, manage a cart, place orders, and track delivery status. Admins can view all orders and update their status.

## Tech Stack

| Layer      | Technology                          |
| ---------- | ----------------------------------- |           
| Frontend   | HTML, CSS, Vanilla JavaScript, Swiper.js |
| Backend    | Node.js, Express (REST API)         |
| Database   | SQLite (better-sqlite3) or Turso (cloud SQLite) |        
| Auth       | JWT + bcrypt password hashing       |

## Features

✅ Responsive navbar with smooth scroll navigation (Home, Menu, Services, About, Contact)  
✅ Mobile-friendly hamburger menu  
✅ Dynamic product menu loaded from backend  
✅ User authentication with JWT (Sign up / Sign in)  
✅ Shopping cart with real-time totals and quantity controls  
✅ Checkout and order history with delivery status tracking     
✅ Admin dashboard with order stats (total, pending, completed orders + revenue)  
✅ Order management - view, list, and update order status  
✅ Swiper.js reviews slider, newsletter section, sticky header  
✅ Database auto-seeded with products on first run

## Quick Start

### Prerequisites
- Node.js v14.21.1 or higher (v18+ recommended)
- npm or yarn

### Install and run

```bash
npm install
npm start
```

Open these pages in your browser:
- Storefront: `http://localhost:5000`
- Admin dashboard: `http://localhost:5000/admin`

The database is created automatically the first time the server starts. To reload the default products, run `npm run seed`.

### Environment variables

Copy `.env.example` to `backend/.env` if you want to customize settings:

```bash
cp .env.example backend/.env      # macOS / Linux
Copy-Item .env.example backend\.env   # Windows PowerShell
```

| Variable             | Description                                          |
| -------------------- | ---------------------------------------------------- |
| `JWT_SECRET`         | Secret used to sign tokens. Auto-generates if unset. |
| `PORT`               | Server port (defaults to `5000`).                    |
| `TURSO_DATABASE_URL` | Optional Turso URL to use cloud SQLite.              |
| `TURSO_AUTH_TOKEN`   | Optional Turso auth token.                           |

## Pages

| Route    | File          | Description                          |
| -------- | ------------- | ------------------------------------ |
| `/`      | `index.html`  | Main storefront page                 |
| `/home`  | `index.html`  | Alias for the main page              |
| `/admin` | `admin.html`  | Admin dashboard for all orders       |
| Static   | `style.css`, `admin.css`, `main.js`, `admin.js`, `images/` | Served automatically |

## Project Structure

```
├── index.html               # Storefront page
├── style.css                # Storefront styles
├── main.js                  # Storefront logic (API calls, cart, auth, nav, Swiper slider)
├── admin.html               # Admin dashboard page
├── admin.css                # Admin dashboard styles
├── admin.js                 # Admin logic (order stats, list/update orders)
├── products.json            # Seed product data (8 products)
├── render.yaml              # Render.com deployment config
├── .env.example             # Example environment variables
├── .gitignore
├── images/                  # Static images
└── backend/
    ├── server.js            # Express entry point (API routes, static files, pages)
    ├── db.js                # SQLite/Turso setup + schema + auto-seed
    ├── seed.js              # Wipe and re-seed products from products.json
    ├── middleware/
    │   └── authMiddleware.js  # JWT Bearer-token verification
    ├── routes/              # Express routers
    │   ├── products.js      # GET /api/products
    │   ├── auth.js          # POST /api/auth/signup, /login
    │   ├── cart.js          # Cart endpoints (auth required)
    │   └── orders.js        # Order endpoints (auth required + admin)
    ├── controllers/         # Request handlers
    │   ├── productController.js
    │   ├── authController.js
    │   ├── cartController.js
    │   └── orderController.js
    ├── models/              # Database operations
    │   ├── User.js
    │   ├── Product.js
    │   ├── Cart.js
    │   └── Order.js
    ├── .env                 # Local environment config (not committed)
    └── data/                # Local SQLite database (auto-created)
```

## How It Works

1. Products are loaded from the backend and shown on the storefront.
2. Users sign up or log in. Passwords are protected with bcrypt, and sessions use JWT.
3. Logged-in users add food to their cart and place orders.
4. Users can view their order history and delivery status.
5. Admins can view all orders and change their status.

## Database

Foodie uses SQLite locally or Turso in the cloud. When `TURSO_DATABASE_URL` and `TURSO_AUTH_TOKEN` are set, Turso is used; otherwise a local database is created at `backend/data/fooddelivery.db`. Products are auto-seeded from `products.json` if the table is empty.

Note: price is stored as a `$`-prefixed string (e.g. `"$9.67"`); all controllers parse it with `parseFloat` when computing totals.

### Database Tables
- **users** — User accounts (id, name, email, hashed password, createdAt)
- **products** — Available food items (id, name, price, image)
- **carts** — One cart per user (id, userId)
- **cart_items** — Items in a cart (id, cartId, productId, quantity)
- **orders** — Customer orders (id, userId, total, status, createdAt)
- **order_items** — Snapshot of items for each order (orderId, productId, name, price, image, quantity)

## API Endpoints

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

Responses return `{ token, user }`. Tokens are JWT signed with `JWT_SECRET` and expire after 7 days.

### Cart (auth required)     

| Method | Endpoint            | Auth | Description              |
| ------ | ------------------- | ---- | ------------------------ |      
| GET    | `/api/cart`         | Yes  | Get user's cart `{ items }` |
| POST   | `/api/cart`         | Yes  | Adjust quantity `{productId, quantity}`; `quantity` is a delta (+1 / -1); a result of 0 removes the item |
| DELETE | `/api/cart/:itemId` | Yes  | Remove cart item         |

### Orders

| Method | Endpoint                 | Auth | Description                     |
| ------ | ------------------------ | ---- | ------------------------------- |
| POST   | `/api/orders`            | Yes  | Create a new order (empties the cart) |
| GET    | `/api/orders`            | Yes  | Get user's order history        |
| GET    | `/api/orders/all`        | No*  | List all orders with user info (admin) |
| PATCH  | `/api/orders/:id/status` | No*  | Update order status (admin only); valid statuses: `pending`, `completed`, `cancelled` |

*Order list/update routes bypass JWT in this version. Add admin checks in `backend/routes/orders.js` before exposing them publicly in production.

## Deployment

The project includes `render.yaml` for easy deployment to Render.com. Set the `JWT_SECRET`, `TURSO_DATABASE_URL`, and `TURSO_AUTH_TOKEN` environment variables when connecting your GitHub repository. The cloud SQLite database (Turso) is used in production for persistence across redeploys.

## Customization

- **Add Products**: Edit `products.json` and run `npm run seed` (wipes existing products and re-inserts)
- **Modify Styles**: Edit `style.css` (storefront) or `admin.css` (dashboard) for branding
- **Extend Features**: Add new API routes in `backend/routes/` and controllers in `backend/controllers/`
- **Change Database**: Set Turso variables in `backend/.env` or use local SQLite via `backend/db.js`
- **Admin Authentication**: `/api/orders/all` and the status update route have no auth yet; secure them with an admin check before deploying publicly