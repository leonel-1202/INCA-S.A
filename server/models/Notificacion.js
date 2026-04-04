import mongoose from 'mongoose';

const NotificacionSchema = new mongoose.Schema({
    para: { type: String, required: true },
    de: { type: String, required: true },
    mensajeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Mensaje', required: true },
    asunto: { type: String, required: true },
    tipo: { type: String, enum: ['aprobado', 'rechazado'], required: true },
    leida: { type: Boolean, default: false }
}, { timestamps: true });

export default mongoose.model('Notificacion', NotificacionSchema);