import User from '../models/user.model.js';
import Product from '../models/product.model.js';
import mongoose from 'mongoose';

export async function addToCart(req, res) {
    try {
        const { userId, productId, quantity } = req.body; // Ensure the request body has userId, productId, and quantity

        // Validate if product exists
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        // Find the user by userId
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Check if the product is already in the user's cart
        const existingCartItem = user.cartItems.find(
            (item) => item.product.toString() === productId
        );

        if (existingCartItem) {
            // If the product exists in the cart, update the quantity
            existingCartItem.quantity += quantity;
        } else {
            // If the product doesn't exist in the cart, add it
            user.cartItems.push({ product: productId, quantity });
        }

        // Save the updated user document
        await user.save();

        return res.status(200).json({
            message: 'Product added to cart successfully',
            cartItems: user.cartItems
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Server error', error });
    }
}

export async function getCart(req, res) {
    try {
        const { userId } = req.params;

        // Validate if the userId is a valid ObjectId format
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ message: 'Invalid userId format' });
        }

        // Find the user by userId and populate the cartItems array with product details
        const user = await User.findById(userId).populate('cartItems.product');

        // If user not found, return an error message
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Return the user's cart with populated product data
        return res.status(200).json({
            message: 'User cart retrieved successfully',
            cartItems: user.cartItems
        });
    } catch (error) {
        // Log the full error for debugging
        console.error('Error retrieving cart:', error);

        // Send the error response
        return res.status(500).json({
            message: 'Server error',
            error: error.message || error
        });
    }
}

export async function updateQuantity(req, res) {
    try {
        const { productId } = req.params;  // Extract productId from the URL params
        const { quantity } = req.body;  // Extract the quantity from the request body
        
        // Validate the quantity
        if (quantity < 1) {
            return res.status(400).json({ message: 'Quantity must be at least 1' });
        }

        // Find the user from the logged-in user (we assume protectRoute sets the `userId`)
        const user = req.user;  // This assumes the protectRoute middleware adds the user to `req.user`
        
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Find if the product already exists in the cart
        const cartItemIndex = user.cartItems.findIndex(item => item.product.toString() === productId);

        if (cartItemIndex !== -1) {
            // If the product exists, update the quantity
            user.cartItems[cartItemIndex].quantity = quantity;  // Update the quantity
        } else {
            // If the product doesn't exist, add it to the cart with the provided quantity
            user.cartItems.push({ product: productId, quantity });  // Add product with quantity
        }

        // Save the updated user document with the modified cart
        await user.save();

        // Return the updated cart in the response
        return res.status(200).json({
            message: 'Cart updated successfully',
            cartItems: user.cartItems  // Return updated cartItems
        });

    } catch (error) {
        console.error('Error updating cart:', error);
        return res.status(500).json({
            message: 'Server error',
            error: error.message || error
        });
    }
}

