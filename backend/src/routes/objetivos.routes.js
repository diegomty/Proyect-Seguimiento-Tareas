import { Router } from 'express';
import {
    crearObjetivo,
    obtenerObjetivos,
    obtenerObjetivo,
    actualizarObjetivo,
    eliminarObjetivo
} from '../controllers/objetivos.controller.js';

const router = Router();

// Rutas para Objetivos
router.post('/objetivos', crearObjetivo);       // Crear un nuevo objetivo
router.get('/objetivos', obtenerObjetivos);     // Obtener todos los objetivos
router.get('/objetivos/:id', obtenerObjetivo);  // Obtener un objetivo por ID
router.put('/objetivos/:id', actualizarObjetivo); // Actualizar un objetivo por ID
router.delete('/objetivos/:id', eliminarObjetivo); // Eliminar un objetivo por ID

export default router;