import { Router } from 'express';
import { verificarToken }  from '../middleware/auth.middleware.js';
import {
    getMisNotificaciones,
    getNoLeidasCount,
    marcarLeida,
    marcarTodasLeidas
} from '../controllers/notificacion.controller.js';

const router = Router();
router.use(verificarToken);

router.get('/', getMisNotificaciones);
router.get('/count', getNoLeidasCount);
router.patch('/:id/leida', marcarLeida);
router.patch('/leidas/todas', marcarTodasLeidas);

export default router;