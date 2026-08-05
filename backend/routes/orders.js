const router = require('express').Router();
const auth = require('../middleware/authMiddleware');
const { createOrder, getOrders } = require('../controllers/orderController');

router.post('/', auth, createOrder);
router.get('/', auth, getOrders);

module.exports = router;