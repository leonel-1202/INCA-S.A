import { Router } from 'express';
import { verificarToken } from '../middleware/auth.middleware.js';
import {
    getRecibidos,
    getEnviados,
    getById,
    enviar,
    marcarLeido,
    cambiarEstado
} from '../controllers/mensaje.controller.js';

const router = Router();

router.use(verificarToken);

router.get('/recibidos', getRecibidos);
router.get('/enviados', getEnviados);
router.get('/:id', getById);
router.post('/', enviar);
router.patch('/:id/leido', marcarLeido);
router.patch('/:id/estado', cambiarEstado);

export default router;