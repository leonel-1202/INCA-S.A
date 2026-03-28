import mongoose from 'mongoose';

export async function conectarDB() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.info('[INCA DB] Conectado a MongoDB Atlas.');
    } catch (error) {
        console.error('[INCA DB] Error al conectar:', error.message);
        process.exit(1);
    }
}
