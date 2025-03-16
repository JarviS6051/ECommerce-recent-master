import express from 'express';
import { createOrder, verifyPayment } from '../controllers/razorpay.controller.js';
import { getOrderHistory } from '../controllers/order.controller.js';

const router = express.Router();

// Route to create a Razorpay order
router.post('/create-order', createOrder);

// Route to verify Razorpay payment
router.post('/verify-payment', verifyPayment);

// Route to fetch order history for the logged-in user
router.get('/order-history/:userId', getOrderHistory);

export default router;
