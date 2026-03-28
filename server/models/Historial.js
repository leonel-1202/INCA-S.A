import mongoose from 'mongoose';

const HistorialSchema = new mongoose.Schema({
    mensajeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Mensaje', required: true },
    autorId: { type: String, required: true },
    estadoAntes: { type: String, required: true },
    estadoDespues: { type: String, required: true },
    nota: { type: String, default: '' }
}, { timestamps: true });

export default mongoose.model('Historial', HistorialSchema);