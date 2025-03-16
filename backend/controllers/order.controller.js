// controllers/orderController.js
import Order from '../models/order.model.js';

export const getOrderHistory = async (req, res) => {
  const { userId } = req.params;

  try {
    // Fetch orders for the user
    const orders = await Order.find({ user: userId })
      .populate('products.product', 'name price description') // Populate product details
      .sort({ orderDate: -1 }); // Sort by most recent orders first

    if (orders.length === 0) {
      return res.status(404).json({ success: false, message: 'No orders found for this user' });
    }

    res.json({
      success: true,
      orders,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Error fetching order history' });
  }
};
