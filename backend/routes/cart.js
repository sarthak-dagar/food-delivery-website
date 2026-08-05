const router = require('express').Router();
const auth = require('../middleware/authMiddleware');
const { getCart, addToCart, removeCartItem } = require('../controllers/cartController');

router.get('/', auth, getCart);
router.post('/', auth, addToCart);
router.delete('/:itemId', auth, removeCartItem);

module.exports = router;