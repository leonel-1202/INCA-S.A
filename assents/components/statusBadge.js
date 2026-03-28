const ESTADOS = {
    recibido: {
        label: 'Recibido',
        clase: 'estado-recibido',
        color: 'var(--status-received)'
    },
    leido: {
        label: 'Leído',
        clase: 'estado-leido',
        color: 'var(--status-read)'
    },
    pendiente: {
        label: 'Pendiente',
        clase: 'estado-pendiente',
        color: 'var(--status-pending)'
    },
    aprobado: {
        label: 'Aprobado',
        clase: 'estado-aprobado',
        color: 'var(--status-approved)'
    },
    rechazado: {
        label: 'Rechazado',
        clase: 'estado-rechazado',
        color: 'var(--status-rejected)'
    }
};

export function renderBadge(estado) {
    const config = ESTADOS[estado];

    if (!config) {
        return `<span class="estado-badge estado-desconocido">${estado}</span>`;
    }

    return `<span class="estado-badge ${config.clase}">${config.label}</span>`;
}

export function getLabel(estado) {
    return ESTADOS[estado]?.label ?? estado;
}

export function getColor(estado) {
    return ESTADOS[estado]?.color ?? 'var(--text-muted)';
}

export function getClase(estado) {
    return ESTADOS[estado]?.clase ?? 'estado-desconocido';
}

export function actualizarBadgeEnDOM(elemento, nuevoEstado) {
    const badgeActual = elemento.querySelector('.estado-badge');
    if (!badgeActual) return;

    const config = ESTADOS[nuevoEstado];
    if (!config) return;

    Object.values(ESTADOS).forEach(e => {
        badgeActual.classList.remove(e.clase);
    });

    badgeActual.classList.add(config.clase);
    badgeActual.textContent = config.label;
}

export function getEstadosDisponibles() {
    return Object.entries(ESTADOS).map(([valor, config]) => ({
        valor,
        label: config.label,
        color: config.color
    }));
}