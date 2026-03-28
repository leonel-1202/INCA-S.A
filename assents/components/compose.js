import { getDestinatariosValidos } from '../data/users.js';
import { enviar } from '../services/message.service.js';
import { refrescarInbox } from './inbox.js';
import { refrescarBadge } from './sidebar.js';

let adjuntosSeleccionados = [];
let usuarioActual = null;

export function initCompose(usuario) {
    usuarioActual = usuario;
    poblarDestinatarios(usuario);
    bindEventos(usuario);
}

function poblarDestinatarios(usuario) {
    const select = document.getElementById('msgPara');
    if (!select) return;

    const destinatarios = getDestinatariosValidos(usuario);
    while (select.options.length > 1) select.remove(1);

    destinatarios.forEach(dest => {
        const opt = document.createElement('option');
        opt.value = dest.id;
        opt.textContent = `${dest.nombre} — ${dest.area}`;
        select.appendChild(opt);
    });
}

function bindEventos(usuario) {
    const btnRedactar = document.getElementById('btnRedactar');
    if (btnRedactar) btnRedactar.addEventListener('click', abrirModal);

    const btnCerrar = document.getElementById('modalCerrar');
    const btnCancelar = document.getElementById('btnCancelar');
    const overlay = document.getElementById('modalOverlay');

    if (btnCerrar) btnCerrar.addEventListener('click', cerrarModal);
    if (btnCancelar) btnCancelar.addEventListener('click', cerrarModal);

    if (overlay) {
        overlay.addEventListener('click', e => {
            if (e.target === overlay) cerrarModal();
        });
    }

    const adjuntoArea  = document.getElementById('adjuntoArea');
    const inputAdjunto = document.getElementById('msgAdjunto');

    if (adjuntoArea && inputAdjunto) {
        adjuntoArea.addEventListener('click', () => inputAdjunto.click());
        inputAdjunto.addEventListener('change', manejarAdjuntos);
    }

    const form = document.getElementById('formRedactar');
    if (form) {
        form.addEventListener('submit', e => {
            e.preventDefault();
            enviarMensaje(usuario);
        });
    }

    document.getElementById('msgPara')?.addEventListener('change', ocultarError);
    document.getElementById('msgAsunto')?.addEventListener('input', ocultarError);
    document.getElementById('msgContenido')?.addEventListener('input', ocultarError);
}

function abrirModal() {
    const overlay = document.getElementById('modalOverlay');
    if (overlay) overlay.hidden = false;
    limpiarForm();
}

function cerrarModal() {
    const overlay = document.getElementById('modalOverlay');
    if (overlay) overlay.hidden = true;
    limpiarForm();
}

function limpiarForm() {
    const form = document.getElementById('formRedactar');
    if (form) form.reset();
    adjuntosSeleccionados = [];
    const lista = document.getElementById('adjuntosLista');
    if (lista) lista.innerHTML = '';
    ocultarError();
}

function manejarAdjuntos(e) {
    const archivos = Array.from(e.target.files);
    adjuntosSeleccionados = archivos.map(f => f.name);

    const lista = document.getElementById('adjuntosLista');
    if (!lista) return;

    lista.innerHTML = adjuntosSeleccionados.map(nombre => `
        <div class="adjunto-chip">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"/>
            </svg>
            ${nombre}
        </div>
    `).join('');
}

async function enviarMensaje(usuario) {
    const para = document.getElementById('msgPara')?.value.trim();
    const asunto = document.getElementById('msgAsunto')?.value.trim();
    const contenido = document.getElementById('msgContenido')?.value.trim();

    if (!para) { mostrarError('Seleccioná un destinatario.'); return; }
    if (!asunto) { mostrarError('Ingresá un asunto.'); return; }
    if (!contenido){ mostrarError('Escribí el contenido del mensaje.'); return; }

    const btnEnviar = document.getElementById('btnEnviar');
    if (btnEnviar) { btnEnviar.disabled = true; btnEnviar.textContent = 'Enviando...'; }

    const resultado = await enviar({
        para,
        asunto,
        cuerpo:   contenido,
        adjuntos: adjuntosSeleccionados
    });

    if (btnEnviar) { btnEnviar.disabled = false; btnEnviar.textContent = 'Enviar mensaje'; }

    if (!resultado) {
        mostrarError('Error al enviar el mensaje. Intenta de nuevo.');
        return;
    }

    cerrarModal();
    await refrescarInbox(usuario);
    await refrescarBadge(usuario);

    console.info(`[INCA Compose] Mensaje enviado a ${para}.`);
}

function mostrarError(msg) {
    const errorBox  = document.getElementById('modalError');
    const errorText = document.getElementById('modalErrorText');
    if (errorBox)  errorBox.hidden = false;
    if (errorText) errorText.textContent = msg;
}

function ocultarError() {
    const errorBox = document.getElementById('modalError');
    if (errorBox) errorBox.hidden = true;
}