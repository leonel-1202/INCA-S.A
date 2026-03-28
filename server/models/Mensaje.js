import mongoose from 'mongoose';

const MensajeSchema = new mongoose.Schema({
    de: { type: String, required: true },
    para: { type: String, required: true },
    asunto: { type: String, required: true },
    cuerpo: { type: String, required: true },
    adjuntos: { type: [String], default: [] },
    estado: { type: String, enum: ['recibido', 'leido', 'aprobado', 'rechazado', 'pendiente'], default: 'recibido' },
    leido: { type: Boolean, default: false }
}, { timestamps: true });

export default mongoose.model('Mensaje', MensajeSchema);
