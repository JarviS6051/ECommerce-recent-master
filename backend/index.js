import express from 'express';
import { connectDB } from './database/connectDB.js';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.route.js';
import productRoutes from './routes/product.route.js';
import cartRoutes from './routes/cart.route.js';
// import orderRoutes from "./routes/order.route.js"
import cookieParser from 'cookie-parser';
import razorpayRoutes from './routes/razorpay.route.js';
import cors from 'cors';

dotenv.config();

const app = express();

// Set CORS origin conditionally based on the environment
const allowedOrigins = ['https://e-commerce-yash-baggas-projects.vercel.app', 'http://localhost:3000'];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'), false);
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Allow these methods
  allowedHeaders: ['Content-Type', 'Authorization'], // Allow custom headers
  credentials: true, // Allow cookies
}));

// 🔹 Fix Preflight CORS Issue
app.options('*', cors()); // Handle preflight requests globally

// Middleware
app.use(express.json());
app.use(cookieParser());

// Routes
app.get('/', (req, res) => {
  res.send('Welcome to the E-commerce API');
});

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
// app.use("/api/order", orderRoutes);
app.use("/api/razorpay", razorpayRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  connectDB();
  console.log(`Server running at http://localhost:${PORT}`);
});
