const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '.env') });
if (!process.env.MONGO_URI || !process.env.JWT_SECRET) {
  console.error('Error: .env me MONGO_URI aur JWT_SECRET set karo');
  process.exit(1);
}

const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

app.use('/api/products', require('./routes/products'));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/cart', require('./routes/cart'));
app.use('/api/orders', require('./routes/orders'));

app.use(express.static(path.join(__dirname, '..')));

const PORT = process.env.PORT || 5000;

app.use((req, res) => res.status(404).json({ message: 'Route not found' }));
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
