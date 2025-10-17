import { Request, Response, NextFunction } from 'express';
import { Prisma } from '@prisma/client';

interface ErrorResponse {
  success: false;
  error: string;
  message: string;
  details?: unknown[];
}

export const errorHandler = (
  error: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  console.error('Error:', error);

  // Prisma errors
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === 'P2002') {
      res.status(409).json({
        success: false,
        error: 'ConflictError',
        message: 'Resource already exists',
        details: [{ field: error.meta?.target }]
      } as ErrorResponse);
      return;
    }
    if (error.code === 'P2025') {
      res.status(404).json({
        success: false,
        error: 'NotFoundError',
        message: 'Resource not found'
      } as ErrorResponse);
      return;
    }
  }

  // Validation errors
  if (error.name === 'ZodError') {
    res.status(400).json({
      success: false,
      error: 'ValidationError',
      message: 'Invalid input data',
      details: (error as any).errors
    } as ErrorResponse);
    return;
  }

  // Default error
  res.status(500).json({
    success: false,
    error: 'InternalServerError',
    message: error.message || 'An unexpected error occurred'
  } as ErrorResponse);
};
