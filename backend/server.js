import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import mongoSanitize from 'express-mongo-sanitize';
import mongoose from 'mongoose';

import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables early explicitly from backend directory
dotenv.config({ path: path.join(__dirname, '.env') });

// Import local configurations and utilities
import { connectDB } from './config/database.js';
import { errorHandler } from './middleware/errorHandler.js';

// Import route handlers
import authRoutes from './routes/authRoutes.js';
import leadRoutes from './routes/leadRoutes.js';

/**
 * Environment Validation
 * Runs before establishing any database connection.
 * Exits the process if critical variables are missing.
 */
const checkRequiredEnvVars = () => {
  const required = ['MONGODB_URI', 'JWT_SECRET', 'PORT'];
  const missing = required.filter(key => !process.env[key]);
  
  if (missing.length > 0) {
    console.error(`FATAL ERROR: Missing required environment variables: ${missing.join(', ')}`);
    process.exit(1);
  }
};

const app = express();

/**
 * Global Middlewares Configuration
 */

// 1. Helmet helps secure Express apps by setting various HTTP headers
app.use(helmet());

// 2. Logger middleware (HTTP request logging)
const NODE_ENV = process.env.NODE_ENV || 'development';
if (NODE_ENV === 'production') {
  app.use(morgan('combined'));
} else {
  app.use(morgan('dev'));
}

// 3. Enable CORS with configurable origin and support for credentials
app.use(
  cors({
    origin: true, // Allow all origins for now to prevent Vercel dynamic URL issues
    credentials: true
  })
);

// 4. Rate Limiting configurations (relaxed in dev, strict in production)
const isDev = NODE_ENV === 'development';

const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: isDev ? 1000 : 100, // Relaxed in dev
  message: 'Too many requests, please try again later.'
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: isDev ? 100 : 10, // Relaxed in dev
  message: 'Too many auth attempts.'
});

// Apply rate limits
app.use('/api/', generalLimiter);
app.use('/api/auth/', authLimiter);

// 5. Body parsers with request size limits to prevent Denial of Service (DoS) attacks
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// 6. MongoDB Injection Protection (Sanitize data)
app.use(mongoSanitize());

/**
 * Route Registrations
 */

// Health check endpoint for server validation and monitoring
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date()
  });
});

// App specific endpoints
app.use('/api/auth', authRoutes);
app.use('/api/leads', leadRoutes);

/**
 * Error Handling Middleware
 * Must be registered last, after all other middlewares and route declarations.
 */
app.use(errorHandler);

/**
 * Database Connection and Server Bootstrapping
 */
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  // Validate environment variables before starting
  checkRequiredEnvVars();

  // Connect to MongoDB Atlas
  await connectDB();

  // Start Express listener
  const server = app.listen(PORT, () => {
    console.log(`Server running on port ${PORT} in ${NODE_ENV} mode`);
  });

  // Graceful shutdown handling
  const shutdown = async () => {
    console.log('Server shutting down gracefully...');
    server.close(async () => {
      if (mongoose.connection.readyState === 1) {
        await mongoose.connection.close();
        console.log('MongoDB connection closed.');
      }
      process.exit(0);
    });
  };

  process.on('SIGTERM', shutdown);
  process.on('SIGINT', shutdown);
};

startServer();
