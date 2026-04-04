import Notificacion from '../models/Notificacion.js';

export async function getMisNotificaciones(req, res) {
    try {
        const notificaciones = await Notificacion
            .find({ para: req.usuario.id })
            .sort({ createdAt: -1 })
            .limit(20);
        res.json({ ok: true, data: notificaciones });
    } catch (error) {
        res.status(500).json({ ok: false, error: 'Error al obtener notificaciones.' });
    }
}

export async function getNoLeidasCount(req, res) {
    try {
        const count = await Notificacion.countDocuments({
            para:  req.usuario.id,
            leida: false
        });
        res.json({ ok: true, data: count });
    } catch (error) {
        res.status(500).json({ ok: false, error: 'Error al contar notificaciones.' });
    }
}

export async function marcarLeida(req, res) {
    try {
        await Notificacion.findByIdAndUpdate(req.params.id, { leida: true });
        res.json({ ok: true });
    } catch (error) {
        res.status(500).json({ ok: false, error: 'Error al marcar notificación.' });
    }
}

export async function marcarTodasLeidas(req, res) {
    try {
        await Notificacion.updateMany({ para: req.usuario.id, leida: false }, { leida: true });
        res.json({ ok: true });
    } catch (error) {
        res.status(500).json({ ok: false, error: 'Error al marcar notificaciones.' });
    }
}