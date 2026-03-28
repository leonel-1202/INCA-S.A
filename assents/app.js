import { requiereAuth, getSesion, logout as logoutService } from './services/auth.service.js';
import { getUserById } from './data/users.js';
import { renderSidebar } from './components/sidebar.js';
import { renderInbox } from './components/inbox.js';
import { initCompose } from './components/compose.js';

export const App = {
    usuario: null,
    vista: 'inbox'
};

document.addEventListener('DOMContentLoaded', async () => {
    requiereAuth();
    await cargarUsuario();
    await inicializarUI();
});

async function cargarUsuario() {
    const sesion = getSesion();
    if (!sesion) return;
    const usuarioCompleto = getUserById(sesion.id);
    App.usuario = usuarioCompleto || sesion;
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
        detalle: 'Detalle de Mensaje'
    };
    const el = document.getElementById('vistaTitulo');
    if (el) el.textContent = titulos[App.vista] ?? 'Bandeja de Entrada';
}

export function cambiarVista(vista) {
    App.vista = vista;
    actualizarTitulo();
    actualizarTopIcon(vista);

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
        detalle: '📄'
    };
    const el = document.querySelector('.top-icon');
    if (el) el.textContent = iconos[vista] ?? '📥';
}

export function logout() {
    logoutService();
    window.location.href = 'index.html';
}