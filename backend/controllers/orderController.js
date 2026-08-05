const Order = require('../models/Order');
const Cart = require('../models/Cart');

exports.createOrder = async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.userId }).populate('items.productId');
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: 'Cart is empty' });
    }
    let total = 0;
    const items = cart.items.map(item => {
      const priceNum = parseFloat(item.productId.price.replace('$', ''));
      total += priceNum * item.quantity;
      return {
        product: {
          id: item.productId.id,
          name: item.productId.name,
          price: item.productId.price,
          image: item.productId.image
        },
        quantity: item.quantity,
        price: item.productId.price
      };
    });
    const order = await Order.create({
      userId: req.userId,
      items,
      total: `$${total.toFixed(2)}`
    });
    await Cart.deleteOne({ userId: req.userId });
    res.status(201).json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getOrders = async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.userId }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};