const Order = require('../models/Order');
const Cart = require('../models/Cart');

exports.createOrder = async (req, res) => {
  try {
    const items = Cart.getItems(req.userId);
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
    const order = Order.createOrder(req.userId, orderItems, `$${total.toFixed(2)}`);
    Cart.clear(req.userId);
    res.status(201).json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getOrders = async (req, res) => {
  try {
    res.json(Order.findByUser(req.userId));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
