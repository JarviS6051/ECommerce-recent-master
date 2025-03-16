import express from 'express';
import { getAllProducts } from '../controllers/product.controller.js';
import { protectRoute } from '../middleware/authMiddleware.js';
import { getProductsByCategory } from '../controllers/product.controller.js';
const router = express.Router();

router.get("/", protectRoute, getAllProducts);
router.get("/category/:category", getProductsByCategory);

export default router;