import { api } from './api.js';

export async function getMisNotificaciones() {
    const res = await api.get('/notificaciones');
    return res.ok ? res.data : [];
}

export async function getNoLeidasCount() {
    const res = await api.get('/notificaciones/count');
    return res.ok ? res.data : 0;
}

export async function marcarLeida(id) {
    const res = await api.patch(`/notificaciones/${id}/leida`);
    return res.ok;
}

export async function marcarTodasLeidas() {
    const res = await api.patch('/notificaciones/leidas/todas');
    return res.ok;
}