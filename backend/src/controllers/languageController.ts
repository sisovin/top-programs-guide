import { Request, Response, NextFunction } from 'express';
import prisma from '../prisma/client';
import { securityLogger } from '../middleware/logging';

export const languageController = {
  async getAllLanguages(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const search = req.query.search as string | undefined;
      const sort = (req.query.sort as string) || 'popularityIndex';
      const order = (req.query.order as 'asc' | 'desc') || 'desc';

      const skip = (page - 1) * limit;

      const where = search
        ? {
          OR: [
            { name: { contains: search, mode: 'insensitive' as const } },
            { description: { contains: search, mode: 'insensitive' as const } }
          ]
        }
        : {};

      const [languages, total] = await Promise.all([
        prisma.programmingLanguage.findMany({
          where,
          skip,
          take: limit,
          orderBy: { [sort]: order }
        }),
        prisma.programmingLanguage.count({ where })
      ]);

      res.json({
        success: true,
        data: languages,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit)
        }
      });
    } catch (error) {
      next(error);
    }
  },

  async getLanguageById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = parseInt(req.params.id);

      // Validate that id is a valid number
      if (isNaN(id) || id <= 0) {
        res.status(400).json({
          success: false,
          error: 'ValidationError',
          message: 'Invalid language ID. Must be a positive integer.'
        });
        return;
      }

      const language = await prisma.programmingLanguage.findUnique({
        where: { id },
        include: {
          careerPaths: true
        }
      });

      if (!language) {
        res.status(404).json({
          success: false,
          error: 'NotFoundError',
          message: 'Language not found'
        });
        return;
      }

      res.json({
        success: true,
        data: language
      });
    } catch (error) {
      next(error);
    }
  },

  async createLanguage(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const language = await prisma.programmingLanguage.create({
        data: req.body
      });

      // Log admin action
      securityLogger.logAdminAction(req, 'CREATE', 'language', language.id.toString());

      res.status(201).json({
        success: true,
        data: language
      });
    } catch (error) {
      next(error);
    }
  },

  async updateLanguage(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = parseInt(req.params.id);

      const language = await prisma.programmingLanguage.update({
        where: { id },
        data: req.body
      });

      // Log admin action
      securityLogger.logAdminAction(req, 'UPDATE', 'language', id.toString());

      res.json({
        success: true,
        data: language
      });
    } catch (error) {
      next(error);
    }
  },

  async deleteLanguage(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = parseInt(req.params.id);

      await prisma.programmingLanguage.delete({
        where: { id }
      });

      // Log admin action
      securityLogger.logAdminAction(req, 'DELETE', 'language', id.toString());

      res.json({
        success: true,
        message: 'Language deleted successfully'
      });
    } catch (error) {
      next(error);
    }
  }
};
