import axios from 'axios';

const API_BASE_URL = 'http://localhost:3001/api';

// Crear una instancia de Axios con la URL base
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// --- Funciones para Objetivos ---

/**
 * Obtiene todos los objetivos.
 * @returns {Promise<Array>} Una promesa que resuelve a un array de objetivos.
 */
export const obtenerTodosLosObjetivos = async () => {
  try {
    const response = await apiClient.get('/objetivos');
    return response.data;
  } catch (error) {
    console.error('Error al obtener objetivos:', error);
  
    throw error;
  }
};

/**
 * Crea un nuevo objetivo.
 * @param {Object} objetivoData - Datos del objetivo a crear ({ nombre_objetivo, fecha_inicio, fecha_planeada_final }).
 * @returns {Promise<Object>} Una promesa que resuelve al objetivo creado.
 */
export const crearNuevoObjetivo = async (objetivoData) => {
  try {
    const response = await apiClient.post('/objetivos', objetivoData);
    return response.data;
  } catch (error) {
    console.error('Error al crear objetivo:', error);
    throw error;
  }
};

/**
 * Obtiene un objetivo por su ID.
 * @param {string|number} id - El ID del objetivo.
 * @returns {Promise<Object>} Una promesa que resuelve al objetivo encontrado.
 */
export const obtenerObjetivoPorId = async (id) => {
  try {
    const response = await apiClient.get(`/objetivos/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error al obtener objetivo con ID ${id}:`, error);
    throw error;
  }
};

/**
 * Actualiza un objetivo existente.
 * @param {string|number} id - El ID del objetivo a actualizar.
 * @param {Object} objetivoData - Datos del objetivo a actualizar.
 * @returns {Promise<Object>} Una promesa que resuelve al objetivo actualizado.
 */
export const actualizarObjetivoExistente = async (id, objetivoData) => {
  try {
    const response = await apiClient.put(`/objetivos/${id}`, objetivoData);
    return response.data;
  } catch (error) {
    console.error(`Error al actualizar objetivo con ID ${id}:`, error);
    throw error;
  }
};

/**
 * Elimina un objetivo por su ID.
 * @param {string|number} id - El ID del objetivo a eliminar.
 * @returns {Promise<void>}
 */
export const eliminarObjetivoPorId = async (id) => {
  try {
    await apiClient.delete(`/objetivos/${id}`);
  } catch (error) {
    console.error(`Error al eliminar objetivo con ID ${id}:`, error);
    throw error;
  }
};

// --- Funciones para Tareas ---

/**
 * Obtiene todas las tareas de un objetivo específico.
 * @param {string|number} idObjetivo - El ID del objetivo.
 * @returns {Promise<Array>} Una promesa que resuelve a un array de tareas.
 */
export const obtenerTareasDelObjetivo = async (idObjetivo) => {
  try {
    const response = await apiClient.get(`/objetivos/${idObjetivo}/tareas`);
    return response.data;
  } catch (error) {
    console.error(`Error al obtener tareas para el objetivo ${idObjetivo}:`, error);
    throw error;
  }
};

/**
 * Elimina una tarea por su ID.
 * @param {string|number} idTarea - El ID de la tarea a eliminar.
 * @returns {Promise<void>}
 */
export const eliminarTareaPorId = async (idTarea) => {
  try {
    await apiClient.delete(`/tareas/${idTarea}`);
  } catch (error) {
    console.error(`Error al eliminar tarea ${idTarea}:`, error);
    throw error;
  }
};

/**
 * Actualiza una tarea existente.
 * @param {string|number} idTarea - El ID de la tarea a actualizar.
 * @param {Object} tareaData - Datos de la tarea a actualizar (puede ser un objeto parcial, ej. { completada: true }).
 * @returns {Promise<Object>} Una promesa que resuelve a la tarea actualizada.
 */
export const actualizarTareaExistente = async (idTarea, tareaData) => {
  try {
    const response = await apiClient.put(`/tareas/${idTarea}`, tareaData);
    return response.data;
  } catch (error) {
    console.error(`Error al actualizar tarea ${idTarea}:`, error);
    throw error;
  }
};

/**
 * Crea una nueva tarea para un objetivo específico.
 * @param {string|number} idObjetivo - El ID del objetivo al que pertenece la tarea.
 * @param {Object} tareaData - Datos de la tarea a crear ({ titulo, descripcion }).
 * @returns {Promise<Object>} Una promesa que resuelve a la tarea creada.
 */
export const crearNuevaTarea = async (idObjetivo, tareaData) => {
  try {
    const response = await apiClient.post(`/objetivos/${idObjetivo}/tareas`, tareaData);
    return response.data;
  } catch (error) {
    console.error(`Error al crear tarea para el objetivo ${idObjetivo}:`, error);
    throw error;
  }
};
