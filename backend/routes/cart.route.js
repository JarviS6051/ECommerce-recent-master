import express from 'express';
import { getCart } from '../controllers/cart.controller.js';
import { addToCart } from '../controllers/cart.controller.js';
import { protectRoute } from '../middleware/authMiddleware.js';
//import { removeAllCart } from '../controllers/cart.controller.js';
import { updateQuantity } from '../controllers/cart.controller.js';
const router = express.Router();

router.get('/:userId', protectRoute, getCart);
router.post('/',protectRoute, addToCart);
//router.delete('/:id',protectRoute, removeAllCart);
router.put('/:productId',protectRoute, updateQuantity);

export default router;