import mongoSanitize from 'express-mongo-sanitize';
import hpp from 'hpp';
import { Request, Response, NextFunction } from 'express';

/**
 * Sanitize user input to prevent MongoDB operator injection
 * Removes keys that start with '$' or contain '.'
 */
export const sanitizeInput = mongoSanitize({
  replaceWith: '_',
  onSanitize: ({ req, key }) => {
    console.warn(`Sanitized potentially malicious input: ${key} in ${req.method} ${req.path}`);
  },
});

/**
 * Protect against HTTP Parameter Pollution attacks
 * Prevents duplicate query parameters
 */
export const preventParameterPollution = hpp({
  whitelist: [
    // Allow these parameters to appear multiple times
    'sort',
    'filter',
    'fields',
  ],
});

/**
 * Custom input validation middleware
 * Additional security checks beyond Zod validation
 */
export const validateInput = (req: Request, res: Response, next: NextFunction): void => {
  // Check for suspicious patterns in request body
  const body = JSON.stringify(req.body);
  const query = JSON.stringify(req.query);

  // SQL injection patterns
  const sqlPatterns = [
    /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|EXECUTE)\b)/gi,
    /(union\s+select)/gi,
    /(;\s*drop\s+table)/gi,
  ];

  // XSS patterns
  const xssPatterns = [
    /<script[^>]*>[\s\S]*?<\/script>/gi,
    /javascript:/gi,
    /on\w+\s*=/gi, // Event handlers like onclick=
  ];

  // Check SQL injection attempts
  for (const pattern of sqlPatterns) {
    if (pattern.test(body) || pattern.test(query)) {
      console.warn(`Potential SQL injection attempt detected from ${req.ip}`);
      res.status(400).json({
        success: false,
        error: 'InvalidInput',
        message: 'Invalid characters detected in input',
      });
      return;
    }
  }

  // Check XSS attempts
  for (const pattern of xssPatterns) {
    if (pattern.test(body) || pattern.test(query)) {
      console.warn(`Potential XSS attempt detected from ${req.ip}`);
      res.status(400).json({
        success: false,
        error: 'InvalidInput',
        message: 'Invalid characters detected in input',
      });
      return;
    }
  }

  next();
};

/**
 * Security headers middleware
 * Additional security headers beyond helmet
 */
export const securityHeaders = (_req: Request, res: Response, next: NextFunction): void => {
  // Prevent browsers from MIME-sniffing
  res.setHeader('X-Content-Type-Options', 'nosniff');

  // Enable XSS filter in older browsers
  res.setHeader('X-XSS-Protection', '1; mode=block');

  // Prevent clickjacking
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');

  // Control referrer information
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');

  // Feature policy (Permissions-Policy)
  res.setHeader('Permissions-Policy', 'geolocation=(), microphone=(), camera=()');

  next();
};

/**
 * Request size limiter
 * Prevents large payload attacks
 */
export const requestSizeLimiter = (maxSize: string = '10mb') => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const contentLength = req.headers['content-length'];

    if (contentLength) {
      const sizeMB = parseInt(contentLength) / (1024 * 1024);
      const maxSizeMB = parseInt(maxSize);

      if (sizeMB > maxSizeMB) {
        res.status(413).json({
          success: false,
          error: 'PayloadTooLarge',
          message: `Request payload exceeds maximum size of ${maxSize}`,
        });
        return;
      }
    }

    next();
  };
};
