const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const crypto = require('crypto');

dotenv.config({ path: path.join(__dirname, '.env') });

if (!process.env.JWT_SECRET) {
  process.env.JWT_SECRET = crypto.randomBytes(32).toString('hex');
  console.warn('Warning: JWT_SECRET set nahi hai, temporary random secret use ho raha hai.');
}

require('./db');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/products', require('./routes/products'));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/cart', require('./routes/cart'));
app.use('/api/orders', require('./routes/orders'));

app.use(express.static(path.join(__dirname, '..')));

const PORT = process.env.PORT || 5000;

app.use((req, res) => res.status(404).json({ message: 'Route not found' }));     
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));   
