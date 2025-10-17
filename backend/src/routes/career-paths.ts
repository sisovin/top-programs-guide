import { Router } from 'express';
import { careerPathController } from '../controllers/careerPathController';

const router = Router();

// Public routes
router.get('/', careerPathController.getAllCareerPaths);
router.get('/:id', careerPathController.getCareerPathById);
router.get('/language/:languageId', careerPathController.getCareerPathsByLanguage);

export default router;