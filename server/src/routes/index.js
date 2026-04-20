import { Router } from 'express';
import carrerasRouter from './carreras.js';
import perfilesRouter from './perfiles.js';

const router = Router();

router.use('/carreras', carrerasRouter);
router.use('/perfiles', perfilesRouter);

export default router;
