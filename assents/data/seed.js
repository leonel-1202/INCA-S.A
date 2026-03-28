import { USUARIOS } from './users.js';

export const KEYS = {
    Mensaje: 'inca_mensaje',
    Sesion: 'inca_sesion',
    Inicializacion: 'inca_inicializado'
};

const Mensaje_Seed = [
    {
        id: 'msg_001',
        de: 'gerente-general',
        para: 'gerente-logistica',
        asunto: 'Normas para el boletín de ofertas',
        cuerpo: 'Les envío las normas actualizadas para la confección del próximo boletín de ofertas. Por favor revisar el adjunto y confirmar recepción.',
        adjuntos: ['normas_boletin_v3.pdf'],
        timestamp: Date.now() - 1000 * 60 * 60 * 24 * 2,
        estado: 'leido',
        leido: true
    },
    
    {
        id: 'msg_002',
        de: 'sector-personal',
        para: 'sector-finanzas',
        asunto: 'Liquidación de sueldos — Marzo 2025',
        cuerpo: 'Adjunto la liquidación de sueldos del mes de marzo para su procesamiento y depósito correspondiente.',
        adjuntos: ['liquidacion_marzo_2025.xlsx'],
        timestamp: Date.now() - 1000 * 60 * 60 * 24,
        estado: 'recibido',
        leido: false
    },

    {
        id: 'msg_003',
        de: 'gerente-sucursal',
        para: 'presidente',
        asunto: 'Presupuesto trimestral — Sucursal Norte',
        cuerpo: 'Envío el presupuesto del próximo trimestre para aprobación de Casa Central. Quedamos a disposición para cualquier consulta.',
        adjuntos: ['presupuesto_q2_sucursal_norte.pdf'],
        timestamp: Date.now() - 1000 * 60 * 60 * 5,
        estado: 'pendiente',
        leido: false
    },

    {
        id: 'msg_004',
        de: 'depto-compras',
        para: 'sector-finanzas',
        asunto: 'Documentación de proveedores — Licitación #2025-04',
        cuerpo: 'Se adjunta la documentación correspondiente a la licitación de mercadería #2025-04 para su registro y procesamiento.',
        adjuntos: ['licitacion_2025_04.pdf', 'facturas_proveedores.zip'],
        timestamp: Date.now() - 1000 * 60 * 30,
        estado: 'recibido',
        leido: false
    },

    {
        id: 'msg_005',
        de: 'sector-finanzas',
        para: 'gerente-general',
        asunto: 'Informe de flujo de dinero — Semana 12',
        cuerpo: 'Adjunto el informe de flujo de dinero correspondiente a la semana 12. Se destacan variaciones en los depósitos de sucursales.',
        adjuntos: ['flujo_semana_12.pdf'],
        timestamp: Date.now() - 1000 * 60 * 10,
        estado: 'recibido',
        leido: false
    }
];

export function inicializar() {
    if (localStorage.getItem(KEYS.Inicializacion)) return;

    localStorage.setItem(KEYS.Mensaje, JSON.stringify(Mensaje_Seed));
    localStorage.setItem(KEYS.Inicializacion, 'true');

    console.info('[INCA Seed] Sistema inicializado.');
}

export function resetearSistema() {
    localStorage.removeItem(KEYS.Inicializacion);
    localStorage.removeItem(KEYS.Mensaje);
    localStorage.removeItem(KEYS.Sesion);
    inicializar();
    console.warn('[INCA Seed] Sistema reestablecido a estado inicial.');
}