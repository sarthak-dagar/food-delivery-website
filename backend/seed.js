const db = require('./db');
const products = require('../products.json');

const deleteAll = db.prepare('DELETE FROM products');
const insert = db.prepare('INSERT INTO products (id, name, price, image) VALUES (@id, @name, @price, @image)');

const seed = db.transaction(items => {
  deleteAll.run();
  for (const p of items) insert.run(p);
});   

seed(products);
console.log('Seed data inserted successfully');
