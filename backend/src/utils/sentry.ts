import * as Sentry from '@sentry/node';
import { Express } from 'express';
import logger from './logger';

/**
 * Initialize Sentry error tracking
 */
export const initSentry = (app: Express): void => {
  const dsn = process.env.SENTRY_DSN;

  // Skip Sentry initialization if DSN is not provided
  if (!dsn) {
    logger.warn('Sentry DSN not configured. Error tracking disabled.');
    return;
  }

  Sentry.init({
    dsn,
    environment: process.env.NODE_ENV || 'development',

    // Set tracesSampleRate to 1.0 to capture 100% of transactions for performance monitoring
    // Adjust in production based on traffic
    tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,

    integrations: [
      // Enable HTTP calls tracing
      Sentry.httpIntegration(),
      // Enable Express.js middleware tracing
      Sentry.expressIntegration(),
    ],

    // Filter out sensitive data
    beforeSend(event) {
      // Remove sensitive headers
      if (event.request?.headers) {
        delete event.request.headers['authorization'];
        delete event.request.headers['cookie'];
      }

      // Remove sensitive data from extra context
      if (event.extra) {
        delete event.extra['password'];
        delete event.extra['token'];
      }

      return event;
    },

    // Ignore specific errors
    ignoreErrors: [
      // Browser errors
      'ResizeObserver loop limit exceeded',
      'Non-Error promise rejection captured',
      // Network errors
      'Network request failed',
      'NetworkError',
      // Common user errors
      'Unauthorized',
      'Forbidden',
    ],
  });

  logger.info('Sentry error tracking initialized');

  // Store app reference for potential future use
  (global as any).__sentryApp = app;
};

/**
 * Sentry request handler middleware (must be the first middleware)
 */
export const sentryRequestHandler = (_req: any, _res: any, next: any) => {
  // Sentry v8+ handles this automatically via expressIntegration
  next();
};

/**
 * Sentry tracing middleware (must be after request handler)
 */
export const sentryTracingHandler = (_req: any, _res: any, next: any) => {
  // Modern Sentry automatically handles tracing
  next();
};

/**
 * Sentry error handler middleware (must be after all controllers)
 */
export const sentryErrorHandler = (err: any, _req: any, _res: any, next: any) => {
  // Capture error in Sentry
  const statusCode = err.statusCode || err.status;
  if (!statusCode || statusCode >= 500) {
    Sentry.captureException(err);
  }

  // Pass error to next handler
  next(err);
};

/**
 * Manually capture exception
 */
export const captureException = (error: Error, context?: Record<string, any>): void => {
  Sentry.captureException(error, {
    extra: context,
  });
  logger.error('Exception captured by Sentry', { error: error.message, context });
};

/**
 * Manually capture message
 */
export const captureMessage = (message: string, level: Sentry.SeverityLevel = 'info'): void => {
  Sentry.captureMessage(message, level);
  logger.info(`Message captured by Sentry: ${message}`);
};

/**
 * Set user context for error tracking
 */
export const setUser = (user: { id: string; email?: string; username?: string }): void => {
  Sentry.setUser(user);
};

/**
 * Clear user context
 */
export const clearUser = (): void => {
  Sentry.setUser(null);
};

/**
 * Add breadcrumb for debugging
 */
export const addBreadcrumb = (message: string, category?: string, data?: Record<string, any>): void => {
  Sentry.addBreadcrumb({
    message,
    category: category || 'custom',
    level: 'info',
    data,
  });
};

export default Sentry;
