import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { authenticate } from '../middleware/authenticate.js';
import { validate } from '../middleware/validate.js';
import { createPerfilSchema, updatePerfilSchema } from '../validators/perfilSchema.js';
import {
  createPerfil,
  getPerfil,
  updatePerfil,
} from '../controllers/perfilesController.js';

const router = Router();

// Stricter rate limit on profile recovery to prevent enumeration
const recoverLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, error: 'Demasiadas solicitudes. Intenta en 15 minutos.' },
});

router.post('/',      validate(createPerfilSchema), createPerfil);
router.get('/:id',   recoverLimiter, getPerfil);
router.patch('/:id', authenticate, validate(updatePerfilSchema), updatePerfil);

export default router;
