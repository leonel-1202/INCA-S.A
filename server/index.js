import 'dotenv/config';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { conectarDB } from './config/db.js';
import authRoutes from './routes/auth.routes.js';
import mensajeRoutes from './routes/mensaje.routes.js';
import documentoRoutes from './routes/documento.routes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use(express.static(path.join(__dirname, '..')));

app.use('/api/auth', authRoutes);
app.use('/api/mensajes', mensajeRoutes);
app.use('/api/documentos', documentoRoutes);

app.get('/{*splat}', (req, res) => {
    if (!req.path.startsWith('/api')) {
        res.sendFile(path.join(__dirname, '..', 'index.html'));
    }
});

conectarDB().then(() => {
    app.listen(PORT, () => {
        console.info(`[INCA Server] Corriendo en http://localhost:${PORT}`);
    });
});