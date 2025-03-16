import bcrypt from 'bcryptjs';
import User from '../models/user.model.js';
import { generateTokenAndSetCookie } from '../utils/generateTokenAndSetCookie.js';
import { sendResetSuccessfullEmail, sendVerificationEmail } from '../mailtrap/emails.js';
import { sendWelcomeEmail } from '../mailtrap/emails.js';
import { sendResetPasswordEmail } from '../mailtrap/emails.js';
import crypto from 'crypto';

export const register = async (req, res) => {
    const { firstName, lastName, email, password } = req.body;

    try {
        // Validate required fields
        if (!firstName || !lastName || !email || !password) {
            return res.status(400).json({ success: false, message: 'Please fill all the fields' });
        }

        // Check if user already exists
        const userAlreadyExists = await User.findOne({ email });
        if (userAlreadyExists) {
            return res.status(400).json({ success: false, message: 'User already exists' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 12);

        // Generate a verification token
        const verificationToken = Math.floor(100000 + Math.random() * 900000).toString();

        // Create new user
        const user = new User({
            firstName,
            lastName,
            email,
            password: hashedPassword,
            verificationToken,
            verificationTokenExpires: Date.now() + 3600000, // Token expires in 1 hour
        });

        // Save the new user to the database
        await user.save();

        // Generate a token and set it as a cookie
        generateTokenAndSetCookie(res, user._id);

        await sendVerificationEmail(user.email, user.verificationToken);

        // Send success response (only once)
        return res.status(201).json({
            message: 'User signed up successfully',
            success: true,
            user: {
                ...user._doc,
                password: null, // Remove password from the response
            },
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const verifyEmail = async (req, res) => {
    const { code, email } = req.body; // Getting the verification code and email from the request body

    try {
        // Find user by verification token and check if it has expired
        const user = await User.findOne({
            email: email, // Check by email as well
            verificationToken: code,
            verificationTokenExpires: { $gt: Date.now() }, // Token must not be expired
        });

        if (!user) {
            // If no user is found or token has expired
            return res.status(400).json({ message: 'Invalid or expired verification token' });
        }

        // Update user to mark them as verified
        user.isVerified = true;
        user.verificationToken = undefined; // Clear verification token
        user.verificationTokenExpires = undefined; // Clear verification token expiration
        await user.save(); // Save the updated user

        // Send a welcome email after successful verification
        await sendWelcomeEmail(user.email, user.firstName);

        // Send success response including email and user details (excluding password)
        return res.status(200).json({
            message: 'Email verified successfully',
            user: {
                ...user._doc,
                password: null,  // Do not return password
                email: user.email // Include email in the response
            }
        });

    } catch (error) {
        // In case of any unexpected error, send a 500 response
        console.log("Error verifying email", error);        
        return res.status(500).json({ message: error.message });
    }
};

export const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Validate required fields
        if (!email || !password) {
            return res.status(400).json({ message: 'Please fill all the fields' });
        }

        // Check if user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'User does not exist' });
        }

        // Check if password is correct
        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if (!isPasswordCorrect) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Generate a token and set it as a cookie
        generateTokenAndSetCookie(res, user._id);

        // No need to save user if no data changes
        // await user.save(); // Remove if no changes are being made to the user

        // Respond with success and user data (excluding password)
        res.status(200).json({
            success: true,
            message: 'User logged in successfully',
            user: { ...user._doc, password: null } // Hide password in response
        });

    } catch (error) {
        console.log("Error logging in", error);
        res.status(500).json({ message: error.message });
    }
};  

export const forgotPassword = async (req, res) => {
    const { email } = req.body;
    console.log(email);
    
    try {
        // Find user by email
        const user = await User.findOne({ email
        });
        if (!user) {
            return res.status(400).json({ message: 'User does not exist' });
        }

        // Generate a reset token
        const resetToken = crypto.randomBytes(20).toString('hex');
        const resetTokenExpires = Date.now() + 3600000; // Token expires in 1 hour
        user.resetPasswordToken = resetToken;
        user.resetPasswordExpires = resetTokenExpires;
        await user.save();
        await sendResetPasswordEmail(user.email, `${process.env.CLIENT_URL}/reset-password/${resetToken}`);
        res.status(200).json({ message: 'Password reset link sent successfully' });
    }
    catch (error) {
        console.log("Error sending password reset email", error);
        res.status(500).json({ message: error.message });
    }
};  

export const resetPassword = async (req, res) => {
    const { token } = req.params;  // Token from the URL
    const { password } = req.body; // New password

    try {
        // Ensure password is provided
        if (!password) {
            return res.status(400).json({ message: 'Please provide a new password' });
        }

        // Find the user by reset password token and expiration time
        const user = await User.findOne({
            resetPasswordToken: token,
            resetPasswordExpires: { $gt: Date.now() }, // Check if the token hasn't expired
        });

        if (!user) {
            return res.status(400).json({ message: 'Invalid or expired reset token' });
        }

        // Hash the new password
        user.password = await bcrypt.hash(password, 12);

        // Clear the reset token and expiration time
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;

        // Save the updated user object
        await user.save();

        // Send a confirmation email after resetting the password
        await sendResetSuccessfullEmail(user.email, 'Your password has been reset successfully');

        // Respond with success message
        res.json({ message: 'Password reset successfully' });

    } catch (error) {
        console.log("Error resetting password", error);
        res.status(500).json({ message: error.message });
    }
};
 
export const logout = (req, res) => {    
    res.clearCookie('token');
    res.status(200).json({ message: 'User logged out successfully' });
};  

export const checkAuth = async (req, res) => {
    try {
        const user = await User.findById(req.userId).select('-password');
        if (!user) {
            return res.status(400).json({ message: 'User not found' });
        }
        res.status(200).json({ user: { ...user._doc, password: null } });
    } catch (error) {
        console.log("Error checking auth", error);
        res.status(500).json({ message: error.message });
    }
};
