const Cart = require('../models/Cart');
const Product = require('../models/Product');

exports.getCart = async (req, res) => {
  try {
    res.json({ items: await Cart.getItems(req.userId) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.addToCart = async (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body;
    const qty = parseInt(quantity) || 1;
    if (qty === 0) return res.status(400).json({ message: 'Invalid quantity' });
    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    const result = await Cart.addItem(req.userId, Number(productId), qty);
    if (result.error) return res.status(400).json({ message: result.error });
    res.json({ message: 'Added to cart', items: await Cart.getItems(req.userId) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.removeCartItem = async (req, res) => {
  try {
    const removed = await Cart.removeItem(req.userId, req.params.itemId);
    if (!removed) return res.status(404).json({ message: 'Cart item not found' });
    res.json({ items: await Cart.getItems(req.userId) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};