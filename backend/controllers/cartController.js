const Cart = require('../models/Cart');
const Product = require('../models/Product');

exports.getCart = async (req, res) => {
  try {
    let cart = await Cart.findOne({ userId: req.userId }).populate('items.productId');
    if (!cart) cart = { items: [] };
    const items = cart.items.map(item => ({
      _id: item._id,
      product: item.productId,
      quantity: item.quantity
    }));
    res.json({ items });
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
    let cart = await Cart.findOne({ userId: req.userId });
    if (!cart) {
      cart = new Cart({ userId: req.userId, items: [] });
    }
    const existing = cart.items.find(item => item.productId.toString() === productId);
    if (existing) {
      existing.quantity += qty;
      if (existing.quantity <= 0) {
        cart.items = cart.items.filter(item => item.productId.toString() !== productId);
      }
    } else {
      if (qty < 0) return res.status(400).json({ message: 'Invalid quantity' });
      cart.items.push({ productId, quantity: qty });
    }
    await cart.save();
    await cart.populate('items.productId');
    res.json(cart);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.removeCartItem = async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.userId });
    if (!cart) return res.status(404).json({ message: 'Cart not found' });
    cart.items = cart.items.filter(item => item._id.toString() !== req.params.itemId);
    await cart.save();
    const updated = await Cart.findOne({ userId: req.userId }).populate('items.productId');
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};