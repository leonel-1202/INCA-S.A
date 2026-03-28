import jwt from 'jsonwebtoken';

export function verificarToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ ok: false, error: 'Token requerido.' });
    }

    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET);
        req.usuario = payload;
        next();
    } catch {
        return res.status(403).json({ ok: false, error: 'Token inválido o expirado.' });
    }
}

export function soloAutoridad(req, res, next) {
    if (req.usuario?.canApprove !== true) {
        return res.status(403).json({ ok: false, error: 'Sin permisos para esta acción.' });
    }
    next();
}