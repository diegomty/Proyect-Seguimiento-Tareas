import { Router } from 'express';
import {
    crearTarea,
    obtenerTareasPorObjetivo,
    obtenerTarea,
    actualizarTarea,
    eliminarTarea
} from '../controllers/tareas.controller.js';

const router = Router();

// Crear una nueva tarea para un objetivo específico
router.post('/objetivos/:id_objetivo/tareas', crearTarea);

// Obtener todas las tareas de un objetivo específico
router.get('/objetivos/:id_objetivo/tareas', obtenerTareasPorObjetivo);

// Rutas para operar sobre una tarea específica por su ID
router.get('/tareas/:id_tarea', obtenerTarea);       
router.put('/tareas/:id_tarea', actualizarTarea);   
router.delete('/tareas/:id_tarea', eliminarTarea); 

export default router;