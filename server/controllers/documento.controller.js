import Mensaje from '../models/Mensaje.js';
import Historial from '../models/Historial.js';

async function cambiarEstadoConHistorial(mensajeId, nuevoEstado, autorId, nota = '') {
    const mensaje = await Mensaje.findById(mensajeId);
    if (!mensaje) return null;

    const estadoAntes = mensaje.estado;

    mensaje.estado = nuevoEstado;
    await mensaje.save();

    const evento = await Historial.create({
        mensajeId,
        autorId,
        estadoAntes,
        estadoDespues: nuevoEstado,
        nota
    });

    return { mensaje, evento };
}

export async function aprobar(req, res) {
    const { nota } = req.body;
    try {
        const resultado = await cambiarEstadoConHistorial(
            req.params.id, 'aprobado', req.usuario.id, nota
        );
        if (!resultado) return res.status(404).json({ ok: false, error: 'Mensaje no encontrado.' });
        res.json({ ok: true, data: resultado });
    } catch (error) {
        res.status(500).json({ ok: false, error: 'Error al aprobar.' });
    }
}

export async function rechazar(req, res) {
    const { nota } = req.body;
    try {
        const resultado = await cambiarEstadoConHistorial(
            req.params.id, 'rechazado', req.usuario.id, nota
        );
        if (!resultado) return res.status(404).json({ ok: false, error: 'Mensaje no encontrado.' });
        res.json({ ok: true, data: resultado });
    } catch (error) {
        res.status(500).json({ ok: false, error: 'Error al rechazar.' });
    }
}

export async function getHistorial(req, res) {
    try {
        const historial = await Historial.find({ mensajeId: req.params.id }).sort({ createdAt: 1 });
        res.json({ ok: true, data: historial });
    } catch (error) {
        res.status(500).json({ ok: false, error: 'Error al obtener historial.' });
    }
}