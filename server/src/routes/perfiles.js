import { Router } from 'express';
import {
  createPerfil,
  getPerfil,
  updatePerfil,
} from '../controllers/perfilesController.js';

const router = Router();

router.post('/', createPerfil);
router.get('/:id', getPerfil);
router.patch('/:id', updatePerfil);

export default router;
