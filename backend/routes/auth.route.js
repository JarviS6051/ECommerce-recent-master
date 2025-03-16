import express from 'express';
import { forgotPassword, login, logout, resetPassword, register, verifyEmail } from '../controllers/auth.controller.js';
import { verifyToken } from '../middleware/verifyToken.js';
import { checkAuth } from '../controllers/auth.controller.js';

const router = express.Router();

router.post('/register',register);

router.post('/verify-email',verifyEmail);

router.get("/check-auth", verifyToken, checkAuth);

router.post('/login',login);

router.post('/forgot-password',forgotPassword);

router.post('/reset-password/:token', resetPassword);

router.post('/logout',logout);

export default router;
