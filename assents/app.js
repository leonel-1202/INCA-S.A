import { requiereAuth, getSesion, logout as logoutService } from './services/auth.service.js';
import { renderSidebar } from './components/sidebar.js';
import { renderInbox } from './components/inbox.js';
import { initCompose } from './components/compose.js';

export const App = {
    usuario: null,
    vista: 'inbox'
};

document.addEventListener('DOMContentLoaded', async () => {
    requiereAuth();
    cargarUsuario();
    await inicializarUI();
});

function cargarUsuario() {
    const sesion = getSesion();
    if (!sesion) return;
    App.usuario = sesion;
}

async function inicializarUI() {
    renderSidebar(App.usuario);
    await renderInbox(App.usuario);
    initCompose(App.usuario);
    actualizarTitulo();
}

function actualizarTitulo() {
    const titulos = {
        inbox: 'Bandeja de Entrada',
        enviados: 'Enviados',
        detalle: 'Detalle de Mensaje',
        llamada: 'Videollamada'
    };
    const el = document.getElementById('vistaTitulo');
    if (el) el.textContent = titulos[App.vista] ?? 'Bandeja de Entrada';
}

export function cambiarVista(vista) {
    App.vista = vista;
    actualizarTitulo();
    actualizarTopIcon(vista);
    actualizarFiltros(vista);

    document.querySelectorAll('.vista-seccion').forEach(sec => {
        sec.hidden = true;
    });

    const seccion = document.getElementById(`vista-${vista}`);
    if (seccion) seccion.hidden = false;

    document.querySelectorAll('.sidebar-item').forEach(item => {
        item.classList.toggle('activo', item.dataset.vista === vista);
    });
}

function actualizarTopIcon(vista) {
    const iconos = {
        inbox: '📥',
        enviados: '📤',
        detalle: '📄',
        llamada: '📹'
    };
    const el = document.querySelector('.top-icon');
    if (el) el.textContent = iconos[vista] ?? '📥';
}

function actualizarFiltros(vista) {
    const filtros = document.getElementById('filtrosGrupo');
    if (filtros) filtros.hidden = vista !== 'inbox';
}

export function logout() {
    logoutService();
    window.location.href = 'index.html';
}