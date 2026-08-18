const Order = require('../models/Order');
const Cart = require('../models/Cart');

exports.createOrder = async (req, res) => {
  try {
    const items = await Cart.getItems(req.userId);
    if (items.length === 0) {
      return res.status(400).json({ message: 'Cart is empty' });
    }
    let total = 0;
    const orderItems = items.map(item => {
      const priceNum = parseFloat(item.product.price.replace('$', ''));
      total += priceNum * item.quantity;
      return {
        product: item.product,
        quantity: item.quantity,
        price: item.product.price
      };
    });
    const order = await Order.createOrder(req.userId, orderItems, `$${total.toFixed(2)}`);
    await Cart.clear(req.userId);
    res.status(201).json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getOrders = async (req, res) => {
  try {
    res.json(await Order.findByUser(req.userId));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getAllOrders = async (req, res) => {
  try {
    res.json(await Order.findAll());
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    if (!['pending', 'completed', 'cancelled'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }
    const order = await Order.updateStatus(req.params.id, status);
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};