// src/index.js
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
// Importar el pool de conexión (lo usaremos más adelante en las rutas)
// import pool from './config/db.js';

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

// Aquí irán las rutas de nuestros objetivos y tareas
// app.use('/api/objetivos', objetivoRoutes);
// app.use('/api/tareas', tareaRoutes);

app.listen(PORT, () => {
  console.log(`Servidor backend corriendo en http://localhost:${PORT}`);
});