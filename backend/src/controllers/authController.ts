import { Request, Response } from 'express';
import { z } from 'zod';
import prisma from '../prisma/client';
import {
  generateAccessToken,
  generateRefreshToken,
  verifyToken,
  comparePassword,
  hashPassword
} from '../middleware/auth';
import { securityLogger } from '../middleware/logging';

// Validation schemas
const loginSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(6, 'Password must be at least 6 characters')
});

const refreshTokenSchema = z.object({
  refreshToken: z.string().min(1, 'Refresh token is required')
});

const registerAdminSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  name: z.string().min(2, 'Name must be at least 2 characters'),
  adminSecret: z.string().min(1, 'Admin secret is required')
});

/**
 * POST /api/auth/login
 * Authenticate user and return tokens
 */
export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    // Validate request body
    const { email, password } = loginSchema.parse(req.body);

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        password: true
      }
    });

    if (!user) {
      securityLogger.logFailedAuth(req, email, 'User not found');
      res.status(401).json({
        success: false,
        error: 'InvalidCredentials',
        message: 'Invalid email or password'
      });
      return;
    }

    // Verify password
    const isValidPassword = await comparePassword(password, user.password);

    if (!isValidPassword) {
      securityLogger.logFailedAuth(req, email, 'Invalid password');
      res.status(401).json({
        success: false,
        error: 'InvalidCredentials',
        message: 'Invalid email or password'
      });
      return;
    }

    // Generate tokens
    const tokenPayload = {
      userId: user.id,
      email: user.email,
      role: user.role
    };

    const accessToken = generateAccessToken(tokenPayload);
    const refreshToken = generateRefreshToken(tokenPayload);

    // Log successful authentication
    securityLogger.logSuccessfulAuth(req, user.id.toString(), user.email);

    // Return tokens and user info
    res.json({
      success: true,
      data: {
        accessToken,
        refreshToken,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role
        }
      }
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({
        success: false,
        error: 'ValidationError',
        message: 'Invalid request data',
        details: error.errors
      });
      return;
    }

    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      error: 'ServerError',
      message: 'An error occurred during login'
    });
  }
};

/**
 * POST /api/auth/refresh
 * Refresh access token using refresh token
 */
export const refreshAccessToken = async (req: Request, res: Response): Promise<void> => {
  try {
    // Validate request body
    const { refreshToken } = refreshTokenSchema.parse(req.body);

    // Verify refresh token
    const decoded = verifyToken(refreshToken);

    // Verify user still exists
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        email: true,
        role: true
      }
    });

    if (!user) {
      res.status(401).json({
        success: false,
        error: 'InvalidToken',
        message: 'User no longer exists'
      });
      return;
    }

    // Generate new access token
    const tokenPayload = {
      userId: user.id,
      email: user.email,
      role: user.role
    };

    const accessToken = generateAccessToken(tokenPayload);

    res.json({
      success: true,
      data: {
        accessToken
      }
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({
        success: false,
        error: 'ValidationError',
        message: 'Invalid request data',
        details: error.errors
      });
      return;
    }

    res.status(401).json({
      success: false,
      error: 'InvalidToken',
      message: 'Invalid or expired refresh token'
    });
  }
};

/**
 * POST /api/auth/register-admin
 * Register a new admin user (protected by admin secret)
 */
export const registerAdmin = async (req: Request, res: Response): Promise<void> => {
  try {
    // Validate request body
    const { email, password, name, adminSecret } = registerAdminSchema.parse(req.body);

    // Verify admin secret
    const ADMIN_SECRET = process.env.ADMIN_REGISTRATION_SECRET || 'change-this-secret';

    if (adminSecret !== ADMIN_SECRET) {
      res.status(403).json({
        success: false,
        error: 'InvalidSecret',
        message: 'Invalid admin registration secret'
      });
      return;
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      res.status(409).json({
        success: false,
        error: 'UserExists',
        message: 'User with this email already exists'
      });
      return;
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create admin user
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        role: 'admin'
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true
      }
    });

    res.status(201).json({
      success: true,
      data: {
        user,
        message: 'Admin user created successfully'
      }
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({
        success: false,
        error: 'ValidationError',
        message: 'Invalid request data',
        details: error.errors
      });
      return;
    }

    console.error('Admin registration error:', error);
    res.status(500).json({
      success: false,
      error: 'ServerError',
      message: 'An error occurred during registration'
    });
  }
};

/**
 * GET /api/auth/me
 * Get current user info (requires authentication)
 */
export const getCurrentUser = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        error: 'NotAuthenticated',
        message: 'Not authenticated'
      });
      return;
    }

    const user = await prisma.user.findUnique({
      where: { id: req.user.userId },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true
      }
    });

    if (!user) {
      res.status(404).json({
        success: false,
        error: 'UserNotFound',
        message: 'User not found'
      });
      return;
    }

    res.json({
      success: true,
      data: { user }
    });
  } catch (error) {
    console.error('Get current user error:', error);
    res.status(500).json({
      success: false,
      error: 'ServerError',
      message: 'An error occurred fetching user information'
    });
  }
};
