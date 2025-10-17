import { Request, Response, NextFunction } from 'express';
import logger from '../utils/logger';

/**
 * Request logging middleware
 * Logs incoming requests with method, URL, IP, and response time
 */
export const requestLogger = (req: Request, res: Response, next: NextFunction): void => {
  const start = Date.now();

  // Capture original end function
  const originalEnd = res.end;

  // Override end function to log after response is sent
  res.end = function (chunk?: any, encoding?: any, callback?: any): Response {
    // Calculate response time
    const duration = Date.now() - start;

    // Extract useful information
    const logData = {
      method: req.method,
      url: req.originalUrl || req.url,
      statusCode: res.statusCode,
      duration: `${duration}ms`,
      ip: req.ip || req.socket.remoteAddress,
      userAgent: req.get('user-agent'),
      userId: (req as any).user?.userId, // If authenticated
    };

    // Determine log level based on status code
    if (res.statusCode >= 500) {
      logger.error('Request failed with server error', logData);
    } else if (res.statusCode >= 400) {
      logger.warn('Request failed with client error', logData);
    } else if (duration > 1000) {
      logger.warn('Slow request detected', logData);
    } else {
      logger.http('Request completed', logData);
    }

    // Call original end function
    return originalEnd.call(this, chunk, encoding, callback);
  };

  next();
};

/**
 * Performance monitoring middleware
 * Tracks slow endpoints and database queries
 */
export const performanceMonitor = (req: Request, res: Response, next: NextFunction): void => {
  const start = Date.now();

  // Add performance tracking to request object
  (req as any).startTime = start;

  // Track database query time
  (req as any).dbQueryTime = 0;

  res.on('finish', () => {
    const duration = Date.now() - start;
    const dbTime = (req as any).dbQueryTime || 0;

    // Log slow requests (> 1 second)
    if (duration > 1000) {
      logger.warn('Slow endpoint detected', {
        method: req.method,
        url: req.originalUrl,
        totalTime: `${duration}ms`,
        dbTime: `${dbTime}ms`,
        nonDbTime: `${duration - dbTime}ms`,
      });
    }

    // Track metrics (can be sent to monitoring service)
    // In production, send to monitoring service (e.g., DataDog, New Relic)
    if (process.env.NODE_ENV === 'production') {
      // TODO: Implement metrics reporting
      // Example: metricsClient.gauge('api.response_time', duration, {
      //   endpoint: `${req.method} ${req.route?.path || req.originalUrl}`,
      //   statusCode: res.statusCode,
      //   timestamp: new Date().toISOString()
      // });
    }
  });

  next();
};

/**
 * Error logging middleware
 * Logs errors with full context and stack trace
 */
export const errorLogger = (err: Error, req: Request, _res: Response, next: NextFunction): void => {
  const errorDetails = {
    message: err.message,
    stack: err.stack,
    method: req.method,
    url: req.originalUrl,
    ip: req.ip || req.socket.remoteAddress,
    userId: (req as any).user?.userId,
    body: req.body,
    query: req.query,
    params: req.params,
    headers: {
      'user-agent': req.get('user-agent'),
      'content-type': req.get('content-type'),
    },
  };

  logger.error('Unhandled error occurred', errorDetails);

  next(err);
};

/**
 * Security event logger
 * Logs security-related events like failed auth attempts
 */
export const securityLogger = {
  logFailedAuth: (req: Request, email: string, reason: string): void => {
    logger.warn('Authentication failed', {
      email,
      reason,
      ip: req.ip || req.socket.remoteAddress,
      userAgent: req.get('user-agent'),
      timestamp: new Date().toISOString(),
    });
  },

  logSuccessfulAuth: (req: Request, userId: string, email: string): void => {
    logger.info('Authentication successful', {
      userId,
      email,
      ip: req.ip || req.socket.remoteAddress,
      userAgent: req.get('user-agent'),
      timestamp: new Date().toISOString(),
    });
  },

  logAdminAction: (req: Request, action: string, resource: string, resourceId?: string): void => {
    logger.info('Admin action performed', {
      userId: (req as any).user?.userId,
      email: (req as any).user?.email,
      action,
      resource,
      resourceId,
      ip: req.ip || req.socket.remoteAddress,
      timestamp: new Date().toISOString(),
    });
  },

  logSuspiciousActivity: (req: Request, reason: string, details?: Record<string, any>): void => {
    logger.warn('Suspicious activity detected', {
      reason,
      ip: req.ip || req.socket.remoteAddress,
      userAgent: req.get('user-agent'),
      url: req.originalUrl,
      ...details,
      timestamp: new Date().toISOString(),
    });
  },
};
