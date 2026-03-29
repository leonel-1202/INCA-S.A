export const USUARIOS = [
    {
        id: "presidente",
        nombre: "Presidente",
        area: "Dirección",
        cargo: "Presidente",
        rol: "autoridad",
        password: "inca_presidente",
        reportaA: null,
        canSendTo: ["*"],
        canApprove: true,
        canApproveFrom: [
            "asesoria-legal",
            "asesoria-comercial",
            "gerente-general",
            "gerente-sucursal"
        ],
        avatar: "P",
        colorRol: "var(--rol-autoridad)"
    },
    {
        id: "asesoria-legal",
        nombre: "Asesoría Legal",
        area: "Asesoría",
        cargo: "Asesor Legal",
        rol: "gerente",
        password: "inca_legal",
        reportaA: "presidente",
        canSendTo: ["presidente"],
        canApprove: false,
        canApproveFrom: [],
        avatar: "AL",
        colorRol: "var(--rol-gerente)"
    },
    {
        id: "asesoria-comercial",
        nombre: "Asesoría Comercial",
        area: "Asesoría",
        cargo: "Asesor Comercial",
        rol: "gerente",
        password: "inca_comercial",
        reportaA: "presidente",
        canSendTo: ["presidente"],
        canApprove: false,
        canApproveFrom: [],
        avatar: "AC",
        colorRol: "var(--rol-gerente)"
    },
    {
        id: "gerente-general",
        nombre: "Gerente General",
        area: "Gerencia",
        cargo: "Gerente General",
        rol: "gerente",
        password: "inca_general",
        reportaA: "presidente",
        canSendTo: [
            "presidente",
            "gerente-administrativo",
            "gerente-logistica",
            "sector-finanzas",
            "depto-compras"
        ],
        canApprove: true,
        canApproveFrom: [
            "gerente-administrativo",
            "gerente-logistica",
            "gerente-sucursal",
            "sector-finanzas",
            "depto-compras"
        ],
        avatar: "GG",
        colorRol: "var(--rol-gerente)"
    },
    {
        id: "gerente-administrativo",
        nombre: "Gerente Administrativo",
        area: "Administración",
        cargo: "Gerente Administrativo",
        rol: "gerente",
        password: "inca_administrativo",
        reportaA: "gerente-general",
        canSendTo: [
            "gerente-general",
            "sector-personal",
            "sector-finanzas",
            "depto-compras"
        ],
        canApprove: true,
        canApproveFrom: [
            "sector-personal",
            "sector-finanzas",
            "depto-compras"
        ],
        avatar: "GA",
        colorRol: "var(--rol-gerente)"
    },
    {
        id: "gerente-logistica",
        nombre: "Gerente de Logística y Operaciones",
        area: "Logística y Operaciones",
        cargo: "Gerente de Logística",
        rol: "gerente",
        password: "inca_logistica",
        reportaA: "gerente-general",
        canSendTo: [
            "gerente-general",
            "depto-compras",
            "ventas",
            "deposito"
        ],
        canApprove: true,
        canApproveFrom: [
            "depto-compras",
            "ventas",
            "deposito"
        ],
        avatar: "GL",
        colorRol: "var(--rol-gerente)"
    },
    {
        id: "sector-personal",
        nombre: "Sector de Personal",
        area: "Administración",
        cargo: "Sector Personal",
        rol: "operativo",
        password: "inca_personal",
        reportaA: "gerente-administrativo",
        canSendTo: [
            "gerente-administrativo",
            "sector-finanzas"
        ],
        canApprove: false,
        canApproveFrom: [],
        avatar: "SP",
        colorRol: "var(--rol-operativo)"
    },
    {
        id: "sector-finanzas",
        nombre: "Sector Financiero",
        area: "Finanzas",
        cargo: "Sector Financiero",
        rol: "operativo",
        password: "inca_finanzas",
        reportaA: "gerente-administrativo",
        canSendTo: [
            "gerente-administrativo",
            "gerente-general"
        ],
        canApprove: false,
        canApproveFrom: [],
        avatar: "SF",
        colorRol: "var(--rol-operativo)"
    },
    {
        id: "depto-compras",
        nombre: "Departamento de Compras",
        area: "Compras",
        cargo: "Departamento de Compras",
        rol: "operativo",
        password: "inca_compras",
        reportaA: "gerente-logistica",
        canSendTo: [
            "gerente-administrativo",
            "gerente-general",
            "sector-finanzas"
        ],
        canApprove: false,
        canApproveFrom: [],
        avatar: "DC",
        colorRol: "var(--rol-operativo)"
    },
    {
        id: "ventas",
        nombre: "Sector de Ventas",
        area: "Ventas",
        cargo: "Departamento de Ventas",
        rol: "operativo",
        password: "inca_ventas",
        reportaA: "gerente-logistica",
        canSendTo: [
            "gerente-logistica",
            "deposito"
        ],
        canApprove: false,
        canApproveFrom: [],
        avatar: "SV",
        colorRol: "var(--rol-operativo)"
    },
    {
        id: "deposito",
        nombre: "Sector de Depósito",
        area: "Depósito",
        cargo: "Sector de Depósito",
        rol: "operativo",
        password: "inca_deposito",
        reportaA: "gerente-logistica",
        canSendTo: [
            "gerente-logistica",
            "ventas"
        ],
        canApprove: false,
        canApproveFrom: [],
        avatar: "SD",
        colorRol: "var(--rol-operativo)"
    },
    {
        id: "admin-sucursal",
        nombre: "Administración de Sucursal",
        area: "Sucursal",
        cargo: "Administración de Sucursal",
        rol: "operativo",
        password: "inca_sucursal",
        reportaA: "gerente-sucursal",
        canSendTo: [
            "gerente-sucursal",
            "sector-finanzas"
        ],
        canApprove: false,
        canApproveFrom: [],
        avatar: "AS",
        colorRol: "var(--rol-operativo)"
    },
    {
        id: "gerente-sucursal",
        nombre: "Gerente de Sucursal",
        area: "Sucursal",
        cargo: "Gerente de Sucursal",
        rol: "gerente",
        password: "inca_sucursal",
        reportaA: "gerente-general",
        canSendTo: [
            "gerente-general",
            "presidente",
            "sector-finanzas"
        ],
        canApprove: true,
        canApproveFrom: [
            "admin-sucursal"
        ],
        avatar: "GS",
        colorRol: "var(--rol-gerente)"
    }
];

export const EXTERNOS = [
    { id: "afip",nombre: "AFIP",avatar: "AF" },
    { id: "anses",nombre: "ANSES",avatar: "AN" },
    { id: "printergraf", nombre: "PrinterGraf", avatar: "PG" },
    { id: "porvenir-sa", nombre: "Porvenir SA", avatar: "PS" }
];

export function getUserById(id) {
    return USUARIOS.find(u => u.id === id) ?? null;
}

export function getDestinatariosValidos(usuario) {
    if (usuario.canSendTo.includes("*")) {
        return USUARIOS.filter(u => u.id !== usuario.id);
    }
    return usuario.canSendTo
        .map(id => getUserById(id))
        .filter(Boolean);
}

export function getNombreById(id) {
    const interno = getUserById(id);
    if (interno) return interno.nombre;
    const externo = EXTERNOS.find(e => e.id === id);
    if (externo) return externo.nombre;
    return id;
}

export function puedeAprobarMensaje(usuario, remitenteId) {
    if (!usuario.canApprove) return false;
    return usuario.canApproveFrom?.includes(remitenteId) ?? false;
}