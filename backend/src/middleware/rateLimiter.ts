import rateLimit from 'express-rate-limit';
import { Request, Response } from 'express';

/**
 * General API rate limiter
 * Limits: 100 requests per 15 minutes per IP
 */
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: {
    success: false,
    error: 'TooManyRequests',
    message: 'Too many requests from this IP, please try again later.',
  },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  // Store in memory (for production, use Redis)
  handler: (_req: Request, res: Response) => {
    res.status(429).json({
      success: false,
      error: 'TooManyRequests',
      message: 'Too many requests from this IP, please try again later.',
    });
  },
});

/**
 * Strict rate limiter for authentication endpoints
 * Limits: 5 requests per 15 minutes per IP
 */
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 login attempts per windowMs
  message: {
    success: false,
    error: 'TooManyAuthAttempts',
    message: 'Too many authentication attempts, please try again later.',
  },
  skipSuccessfulRequests: true, // Don't count successful requests
  handler: (_req: Request, res: Response) => {
    res.status(429).json({
      success: false,
      error: 'TooManyAuthAttempts',
      message: 'Too many authentication attempts, please try again later.',
    });
  },
});

/**
 * Moderate rate limiter for admin endpoints
 * Limits: 30 requests per 15 minutes per IP
 */
export const adminLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 30, // Limit each IP to 30 admin operations per windowMs
  message: {
    success: false,
    error: 'TooManyAdminRequests',
    message: 'Too many admin operations, please slow down.',
  },
  handler: (_req: Request, res: Response) => {
    res.status(429).json({
      success: false,
      error: 'TooManyAdminRequests',
      message: 'Too many admin operations, please slow down.',
    });
  },
});

/**
 * Lenient rate limiter for read operations
 * Limits: 200 requests per 15 minutes per IP
 */
export const readLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200, // Limit each IP to 200 reads per windowMs
  message: {
    success: false,
    error: 'TooManyRequests',
    message: 'Too many requests, please slow down.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});
