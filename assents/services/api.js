const BASE_URL = '/api';

export function getToken() {
    const raw = sessionStorage.getItem('inca_token');
    return raw || null;
}

export function setToken(token) {
    sessionStorage.setItem('inca_token', token);
}

export function removeToken() {
    sessionStorage.removeItem('inca_token');
}

async function request(method, endpoint, body = null) {
    const headers = { 'Content-Type': 'application/json' };

    const token = getToken();
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const config = { method, headers };
    if (body) config.body = JSON.stringify(body);

    try {
        const res = await fetch(`${BASE_URL}${endpoint}`, config);
        const data = await res.json();

        if (!res.ok) {
            return { ok: false, error: data.error || 'Error del servidor.' };
        }

        return { ok: true, data: data.data ?? data };
    } catch (error) {
        console.error('[API] Error de red:', error);
        return { ok: false, error: 'Sin conexión con el servidor.' };
    }
}

export const api = {
    get: (endpoint) => request('GET', endpoint),
    post: (endpoint, body) => request('POST', endpoint, body),
    patch: (endpoint, body)  => request('PATCH', endpoint, body),
    delete: (endpoint) => request('DELETE', endpoint),
};