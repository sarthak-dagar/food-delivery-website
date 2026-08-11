const db = require('../db');

const rowToProduct = row => (row ? { _id: String(row.id), id: row.id, name: row.name, price: row.price, image: row.image } : null);

const findAll = () => db.prepare('SELECT * FROM products ORDER BY id ASC').all().map(rowToProduct);

const findById = id => rowToProduct(db.prepare('SELECT * FROM products WHERE id = ?').get(Number(id)));

module.exports = { findAll, findById };
