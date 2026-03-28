import { api, setToken, removeToken } from './api.js';

const KEY_SESION = 'inca_sesion';

export async function login(userId, password) {
    if (!userId)   return { ok: false, error: 'Seleccioná tu área.' };
    if (!password) return { ok: false, error: 'Ingresá tu contraseña.' };

    const resultado = await api.post('/auth/login', { userId, password });

    if (!resultado.ok) return { ok: false, error: resultado.error };

    setToken(resultado.data.token);
    sessionStorage.setItem(KEY_SESION, JSON.stringify(resultado.data.usuario));

    return { ok: true, usuario: resultado.data.usuario };
}

export function logout() {
    removeToken();
    sessionStorage.removeItem(KEY_SESION);
}

export function getSesion() {
    const raw = sessionStorage.getItem(KEY_SESION);
    if (!raw) return null;
    try {
        return JSON.parse(raw);
    } catch {
        return null;
    }
}

export function estaLogueado() {
    return getSesion() !== null;
}

export function requiereAuth() {
    if (!estaLogueado()) {
        window.location.href = 'index.html';
    }
}

export function puedeAprobar() {
    return getSesion()?.canApprove === true;
}

export function puedeEnviarA(destinatarioId) {
    const sesion = getSesion();
    if (!sesion) return false;
    if (sesion.canSendTo.includes('*')) return true;
    return sesion.canSendTo.includes(destinatarioId);
}