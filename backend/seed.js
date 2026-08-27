const db = require('./db');
const products = require('../products.json');

const run = async () => {
  await db.run('DELETE FROM products');
  for (const p of products) {
    await db.run('INSERT INTO products (id, name, price, image) VALUES (?, ?, ?, ?)', p.id, p.name, p.price, p.image);
  }
  console.log('Seed data inserted successfully');
  process.exit(0);
};

run().catch(err => {
  console.error(err.message);    
  process.exit(1);
});   