import Mensaje from '../models/Mensaje.js';

export async function getRecibidos(req, res) {
    try {
        const mensajes = await Mensaje.find({ para: req.usuario.id }).sort({ createdAt: -1 });
        res.json({ ok: true, data: mensajes });
    } catch (error) {
        res.status(500).json({ ok: false, error: 'Error al obtener mensajes.' });
    }
}

export async function getEnviados(req, res) {
    try {
        const mensajes = await Mensaje.find({ de: req.usuario.id }).sort({ createdAt: -1 });
        res.json({ ok: true, data: mensajes });
    } catch (error) {
        res.status(500).json({ ok: false, error: 'Error al obtener mensajes enviados.' });
    }
}

export async function getById(req, res) {
    try {
        const mensaje = await Mensaje.findById(req.params.id);
        if (!mensaje) return res.status(404).json({ ok: false, error: 'Mensaje no encontrado.' });
        res.json({ ok: true, data: mensaje });
    } catch (error) {
        res.status(500).json({ ok: false, error: 'Error al obtener el mensaje.' });
    }
}

export async function enviar(req, res) {
    const { para, asunto, cuerpo, adjuntos } = req.body;

    if (!para || !asunto || !cuerpo) {
        return res.status(400).json({ ok: false, error: 'Faltan campos requeridos.' });
    }

    try {
        const nuevo = await Mensaje.create({
            de: req.usuario.id,
            para,
            asunto,
            cuerpo,
            adjuntos: adjuntos || [],
            estado: 'recibido',
            leido: false
        });
        res.status(201).json({ ok: true, data: nuevo });
    } catch (error) {
        res.status(500).json({ ok: false, error: 'Error al enviar el mensaje.' });
    }
}

export async function marcarLeido(req, res) {
    try {
        const mensaje = await Mensaje.findByIdAndUpdate(
            req.params.id,
            { leido: true, estado: 'leido' },
            { new: true }
        );
        if (!mensaje) return res.status(404).json({ ok: false, error: 'Mensaje no encontrado.' });
        res.json({ ok: true, data: mensaje });
    } catch (error) {
        res.status(500).json({ ok: false, error: 'Error al marcar como leído.' });
    }
}

export async function cambiarEstado(req, res) {
    const estadosValidos = ['recibido', 'leido', 'aprobado', 'rechazado', 'pendiente'];
    const { estado } = req.body;

    if (!estadosValidos.includes(estado)) {
        return res.status(400).json({ ok: false, error: `Estado inválido: ${estado}` });
    }

    try {
        const mensaje = await Mensaje.findByIdAndUpdate(
            req.params.id,
            { estado },
            { new: true }
        );
        if (!mensaje) return res.status(404).json({ ok: false, error: 'Mensaje no encontrado.' });
        res.json({ ok: true, data: mensaje });
    } catch (error) {
        res.status(500).json({ ok: false, error: 'Error al cambiar estado.' });
    }
}