import { cambiarVista, logout } from '../app.js';
import { getNoLeidosCount } from '../services/message.service.js';

const Nav_Items = [
    {
        vista: 'inbox',
        label: 'Bandeja de entrada',
        icono: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 12 16 12 14 15 10 15 8 12 2 12"/><path d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"/></svg>`
    },
    {
        vista: 'enviados',
        label: 'Enviados',
        icono: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>`
    }
];

export function renderSidebar(usuario) {
    renderAreaIcon(usuario);
    renderNav(usuario);
    renderPerfil(usuario);
}

function renderAreaIcon(usuario) {
    const contenedor = document.getElementById('sidebarAreas');
    if (!contenedor) return;

    contenedor.innerHTML = '';

    const icono = document.createElement('div');
    icono.className = 'area-icono activo';
    icono.title = usuario.area;
    icono.textContent = usuario.avatar;
    contenedor.appendChild(icono);

    const sep = document.createElement('div');
    sep.className = 'area-separador';
    contenedor.appendChild(sep);
}

function renderNav(usuario) {
    const contenedor = document.getElementById('sidebarNav');
    if (!contenedor) return;

    contenedor.innerHTML = '';

    const label = document.createElement('div');
    label.className = 'nav-grupo-label';
    label.textContent = 'Mensajes';
    contenedor.appendChild(label);

    Nav_Items.forEach(item => {
        const el = document.createElement('div');
        el.className = 'sidebar-item';
        el.dataset.vista = item.vista;
        el.innerHTML = `${item.icono}<span>${item.label}</span>`;

        if (item.vista === 'inbox') el.classList.add('activo');

        el.addEventListener('click', () => cambiarVista(item.vista));

        contenedor.appendChild(el);
    });

    actualizarBadgeInbox();
}

function renderPerfil(usuario) {
    const contenedor = document.getElementById('sidebarPerfil');
    if (!contenedor) return;

    contenedor.innerHTML = `
        <div class="perfil-avatar" style="background-color: ${usuario.colorRol}">
            ${usuario.avatar}
        </div>
        <div class="perfil-info">
            <div class="perfil-nombre">${usuario.nombre}</div>
            <div class="perfil-rol" style="color: ${usuario.colorRol}">${capitalizarRol(usuario.rol)}</div>
        </div>
        <button class="btn-logout" id="btnLogout" title="Cerrar sesión">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                <polyline points="16 17 21 12 16 7"/>
                <line x1="21" y1="12" x2="9" y2="12"/>
            </svg>
        </button>
    `;

    document.getElementById('btnLogout').addEventListener('click', logout);
}

async function actualizarBadgeInbox() {
    const noLeidos = await getNoLeidosCount();
    if (noLeidos === 0) return;

    const itemInbox = document.querySelector('[data-vista="inbox"]');
    if (!itemInbox) return;

    const badge = document.createElement('span');
    badge.className = 'sidebar-badge';
    badge.textContent = noLeidos > 9 ? '9+' : noLeidos;
    itemInbox.appendChild(badge);
}

function capitalizarRol(rol) {
    const nombres = { autoridad: 'Autoridad', gerente: 'Gerente', operativo: 'Operativo' };
    return nombres[rol] ?? rol;
}

export async function refrescarBadge() {
    const badge = document.querySelector('[data-vista="inbox"] .sidebar-badge');
    if (badge) badge.remove();
    await actualizarBadgeInbox();
}