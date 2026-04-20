import { Router } from 'express';
import {
  getCarreras,
  getCarrera,
  getRecomendaciones,
} from '../controllers/carrerasController.js';

const router = Router();

router.get('/', getCarreras);
router.post('/recomendaciones', getRecomendaciones);
router.get('/:slug', getCarrera);

export default router;
