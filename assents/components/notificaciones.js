import { getMisNotificaciones, getNoLeidasCount, marcarLeida, marcarTodasLeidas } from '../services/notificacion.service.js';
import { getNombreById } from '../data/users.js';

let panelAbierto = false;

export async function initNotificaciones(usuario) {
    await actualizarBadgeNotificaciones();
    bindBtnNotificaciones(usuario);

    setInterval(async () => {
        await actualizarBadgeNotificaciones();
    }, 30_000);
}

export async function actualizarBadgeNotificaciones() {
    const count = await getNoLeidasCount();
    const badge = document.getElementById('badgeNotificaciones');
    if (!badge) return;

    if (count > 0) {
        badge.textContent = count > 9 ? '9+' : count;
        badge.hidden = false;
    } else {
        badge.hidden = true;
    }
}

function bindBtnNotificaciones(usuario) {
    const btn = document.getElementById('btnNotificaciones');
    if (!btn) return;

    btn.addEventListener('click', async () => {
        if (panelAbierto) {
            cerrarPanel();
        } else {
            await abrirPanel(usuario);
        }
    });

    document.addEventListener('click', e => {
        const panel = document.getElementById('panelNotificaciones');
        if (panel && !panel.contains(e.target) && !btn.contains(e.target)) {
            cerrarPanel();
        }
    });
}

async function abrirPanel(usuario) {
    panelAbierto = true;
    const panel = document.getElementById('panelNotificaciones');
    if (!panel) return;

    panel.hidden = false;
    panel.innerHTML = `<div class="notif-cargando">Cargando...</div>`;

    const notificaciones = await getMisNotificaciones();

    if (notificaciones.length === 0) {
        panel.innerHTML = `
            <div class="notif-header">
                <span class="notif-titulo">Notificaciones</span>
            </div>
            <div class="notif-vacio">No tenés notificaciones.</div>
        `;
        return;
    }

    panel.innerHTML = `
        <div class="notif-header">
            <span class="notif-titulo">Notificaciones</span>
            <button class="notif-marcar-todas" id="btnMarcarTodas">Marcar todas como leídas</button>
        </div>
        <div class="notif-lista">
            ${notificaciones.map(n => renderNotificacion(n)).join('')}
        </div>
    `;

    document.getElementById('btnMarcarTodas')?.addEventListener('click', async () => {
        await marcarTodasLeidas();
        await actualizarBadgeNotificaciones();
        await abrirPanel(usuario);
    });

    panel.querySelectorAll('.notif-item').forEach(item => {
        item.addEventListener('click', async () => {
            const id = item.dataset.id;
            if (!item.classList.contains('leida')) {
                await marcarLeida(id);
                item.classList.add('leida');
                await actualizarBadgeNotificaciones();
            }
        });
    });
}

function cerrarPanel() {
    panelAbierto = false;
    const panel = document.getElementById('panelNotificaciones');
    if (panel) panel.hidden = true;
}

function renderNotificacion(n) {
    const icono = n.tipo === 'aprobado'
        ? `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>`
        : `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>`;

    const clase = n.tipo === 'aprobado' ? 'notif-aprobado' : 'notif-rechazado';
    const texto = n.tipo === 'aprobado' ? 'aprobó' : 'rechazó';
    const fecha = new Date(n.createdAt).toLocaleString('es-AR', {
        day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit'
    });

    return `
        <div class="notif-item ${n.leida ? 'leida' : ''}" data-id="${n._id}">
            <div class="notif-icono ${clase}">${icono}</div>
            <div class="notif-contenido">
                <div class="notif-texto">
                    <strong>${getNombreById(n.de)}</strong> ${texto} tu mensaje
                    <em>"${n.asunto}"</em>
                </div>
                <div class="notif-fecha">${fecha}</div>
            </div>
            ${!n.leida ? '<div class="notif-punto"></div>' : ''}
        </div>
    `;
}