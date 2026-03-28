import mongoose from 'mongoose';

const UsuarioSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    nombre: { type: String, required: true },
    area: { type: String, required: true },
    cargo: { type: String, required: true },
    rol: { type: String, enum: ['autoridad', 'gerente', 'operativo'], required: true },
    password: { type: String, required: true },
    reportaA: { type: String, default: null },
    canSendTo: { type: [String], default: [] },
    canApprove: { type: Boolean, default: false },
    avatar: { type: String, required: true },
    colorRol: { type: String, required: true }
}, { timestamps: true });

export default mongoose.model('Usuario', UsuarioSchema);
