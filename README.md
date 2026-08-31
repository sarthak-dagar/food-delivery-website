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

## Project Overview

**Foodie** is a modern, full-stack food delivery web application built with vanilla JavaScript on the frontend and Node.js/Express on the backend. It replicates real-world e-commerce functionality including user authentication, product browsing, shopping cart management, order placement, and delivery tracking. The application features both customer and admin interfaces for complete order management.

## Frontend Overview

The frontend is built with **HTML, CSS, and Vanilla JavaScript** without any heavy frameworks. It includes:
- **Responsive Design**: Mobile-first approach with hamburger menu for smaller screens
- **Dynamic Product Loading**: Products are fetched from the backend API and rendered dynamically
- **User Authentication**: Sign up and sign in functionality with JWT tokens stored in localStorage
- **Shopping Cart**: Add/remove items, update quantities, view real-time totals and badge counts
- **Order Management**: Place orders and view order history with delivery status tracking
- **Enhanced UX**: Swiper.js for smooth reviews slider, sticky header, newsletter subscription section

### Frontend Files
- `index.html` — Main storefront page
- `admin.html` — Admin dashboard page
- `style.css` — All styling for responsive design
- `main.js` — Cart logic, authentication, API calls, navigation, DOM manipulation
- `admin.js` — Admin panel functionality (view orders, update statuses, display stats)

## Backend Overview

The backend is built with **Node.js and Express**, providing a RESTful API to serve the frontend and manage all business logic.

### Backend Responsibilities
- **Server Setup**: Express server running on port 5000
- **Database Management**: SQLite (local) or Turso (cloud) for data persistence
- **API Routes**: Handle all requests for products, authentication, cart, and orders
- **Security**: JWT-based authentication with bcrypt password hashing
- **Data Seeding**: Auto-populates the database with products on first run

### Backend Files
- `server.js` — Main Express application entry point
- `db.js` — Database initialization, table creation, and auto-seeding logic
- `seed.js` — Script to re-seed products from products.json
- `routes/` — Organized API endpoint handlers (auth, products, cart, orders)
- `controllers/` — Business logic separated from routes
- `models/` — Direct database query operations
- `middleware/` — JWT verification and authentication middleware
- `data/` — Local SQLite database file (auto-created)

## Database Overview

The application uses **SQLite** as the database (either local with better-sqlite3 or cloud with Turso). On the first run, the database is automatically created and seeded with product data from `products.json`.

### Database Tables
- **users** — Stores user account information (name, email, hashed password)
- **products** — Contains all available food items (name, price, description, image, category)
- **orders** — Tracks all customer orders (user_id, total_amount, status, created_at)
- **order_items** — Links products to orders (order_id, product_id, quantity, price)
- **cart** — Temporary shopping cart storage (user_id, product_id, quantity)

## Authentication Flow

1. User registers with name, email, and password
2. Password is hashed using bcrypt before storage
3. JWT token is generated and sent to the client
4. Token is stored in localStorage for persistent sessions
5. Token is included in Authorization header for protected API requests
6. Backend middleware validates JWT on each protected route

## Order Management Flow

### Customer Side
1. Browse products from the dynamic menu
2. Add items to cart with quantity controls
3. Proceed to checkout
4. Place order (cart items become an order record)
5. View order history with current delivery status

### Admin Side
1. Log in to `/admin` dashboard
2. View dashboard statistics (total orders, pending orders, completed orders, total revenue)
3. See a list of all orders with customer details and current status
4. Update order status (Pending → Preparing → Out for Delivery → Delivered)
5. Real-time order management

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

### Orders (auth required)

| Method | Endpoint              | Auth | Description              |
| ------ | --------------------- | ---- | ------------------------ |
| GET    | `/api/orders`         | Yes  | Get user's order history |
| POST   | `/api/orders`         | Yes  | Create new order         |
| GET    | `/api/orders/:id`     | Yes  | Get order details        |
| PUT    | `/api/orders/:id`     | Yes  | Update order status (admin only) |

## Deployment

The project includes `render.yaml` for easy deployment to Render.com. Simply connect your GitHub repository and the configuration will handle the deployment automatically. The cloud SQLite database (Turso) is used in production for reliability.

## How to Use This Project

### For Development
1. Clone/download the project
2. Run `npm install` to install dependencies
3. Run `npm start` to start the server on `http://localhost:5000`
4. Open the storefront at `http://localhost:5000` and admin panel at `http://localhost:5000/admin`
5. Optionally run `npm run seed` to reset the product database

### For Customization
- **Add Products**: Edit `products.json` and run `npm run seed`
- **Modify Styles**: Edit `style.css` for branding
- **Extend Features**: Add new API routes in `backend/routes/` and controllers in `backend/controllers/`
- **Change Database**: Switch from better-sqlite3 to Turso in `backend/db.js`

## Key Technologies Explained

- **JWT (JSON Web Tokens)**: Stateless authentication method, token verified on each request
- **bcrypt**: Industry-standard password hashing library that adds security
- **SQLite**: Lightweight, serverless database perfect for small to medium applications
- **Swiper.js**: Touch-enabled carousel library for smooth slider interactions
- **Express Middleware**: Functions that intercept requests for auth, logging, etc.

