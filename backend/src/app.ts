import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import languageRoutes from './routes/languages';
import authRoutes from './routes/auth';
import { errorHandler } from './middleware/errorHandler';
import { requestLogger, performanceMonitor, errorLogger } from './middleware/logging';
import { apiLimiter, authLimiter, readLimiter } from './middleware/rateLimiter';
import {
  sanitizeInput,
  preventParameterPollution,
  validateInput,
  securityHeaders,
  requestSizeLimiter
} from './middleware/security';
import logger from './utils/logger';
import {
  initSentry,
  sentryRequestHandler,
  sentryTracingHandler,
  sentryErrorHandler
} from './utils/sentry';

dotenv.config();

const app: Express = express();
const PORT = process.env.PORT || 3001;

// Initialize Sentry (must be first)
initSentry(app);

// Sentry request handler (must be first middleware)
app.use(sentryRequestHandler);

// Sentry tracing middleware
app.use(sentryTracingHandler);

// Security middleware
app.use(helmet());
app.use(securityHeaders);

// CORS configuration
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000'],
  credentials: true
}));

// Body parsing middleware with size limits
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Input sanitization and validation
app.use(sanitizeInput);
app.use(preventParameterPollution);
app.use(validateInput);
app.use(requestSizeLimiter('10mb'));

// Logging and monitoring middleware
app.use(requestLogger);
app.use(performanceMonitor);

// Health check (before authentication to allow monitoring)
app.get('/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    uptime: process.uptime()
  });
});

// Routes with rate limiting
app.use('/api/languages', readLimiter, languageRoutes); // Read-heavy endpoints
app.use('/api/auth', authLimiter, authRoutes); // Strict rate limiting for auth

// Apply general API rate limiter to all /api routes
app.use('/api', apiLimiter);

// 404 handler
app.use((req: Request, res: Response) => {
  logger.warn('Route not found', {
    method: req.method,
    url: req.originalUrl
  });
  res.status(404).json({
    error: 'Not Found',
    message: 'The requested resource does not exist'
  });
});

// Error logging middleware
app.use(errorLogger);

// Sentry error handler (must be before other error handlers)
app.use(sentryErrorHandler);

// Error handling
app.use(errorHandler);

// Start server
const server = app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
  logger.info(`Environment: ${process.env.NODE_ENV || 'development'}`);
  logger.info(`CORS origins: ${process.env.ALLOWED_ORIGINS || 'http://localhost:3000'}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    logger.info('HTTP server closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  logger.info('SIGINT signal received: closing HTTP server');
  server.close(() => {
    logger.info('HTTP server closed');
    process.exit(0);
  });
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason: any, promise: Promise<any>) => {
  logger.error('Unhandled Rejection at:', { promise, reason });
});

// Handle uncaught exceptions
process.on('uncaughtException', (error: Error) => {
  logger.error('Uncaught Exception:', { error: error.message, stack: error.stack });
  process.exit(1);
});

export default app;
