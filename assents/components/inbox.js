import { getNombreById, puedeAprobarMensaje } from '../data/users.js';
import { getRecibidos, getEnviados,
        getMensajeById, marcarLeido } from '../services/message.service.js';
import { aprobar, rechazar,
        getHistorialFormateado } from '../services/document.service.js';
import { renderBadge } from './statusBadge.js';
import { cambiarVista } from '../app.js';
import { refrescarBadge } from './sidebar.js';

let filtroActivo = 'todos';

export async function renderInbox(usuario) {
    await renderBandeja(usuario);
    await renderEnviados(usuario);
}

async function renderBandeja(usuario) {
    const contenedor = document.getElementById('listaMensaje');
    if (!contenedor) return;
    contenedor.innerHTML = renderCargando();

    const mensajes = await getRecibidos();

    bindFiltros(usuario, mensajes);
    aplicarFiltro(usuario, mensajes, filtroActivo);
}

function bindFiltros(usuario, mensajes) {
    document.querySelectorAll('.btn-filtro').forEach(btn => {
        const nuevo = btn.cloneNode(true);
        btn.parentNode.replaceChild(nuevo, btn);
    });

    document.querySelectorAll('.btn-filtro').forEach(btn => {
        btn.addEventListener('click', () => {
            filtroActivo = btn.dataset.filtro;
            document.querySelectorAll('.btn-filtro').forEach(b =>
                b.classList.toggle('activo', b.dataset.filtro === filtroActivo)
            );
            aplicarFiltro(usuario, mensajes, filtroActivo);
        });
    });

    document.querySelectorAll('.btn-filtro').forEach(b =>
        b.classList.toggle('activo', b.dataset.filtro === filtroActivo)
    );
}

function aplicarFiltro(usuario, mensajes, filtro) {
    const contenedor = document.getElementById('listaMensaje');
    if (!contenedor) return;

    let filtrados = mensajes;

    if (filtro === 'pendientes') {
        filtrados = mensajes.filter(m => m.estado === 'pendiente' || m.estado === 'recibido');
    } else if (filtro === 'aprobados') {
        filtrados = mensajes.filter(m => m.estado === 'aprobado');
    } else if (filtro === 'rechazados') {
        filtrados = mensajes.filter(m => m.estado === 'rechazado');
    }

    if (filtrados.length === 0) {
        contenedor.innerHTML = renderVacio('No hay mensajes con ese filtro.');
        return;
    }

    contenedor.innerHTML = filtrados
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .map(m => renderTarjetaMensaje(m, 'inbox'))
        .join('');

    contenedor.querySelectorAll('.mensaje-card').forEach(card => {
        card.addEventListener('click', () => abrirDetalle(card.dataset.id, usuario));
    });
}

async function renderEnviados(usuario) {
    const contenedor = document.getElementById('listaMensajeEnviados');
    if (!contenedor) return;
    contenedor.innerHTML = renderCargando();
    const mensajes = await getEnviados();

    if (mensajes.length === 0) {
        contenedor.innerHTML = renderVacio('No has enviado ningún mensaje.');
        return;
    }

    contenedor.innerHTML = mensajes
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .map(m => renderTarjetaMensaje(m, 'enviados'))
        .join('');

    contenedor.querySelectorAll('.mensaje-card').forEach(card => {
        card.addEventListener('click', () => abrirDetalle(card.dataset.id, usuario, false));
    });
}

