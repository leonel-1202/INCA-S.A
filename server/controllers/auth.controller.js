import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import Usuario from '../models/Usuario.js';

export async function login(req, res) {
    const { userId, password } = req.body;

    if (!userId || !password) {
        return res.status(400).json({ ok: false, error: 'Usuario y contraseña requeridos.' });
    }

    try {
        const usuario = await Usuario.findOne({ id: userId });

        if (!usuario) {
            return res.status(401).json({ ok: false, error: 'Contraseña incorrecta. Intenta de nuevo.' });
        }

        const passwordValida = await bcrypt.compare(password, usuario.password);
        if (!passwordValida) {
            return res.status(401).json({ ok: false, error: 'Contraseña incorrecta. Intenta de nuevo.' });
        }

        const payload = {
            id: usuario.id,
            nombre: usuario.nombre,
            area: usuario.area,
            rol: usuario.rol,
            avatar: usuario.avatar,
            colorRol: usuario.colorRol,
            canSendTo: usuario.canSendTo,
            canApprove: usuario.canApprove,
            canApproveFrom:  usuario.canApproveFrom ?? []
        };

        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '8h' });

        return res.json({ ok: true, token, usuario: payload });

    } catch (error) {
        console.error('[Auth] Error en login:', error);
        return res.status(500).json({ ok: false, error: 'Error interno del servidor.' });
    }
}