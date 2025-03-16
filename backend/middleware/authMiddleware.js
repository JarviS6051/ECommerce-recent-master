import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';

export const protectRoute = async (req, res, next) => {
    try {
        // Retrieve token from cookies
        const token = req.cookies.token;
        if (!token) {
            return res.status(401).json({ message: 'Authorization denied' });
        }

        // Verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Find user associated with the token and populate the cart field
        const user = await User.findById(decoded.userId).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Attach user and cart to the request object
        req.user = user;  // Attach the entire user object (including the cart) to req.user
        req.userId = user._id;  // Keep the user ID if needed separately

        // Proceed to the next middleware or route handler
        next();
    } catch (error) {
        console.log("Error in protectRoute middleware:", error);
        
        // Handle token expiration or invalid token errors
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ message: 'Token expired' });
        }
        
        // Return a generic error message if something else goes wrong
        res.status(500).json({ message: 'Server error, please try again' });
    }
};

