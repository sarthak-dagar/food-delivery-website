# 🍕 Foodie — Food Delivery Website

Foodie is a full-stack food delivery website. Customers can browse food, create an account, manage a cart, place orders, and track delivery status. Admins can view orders and update their status.

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
✅ SQLite auto-seeded with products on first run  

## Quick Start

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Install and run

```bash
npm install
npm start
```

Open these pages in your browser:
- Storefront: `http://localhost:5000`
- Admin dashboard: `http://localhost:5000/admin`

The database is created automatically the first time the server starts. To load the default products again, run `npm run seed`.

## Pages

| Route    | File          | Description                          |
| -------- | ------------- | ------------------------------------ |
| `/`      | `index.html`  | Main storefront page                 |
| `/home`  | `index.html`  | Alias for the main page              |
| `/admin` | `admin.html`  | Admin dashboard for all orders       |
| Static   | `style.css`, `main.js`, `admin.js`, `images/` | Served automatically |

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

## How It Works

1. Products are loaded from the backend and shown on the storefront.
2. Users sign up or log in. Passwords are protected with bcrypt, and sessions use JWT.
3. Logged-in users add food to their cart and place orders.
4. Users can view their order history and delivery status.
5. Admins can view all orders and change their status.

## Database

Foodie uses SQLite locally or Turso in the cloud. The local database is created at `backend/data/fooddelivery.db` and can be seeded from `products.json`.

### Database Tables
- **users** — Stores user account information (name, email, hashed password)
- **products** — Contains all available food items (name, price, description, image, category)
- **orders** — Tracks all customer orders (user_id, total_amount, status, created_at)
- **order_items** — Links products to orders (order_id, product_id, quantity, price)
- **cart** — Temporary shopping cart storage (user_id, product_id, quantity)

## API Endpoints

These are the main API endpoints:

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

### Orders (auth required)

| Method | Endpoint              | Auth | Description              |
| ------ | --------------------- | ---- | ------------------------ |
| GET    | `/api/orders`         | Yes  | Get user's order history |
| POST   | `/api/orders`         | Yes  | Create new order         |
| GET    | `/api/orders/:id`     | Yes  | Get order details        |
| PUT    | `/api/orders/:id`     | Yes  | Update order status (admin only) |

## Deployment

The project includes `render.yaml` for easy deployment to Render.com. Simply connect your GitHub repository and the configuration will handle the deployment automatically. The cloud SQLite database (Turso) is used in production for reliability.

## Customization

- **Add Products**: Edit `products.json` and run `npm run seed`
- **Modify Styles**: Edit `style.css` for branding
- **Extend Features**: Add new API routes in `backend/routes/` and controllers in `backend/controllers/`
- **Change Database**: Switch from better-sqlite3 to Turso in `backend/db.js`

