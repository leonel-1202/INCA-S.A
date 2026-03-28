import { Router } from 'express';
import { verificarToken } from '../middleware/auth.middleware.js';
import { aprobar, rechazar, getHistorial } from '../controllers/documento.controller.js';

const router = Router();

router.use(verificarToken);

router.post('/:id/aprobar', aprobar);
router.post('/:id/rechazar', rechazar);
router.get('/:id/historial', getHistorial);

export default router;