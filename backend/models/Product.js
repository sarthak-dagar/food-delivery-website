const db = require('../db');

const rowToProduct = row => (row ? { _id: String(row.id), id: row.id, name: row.name, price: row.price, image: row.image } : null);

const findAll = async () => (await db.all('SELECT * FROM products ORDER BY id ASC')).map(rowToProduct);

const findById = async id => rowToProduct(await db.get('SELECT * FROM products WHERE id = ?', Number(id)));

module.exports = { findAll, findById };
