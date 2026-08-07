const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const Product = require('./models/Product');

dotenv.config({ path: path.join(__dirname, '.env') });
if (!process.env.MONGO_URI || !process.env.JWT_SECRET) {
  console.error('Error: .env me MONGO_URI aur JWT_SECRET set karo');
  process.exit(1);
}

const app = express();

app.use(cors());
app.use(express.json());

const seedProducts = async () => {
  const count = await Product.countDocuments();
  if (count === 0) {
    const products = require('../products.json');
    await Product.insertMany(products);
    console.log('Products seeded (DB was empty)');
  }
};

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log('MongoDB connected');
    await seedProducts();
  })
  .catch(err => console.log(err));

app.use('/api/products', require('./routes/products'));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/cart', require('./routes/cart'));
app.use('/api/orders', require('./routes/orders'));

app.use(express.static(path.join(__dirname, '..')));

const PORT = process.env.PORT || 5000;

app.use((req, res) => res.status(404).json({ message: 'Route not found' }));
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
