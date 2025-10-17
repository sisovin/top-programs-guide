import { Router } from 'express';
import { languageController } from '../controllers/languageController';
import { validate } from '../middleware/validation';
import { CreateLanguageSchema, UpdateLanguageSchema } from '../validation/language';
import { authenticateAdmin } from '../middleware/auth';

const router = Router();

// Public routes
router.get('/', languageController.getAllLanguages);
router.get('/:id', languageController.getLanguageById);

// Admin routes
router.post('/', authenticateAdmin, validate(CreateLanguageSchema), languageController.createLanguage);
router.put('/:id', authenticateAdmin, validate(UpdateLanguageSchema), languageController.updateLanguage);
router.delete('/:id', authenticateAdmin, languageController.deleteLanguage);

export default router;
