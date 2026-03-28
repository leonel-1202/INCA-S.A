import './env.js';
import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import Usuario from './models/Usuario.js';
import Mensaje from './models/Mensaje.js';

const USUARIOS = [
    { id: "presidente", nombre: "Presidente", area: "Dirección", cargo: "Presidente", rol: "autoridad", password: "inca_presidente", reportaA: null, canSendTo: ["*"], canApprove: true, avatar: "P", colorRol: "var(--rol-autoridad)" },
    { id: "asesoria-legal", nombre: "Asesoría Legal", area: "Asesoría", cargo: "Asesor Legal", rol: "gerente", password: "inca_legal", reportaA: "presidente", canSendTo: ["presidente"], canApprove: false, avatar: "AL", colorRol: "var(--rol-gerente)" },
    { id: "asesoria-comercial", nombre: "Asesoría Comercial", area: "Asesoría", cargo: "Asesor Comercial", rol: "gerente", password: "inca_comercial", reportaA: "presidente", canSendTo: ["presidente"], canApprove: false, avatar: "AC", colorRol: "var(--rol-gerente)" },
    { id: "gerente-general", nombre: "Gerente General", area: "Gerencia", cargo: "Gerente General", rol: "gerente", password: "inca_general", reportaA: "presidente", canSendTo: ["presidente","gerente-administrativo","gerente-logistica","sector-finanzas","depto-compras"], canApprove: false, avatar: "GG", colorRol: "var(--rol-gerente)" },
    { id: "gerente-administrativo", nombre: "Gerente Administrativo", area: "Administración", cargo: "Gerente Administrativo", rol: "gerente", password: "inca_administrativo", reportaA: "gerente-general", canSendTo: ["gerente-general","sector-personal","sector-finanzas","depto-compras"], canApprove: false, avatar: "GA", colorRol: "var(--rol-gerente)" },
    { id: "gerente-logistica", nombre: "Gerente de Logística y Operaciones",area: "Logística y Operaciones", cargo: "Gerente de Logística", rol: "gerente", password: "inca_logistica", reportaA: "gerente-general", canSendTo: ["gerente-general","depto-compras","ventas","deposito"], canApprove: false, avatar: "GL", colorRol: "var(--rol-gerente)" },
    { id: "sector-personal", nombre: "Sector de Personal", area: "Administración", cargo: "Sector Personal", rol: "operativo", password: "inca_personal", reportaA: "gerente-administrativo",canSendTo: ["gerente-administrativo","sector-finanzas"], canApprove: false, avatar: "SP", colorRol: "var(--rol-operativo)" },
    { id: "sector-finanzas", nombre: "Sector Financiero", area: "Finanzas", cargo: "Sector Financiero", rol: "operativo", password: "inca_finanzas", reportaA: "gerente-administrativo",canSendTo: ["gerente-administrativo","gerente-general"], canApprove: false, avatar: "SF", colorRol: "var(--rol-operativo)" },
    { id: "depto-compras", nombre: "Departamento de Compras", area: "Compras", cargo: "Departamento de Compras", rol: "operativo", password: "inca_compras", reportaA: "gerente-logistica", canSendTo: ["gerente-administrativo","gerente-general","sector-finanzas"], canApprove: false, avatar: "DC", colorRol: "var(--rol-operativo)" },
    { id: "ventas", nombre: "Sector de Ventas", area: "Ventas", cargo: "Departamento de Ventas", rol: "operativo", password: "inca_ventas", reportaA: "gerente-logistica", canSendTo: ["gerente-logistica","deposito"], canApprove: false, avatar: "SV", colorRol: "var(--rol-operativo)" },
    { id: "deposito", nombre: "Sector de Depósito", area: "Depósito", cargo: "Sector de Depósito", rol: "operativo", password: "inca_deposito", reportaA: "gerente-logistica", canSendTo: ["gerente-logistica","ventas"], canApprove: false, avatar: "SD", colorRol: "var(--rol-operativo)" },
    { id: "admin-sucursal", nombre: "Administración de Sucursal", area: "Sucursal", cargo: "Administración de Sucursal", rol: "operativo", password: "inca_sucursal", reportaA: "gerente-sucursal", canSendTo: ["gerente-sucursal","sector-finanzas"], canApprove: false, avatar: "AS", colorRol: "var(--rol-operativo)" },
    { id: "gerente-sucursal", nombre: "Gerente de Sucursal", area: "Sucursal", cargo: "Gerente de Sucursal", rol: "gerente", password: "inca_gsucursal", reportaA: "gerente-general", canSendTo: ["gerente-general","presidente","sector-finanzas"], canApprove: false, avatar: "GS", colorRol: "var(--rol-gerente)" },
];

const MENSAJES_SEED = [
    { de: 'gerente-general', para: 'gerente-logistica', asunto: 'Normas para el boletín de ofertas', cuerpo: 'Les envío las normas actualizadas para la confección del próximo boletín de ofertas. Por favor revisar el adjunto y confirmar recepción.', adjuntos: ['normas_boletin_v3.pdf'], estado: 'leido', leido: true  },
    { de: 'sector-personal', para: 'sector-finanzas', asunto: 'Liquidación de sueldos — Marzo 2025', cuerpo: 'Adjunto la liquidación de sueldos del mes de marzo para su procesamiento y depósito correspondiente.', adjuntos: ['liquidacion_marzo_2025.xlsx'], estado: 'recibido', leido: false },
    { de: 'gerente-sucursal', para: 'presidente', asunto: 'Presupuesto trimestral — Sucursal Norte', cuerpo: 'Envío el presupuesto del próximo trimestre para aprobación de Casa Central. Quedamos a disposición para cualquier consulta.', adjuntos: ['presupuesto_q2_sucursal_norte.pdf'], estado: 'pendiente',leido: false },
    { de: 'depto-compras', para: 'sector-finanzas', asunto: 'Documentación de proveedores — Licitación #2025-04', cuerpo: 'Se adjunta la documentación correspondiente a la licitación de mercadería #2025-04 para su registro y procesamiento.', adjuntos: ['licitacion_2025_04.pdf','facturas_proveedores.zip'], estado: 'recibido', leido: false },
    { de: 'sector-finanzas', para: 'gerente-general', asunto: 'Informe de flujo de dinero — Semana 12', cuerpo: 'Adjunto el informe de flujo de dinero correspondiente a la semana 12. Se destacan variaciones en los depósitos de sucursales.', adjuntos: ['flujo_semana_12.pdf'], estado: 'recibido', leido: false },
];

async function seed() {
    await mongoose.connect(process.env.MONGODB_URI);
    console.info('[Seed] Conectado a MongoDB.');

    await Usuario.deleteMany({});
    await Mensaje.deleteMany({});
    console.info('[Seed] Colecciones limpiadas.');

    for (const u of USUARIOS) {
        const hash = await bcrypt.hash(u.password, 10);
        await Usuario.create({ ...u, password: hash });
    }
    console.info(`[Seed] ${USUARIOS.length} usuarios insertados.`);

    await Mensaje.insertMany(MENSAJES_SEED);
    console.info(`[Seed] ${MENSAJES_SEED.length} mensajes insertados.`);

    await mongoose.disconnect();
    console.info('[Seed] Listo. Desconectado.');
}

seed().catch(err => {
    console.error('[Seed] Error:', err);
    process.exit(1);
});