import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import objetivoRoutes from './routes/objetivos.routes.js';
import tareaRoutes from './routes/tareas.routes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middlewares
app.use(cors()); // Habilita CORS para todas las rutas
app.use(express.json()); // Permite al servidor entender JSON en las solicitudes

// Ruta de prueba
app.get('/', (req, res) => {
  res.send('API de Seguimiento de Tareas está funcionando!');
});

//Rutas de la API
app.use('/api', objetivoRoutes);
app.use('/api', tareaRoutes);

app.listen(PORT, () => {
  console.log(`Servidor backend corriendo en http://localhost:${PORT}`);
});