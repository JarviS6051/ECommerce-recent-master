// controllers/razorpayController.js
import Razorpay from 'razorpay';
import crypto from 'crypto';
import User from '../models/user.model.js';
import Order from '../models/order.model.js';

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID, // Your Razorpay Key ID
  key_secret: process.env.RAZORPAY_KEY_SECRET // Your Razorpay Key Secret
});

// Function to create an order
export const createOrder = async (req, res) => {
  const { amount, currency = 'INR' } = req.body;

  try {
    const options = {
      amount: amount * 100, // Amount in paise (1 INR = 100 paise)
      currency,
      receipt: crypto.randomBytes(10).toString('hex'),
    };

    const order = await razorpay.orders.create(options);

    res.json({
      success: true,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Error creating order' });
  }
};

// Function to verify payment and move cart items to the order list
export const verifyPayment = async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature, userId } = req.body;

  const secret = process.env.RAZORPAY_KEY_SECRET;

  const generated_signature = crypto
    .createHmac('sha256', secret)
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest('hex');

  if (generated_signature === razorpay_signature) {
    try {
      // 1. Get the user who placed the order
      const user = await User.findById(userId);

      if (!user) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }

      // 2. Create an order from the cart items
      const orderItems = user.cartItems.map(item => ({
        product: item.product,
        quantity: item.quantity,
        price: item.product.price,  // Assuming the product price is stored in the Product model
      }));

      const totalAmount = orderItems.reduce((total, item) => total + item.price * item.quantity, 0);

      // Create an order in the orders collection
      const order = new Order({
        user: userId,
        products: orderItems,
        totalAmount,
        status: 'pending',
        shippingAddress: user.shippingAddress, // Assuming the user has a shipping address
        paymentStatus: 'completed',
        orderDate: new Date(),
      });

      // Save the order
      await order.save();

      // 3. Clear the cart items for the user after the order is successfully placed
      user.cartItems = [];
      await user.save();

      // 4. Return a success response
      res.json({ success: true, message: 'Payment verified and order placed successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: 'Error processing order' });
    }
  } else {
    res.status(400).json({ success: false, message: 'Payment verification failed' });
  }
};
