const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

const dataDir = path.join(__dirname, 'data');
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });

const db = new Database(path.join(dataDir, 'fooddelivery.db'));
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    createdAt TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    price TEXT NOT NULL,
    image TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS carts (
    id TEXT PRIMARY KEY,
    userId TEXT NOT NULL UNIQUE
  );

  CREATE TABLE IF NOT EXISTS cart_items (
    id TEXT PRIMARY KEY,
    cartId TEXT NOT NULL,
    productId INTEGER NOT NULL,
    quantity INTEGER NOT NULL DEFAULT 1,
    FOREIGN KEY (cartId) REFERENCES carts(id) ON DELETE CASCADE,
    FOREIGN KEY (productId) REFERENCES products(id)
  );

  CREATE TABLE IF NOT EXISTS orders (
    id TEXT PRIMARY KEY,
    userId TEXT NOT NULL,
    total TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending',
    createdAt TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS order_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    orderId TEXT NOT NULL,
    productId INTEGER,
    name TEXT NOT NULL,
    price TEXT NOT NULL,
    image TEXT NOT NULL,
    quantity INTEGER NOT NULL,
    FOREIGN KEY (orderId) REFERENCES orders(id) ON DELETE CASCADE
  );
`);

const count = db.prepare('SELECT COUNT(*) AS c FROM products').get().c;
if (count === 0) {
  const products = require('../products.json');
  const insert = db.prepare('INSERT INTO products (id, name, price, image) VALUES (@id, @name, @price, @image)');
  const seed = db.transaction(items => {
    for (const p of items) insert.run(p);
  });
  seed(products);
  console.log('Products seeded (DB was empty)');
}

module.exports = db;
