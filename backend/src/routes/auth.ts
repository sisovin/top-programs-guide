import { Router } from 'express';
import { login, refreshAccessToken, registerAdmin, getCurrentUser } from '../controllers/authController';
import { authenticate } from '../middleware/auth';

const router = Router();

/**
 * POST /api/auth/login
 * Authenticate user and get tokens
 */
router.post('/login', login);

/**
 * POST /api/auth/refresh
 * Refresh access token using refresh token
 */
router.post('/refresh', refreshAccessToken);

/**
 * POST /api/auth/register-admin
 * Register a new admin user (protected by secret)
 */
router.post('/register-admin', registerAdmin);

/**
 * GET /api/auth/me
 * Get current authenticated user
 */
router.get('/me', authenticate, getCurrentUser);

export default router;
