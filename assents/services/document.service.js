import { api } from './api.js';
import { getNombreById } from '../data/users.js';

export async function getHistorialDeMensaje(mensajeId) {
    const res = await api.get(`/documentos/${mensajeId}/historial`);
    return res.ok ? res.data : [];
}

export async function getHistorialFormateado(mensajeId) {
    const historial = await getHistorialDeMensaje(mensajeId);
    return historial.map(e => ({
        ...e,
        autorNombre: getNombreById(e.autorId),
        fechaFormateada: new Date(e.createdAt).toLocaleString('es-AR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })
    }));
}

export async function aprobar(mensajeId, nota = '') {
    const res = await api.post(`/documentos/${mensajeId}/aprobar`, { nota });
    return res.ok ? res.data : null;
}

export async function rechazar(mensajeId, nota = '') {
    const res = await api.post(`/documentos/${mensajeId}/rechazar`, { nota });
    return res.ok ? res.data : null;
}