import { api } from './api.js';

export async function getRecibidos() {
    const res = await api.get('/mensajes/recibidos');
    return res.ok ? res.data : [];
}

export async function getEnviados() {
    const res = await api.get('/mensajes/enviados');
    return res.ok ? res.data : [];
}

export async function getMensajeById(id) {
    const res = await api.get(`/mensajes/${id}`);
    return res.ok ? res.data : null;
}

export async function getNoLeidosCount() {
    const recibidos = await getRecibidos();
    return recibidos.filter(m => !m.leido).length;
}

export async function enviar({ para, asunto, cuerpo, adjuntos = [] }) {
    const res = await api.post('/mensajes', { para, asunto, cuerpo, adjuntos });
    return res.ok ? res.data : null;
}

export async function marcarLeido(id) {
    const res = await api.patch(`/mensajes/${id}/leido`);
    return res.ok ? res.data : null;
}

export async function cambiarEstado(id, estado) {
    const res = await api.patch(`/mensajes/${id}/estado`, { estado });
    return res.ok ? res.data : null;
}