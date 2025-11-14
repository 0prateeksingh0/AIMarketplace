/**
 * AIMarketplace Backend Server
 * 
 * Node.js v22+ Express server with best practices
 * - RESTful API architecture
 * - Security hardening
 * - Error handling
 * - Logging
 * - Rate limiting
 * - Input validation
 * 
 * @author AIMarketplace Team
 * @version 1.0.0
 */

import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import compression from 'compression';
import morgan from 'morgan';
import 'dotenv/config';

// Import configurations and middlewares
import { corsOptions } from './config/cors.js';
import { rateLimiter } from './middleware/rateLimiter.js';
import { errorHandler } from './middleware/errorHandler.js';
import { logger } from './config/logger.js';

// Import routes
import authRoutes from './routes/auth.routes.js';
import userRoutes from './routes/user.routes.js';
import productRoutes from './routes/product.routes.js';
import storeRoutes from './routes/store.routes.js';
import orderRoutes from './routes/order.routes.js';
import cartRoutes from './routes/cart.routes.js';
import addressRoutes from './routes/address.routes.js';
import ratingRoutes from './routes/rating.routes.js';
import couponRoutes from './routes/coupon.routes.js';
import adminRoutes from './routes/admin.routes.js';
import webhookRoutes from './routes/webhook.routes.js';

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 5000;
const API_VERSION = process.env.API_VERSION || 'v1';

/**
 * ===========================
 * SECURITY MIDDLEWARE
 * ===========================
 */

// Helmet for security headers
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
  crossOriginEmbedderPolicy: false,
}));

// CORS configuration
app.use(cors(corsOptions));

/**
 * ===========================
 * GENERAL MIDDLEWARE
 * ===========================
 */

// Request logging (development)
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Request logging (production)
if (process.env.NODE_ENV === 'production') {
  app.use(morgan('combined', {
    stream: {
      write: (message) => logger.info(message.trim())
    }
  }));
}

// Body parsers
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Compression
app.use(compression());

// Rate limiting
app.use(rateLimiter);

// Static files
app.use('/uploads', express.static('uploads'));

/**
 * ===========================
 * HEALTH CHECK
 * ===========================
 */

app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Server is running',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV,
    version: API_VERSION
  });
});

/**
 * ===========================
 * API ROUTES
 * ===========================
 */

const apiRouter = express.Router();

// Mount routes
apiRouter.use('/auth', authRoutes);
apiRouter.use('/users', userRoutes);
apiRouter.use('/products', productRoutes);
apiRouter.use('/stores', storeRoutes);
apiRouter.use('/orders', orderRoutes);
apiRouter.use('/cart', cartRoutes);
apiRouter.use('/addresses', addressRoutes);
apiRouter.use('/ratings', ratingRoutes);
apiRouter.use('/coupons', couponRoutes);
apiRouter.use('/admin', adminRoutes);

// Webhook routes (before body parser)
app.use('/webhooks', webhookRoutes);

// Mount API router
app.use(`/api/${API_VERSION}`, apiRouter);

/**
 * ===========================
 * API DOCUMENTATION
 * ===========================
 */

app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to AIMarketplace API',
    version: API_VERSION,
    documentation: `/api/${API_VERSION}/docs`,
    endpoints: {
      health: '/health',
      auth: `/api/${API_VERSION}/auth`,
      users: `/api/${API_VERSION}/users`,
      products: `/api/${API_VERSION}/products`,
      stores: `/api/${API_VERSION}/stores`,
      orders: `/api/${API_VERSION}/orders`,
      cart: `/api/${API_VERSION}/cart`,
      addresses: `/api/${API_VERSION}/addresses`,
      ratings: `/api/${API_VERSION}/ratings`,
      coupons: `/api/${API_VERSION}/coupons`,
      admin: `/api/${API_VERSION}/admin`,
    }
  });
});

/**
 * ===========================
 * 404 HANDLER
 * ===========================
 */

app.use('*', (req, res) => {
  res.status(404).json({
    status: 'error',
    message: `Route ${req.originalUrl} not found`,
  });
});

/**
 * ===========================
 * ERROR HANDLER
 * ===========================
 */

app.use(errorHandler);

/**
 * ===========================
 * START SERVER
 * ===========================
 */

app.listen(PORT, () => {
  logger.info(`
    ╔═══════════════════════════════════════╗
    ║   AIMarketplace Server Started        ║
    ╠═══════════════════════════════════════╣
    ║   Environment: ${process.env.NODE_ENV?.padEnd(20)}║
    ║   Port: ${PORT.toString().padEnd(30)}║
    ║   API Version: ${API_VERSION.padEnd(24)}║
    ║   Node: ${process.version.padEnd(28)}║
    ╚═══════════════════════════════════════╝
  `);
  
  console.log(`\n🚀 Server is running on http://localhost:${PORT}`);
  console.log(`📚 API Documentation: http://localhost:${PORT}/api/${API_VERSION}`);
  console.log(`💚 Health Check: http://localhost:${PORT}/health\n`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM received, shutting down gracefully');
  process.exit(0);
});

process.on('SIGINT', () => {
  logger.info('SIGINT received, shutting down gracefully');
  process.exit(0);
});

// Unhandled promise rejection
process.on('unhandledRejection', (err) => {
  logger.error('Unhandled Rejection:', err);
  process.exit(1);
});

export default app;

