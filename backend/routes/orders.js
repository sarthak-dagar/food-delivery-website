const router = require('express').Router();
const auth = require('../middleware/authMiddleware');
const { createOrder, getOrders, getAllOrders, updateOrderStatus } = require('../controllers/orderController');

router.post('/', auth, createOrder);
router.get('/', auth, getOrders);
router.get('/all', getAllOrders);
router.patch('/:id/status', updateOrderStatus);

module.exports = router;