const path = require('path');
const fs = require('fs');

const SCHEMA = `
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
`;

const url = process.env.TURSO_DATABASE_URL;
const token = process.env.TURSO_AUTH_TOKEN;
const isTurso = !!(url && token);

let db;
if (isTurso) {
  const { createClient } = require('@libsql/client');
  db = createClient({ url, authToken: token });
  console.log('Database: Turso (cloud SQLite)');
} else {
  const Database = require('better-sqlite3');
  const dataDir = path.join(__dirname, 'data');
  if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
  db = new Database(path.join(dataDir, 'fooddelivery.db'));
  db.pragma('journal_mode = WAL');
  db.pragma('foreign_keys = ON');
  console.log('Database: local SQLite');
}

const makeApi = (target) => ({
  async exec(sql) {
    if (isTurso) await target.executeMultiple(sql);
    else target.exec(sql);
  },
  async all(sql, ...args) {
    if (isTurso) {
      const r = await target.execute({ sql, args });
      return r.rows;
    }
    return target.prepare(sql).all(...args);
  },
  async get(sql, ...args) {
    if (isTurso) {
      const r = await target.execute({ sql, args });
      return r.rows[0] || null;
    }
    return target.prepare(sql).get(...args) || null;
  },
  async run(sql, ...args) {
    if (isTurso) {
      const r = await target.execute({ sql, args });
      return { changes: r.rowsAffected };
    }
    return target.prepare(sql).run(...args);
  }
});

const api = makeApi(db);

api.transaction = async (fn) => {
  if (isTurso) {
    const tx = await db.transaction('write');
    try {
      const out = await fn(makeApi(tx));
      await tx.commit();
      return out;
    } catch (err) {
      await tx.rollback();
      throw err;
    }
  }
  return fn(makeApi(db));
};

const init = async () => {
  await api.exec(SCHEMA);
  const row = await api.get('SELECT COUNT(*) AS c FROM products');
  if (!row || row.c === 0) {
    const products = require('../products.json');
    for (const p of products) {
      await api.run('INSERT INTO products (id, name, price, image) VALUES (?, ?, ?, ?)', p.id, p.name, p.price, p.image);
    }
    console.log('Products seeded (DB was empty)');
  }
};

init().catch(err => {
  console.error('Database init failed:', err.message);
  process.exit(1);
});

module.exports = api;
