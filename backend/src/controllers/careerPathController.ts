import { Request, Response, NextFunction } from 'express';
import prisma from '../prisma/client';

export const careerPathController = {
  async getAllCareerPaths(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 20;
      const languageId = req.query.languageId ? parseInt(req.query.languageId as string) : undefined;
      const sort = (req.query.sort as string) || 'title';
      const order = (req.query.order as 'asc' | 'desc') || 'asc';

      const skip = (page - 1) * limit;

      const where = languageId ? { languageId } : {};

      const [careerPaths, total] = await Promise.all([
        prisma.careerPath.findMany({
          where,
          skip,
          take: limit,
          orderBy: { [sort]: order },
          include: {
            language: {
              select: {
                id: true,
                name: true,
                logoUrl: true,
                popularityIndex: true
              }
            }
          }
        }),
        prisma.careerPath.count({ where })
      ]);

      res.json({
        success: true,
        data: careerPaths,
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

  async getCareerPathById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;

      const careerPath = await prisma.careerPath.findUnique({
        where: { id: parseInt(id) },
        include: {
          language: {
            select: {
              id: true,
              name: true,
              logoUrl: true,
              popularityIndex: true,
              description: true
            }
          }
        }
      });

      if (!careerPath) {
        res.status(404).json({
          success: false,
          message: 'Career path not found'
        });
        return;
      }

      res.json({
        success: true,
        data: careerPath
      });
    } catch (error) {
      next(error);
    }
  },

  async getCareerPathsByLanguage(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { languageId } = req.params;

      const careerPaths = await prisma.careerPath.findMany({
        where: { languageId: parseInt(languageId) },
        orderBy: { title: 'asc' },
        include: {
          language: {
            select: {
              id: true,
              name: true,
              logoUrl: true
            }
          }
        }
      });

      res.json({
        success: true,
        data: careerPaths
      });
    } catch (error) {
      next(error);
    }
  }
};