async function abrirDetalle(id, usuario, puedeMarcarLeido = true) {
    const contenedor = document.getElementById('mensajeDetalle');
    if (!contenedor) return;
    contenedor.innerHTML = renderCargando();
    cambiarVista('detalle');

    const mensaje = await getMensajeById(id);
    if (!mensaje) return;

    if (puedeMarcarLeido && !mensaje.leido) {
        await marcarLeido(id);
        await refrescarBadge(usuario);
        const card = document.querySelector(`.mensaje-card[data-id="${id}"]`);
        if (card) card.classList.remove('no-leido');
    }

    const mostrarBotones = puedeAprobarMensaje(usuario, mensaje.de)
        && mensaje.estado !== 'aprobado'
        && mensaje.estado !== 'rechazado';

    const historial = await getHistorialFormateado(id);

    contenedor.innerHTML = `
        <div class="detalle-cabeza">
            <button class="btn-volver" id="btnVolver">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="15 18 9 12 15 6"/>
                </svg>
                Volver
            </button>
        </div>
        <div class="detalle-contenido">
            <div class="detalle-asunto">${mensaje.asunto}</div>
            <div class="detalle-meta">
                <div class="detalle-meta-fila">
                    <span class="detalle-meta-label">De</span>
                    <span class="detalle-meta-valor">${getNombreById(mensaje.de)}</span>
                </div>
                <div class="detalle-meta-fila">
                    <span class="detalle-meta-label">Para</span>
                    <span class="detalle-meta-valor">${getNombreById(mensaje.para)}</span>
                </div>
                <div class="detalle-meta-fila">
                    <span class="detalle-meta-label">Fecha</span>
                    <span class="detalle-meta-valor">${formatearFecha(mensaje.createdAt)}</span>
                </div>
                <div class="detalle-meta-fila">
                    <span class="detalle-meta-label">Estado</span>
                    <span id="estadoBadge">${renderBadge(mensaje.estado)}</span>
                </div>
            </div>
            <div class="detalle-cuerpo">${mensaje.cuerpo}</div>
            ${mensaje.adjuntos?.length > 0 ? `
                <div class="detalle-adjuntos">
                    <div class="detalle-adjuntos-label">Adjuntos</div>
                    <div class="lista-adjuntos">
                        ${mensaje.adjuntos.map(adj => `
                            <div class="adjunto-chip">
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                    <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"/>
                                </svg>
                                ${adj}
                            </div>
                        `).join('')}
                    </div>
                </div>
            ` : ''}
            ${mostrarBotones ? `
                <div class="detalle-acciones">
                    <button class="btn-aprobar" id="btnAprobar">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <polyline points="20 6 9 17 4 12"/>
                        </svg>
                        Aprobar
                    </button>
                    <button class="btn-rechazar" id="btnRechazar">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                        </svg>
                        Rechazar
                    </button>
                </div>
            ` : ''}
            ${historial.length > 0 ? `
                <div class="historial-lista">
                    <div class="historial-titulo">Historial de estados</div>
                    ${historial.map(e => `
                        <div class="historial-evento">
                            <span class="historial-autor">${e.autorNombre}</span>
                            <span class="historial-flecha">
                                ${renderBadge(e.estadoAntes)}
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <line x1="5" y1="12" x2="19" y2="12"/>
                                    <polyline points="12 5 19 12 12 19"/>
                                </svg>
                                ${renderBadge(e.estadoDespues)}
                            </span>
                            <span class="historial-fecha">${e.fechaFormateada}</span>
                        </div>
                        ${e.nota ? `<div class="historial-nota">"${e.nota}"</div>` : ''}
                    `).join('')}
                </div>
            ` : ''}
        </div>
    `;

    document.getElementById('btnVolver')
        ?.addEventListener('click', () => cambiarVista('inbox'));

    if (mostrarBotones) {
        document.getElementById('btnAprobar')
            ?.addEventListener('click', () => manejarAprobacion(id, usuario, 'aprobar'));
        document.getElementById('btnRechazar')
            ?.addEventListener('click', () => manejarAprobacion(id, usuario, 'rechazar'));
    }
}

async function manejarAprobacion(mensajeId, usuario, accion) {
    const btnAprobar  = document.getElementById('btnAprobar');
    const btnRechazar = document.getElementById('btnRechazar');
    if (btnAprobar)  btnAprobar.disabled  = true;
    if (btnRechazar) btnRechazar.disabled = true;

    const resultado = accion === 'aprobar'
        ? await aprobar(mensajeId)
        : await rechazar(mensajeId);

    if (!resultado) {
        if (btnAprobar) btnAprobar.disabled  = false;
        if (btnRechazar) btnRechazar.disabled = false;
        return;
    }

    await abrirDetalle(mensajeId, usuario, false);
}

function renderTarjetaMensaje(mensaje, tipo) {
    const esNoLeido = tipo === 'inbox' && !mensaje.leido;
    const nombre    = tipo === 'inbox'
        ? getNombreById(mensaje.de)
        : getNombreById(mensaje.para);
    const prefijo   = tipo === 'inbox' ? 'De' : 'Para';

    return `
        <div class="mensaje-card ${esNoLeido ? 'no-leido' : ''}" data-id="${mensaje._id}">
            <div class="card-avatar">${getIniciales(nombre)}</div>
            <div class="card-contenido">
                <div class="card-cabeza">
                    <span class="card-nombre">${prefijo}: ${nombre}</span>
                    <span class="card-fecha">${formatearFechaCorta(mensaje.createdAt)}</span>
                </div>
                <div class="card-asunto ${esNoLeido ? 'card-asunto-bold' : ''}">${mensaje.asunto}</div>
                <div class="card-preview">${mensaje.cuerpo.slice(0, 80)}${mensaje.cuerpo.length > 80 ? '...' : ''}</div>
            </div>
            ${esNoLeido ? '<div class="card-punto-nuevo"></div>' : ''}
            ${renderBadge(mensaje.estado)}
        </div>
    `;
}

function renderVacio(texto) {
    return `
        <div class="inbox-vacio">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="22 12 16 12 14 15 10 15 8 12 2 12"/>
                <path d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"/>
            </svg>
            <p>${texto}</p>
        </div>
    `;
}

function renderCargando() {
    return `<div class="inbox-vacio"><p>Cargando...</p></div>`;
}

function getIniciales(nombre) {
    return nombre.split(' ').map(p => p[0]).slice(0, 2).join('').toUpperCase();
}

function formatearFecha(fecha) {
    return new Date(fecha).toLocaleString('es-AR', {
        day: '2-digit', month: '2-digit', year: 'numeric',
        hour: '2-digit', minute: '2-digit'
    });
}

function formatearFechaCorta(fecha) {
    const diff = Date.now() - new Date(fecha).getTime();
    const minutos = Math.floor(diff / 60_000);
    const horas = Math.floor(diff / 3_600_000);
    const dias = Math.floor(diff / 86_400_000);
    if (minutos < 1) return 'Ahora';
    if (minutos < 60) return `${minutos}m`;
    if (horas < 24) return `${horas}h`;
    return `${dias}d`;
}

export async function refrescarInbox(usuario) {
    await renderBandeja(usuario);
    await renderEnviados(usuario);
}