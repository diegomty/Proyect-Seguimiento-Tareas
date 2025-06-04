// src/controllers/tareas.controller.js
import pool from '../config/db.js';

// Helper simple para asegurar que 'completada' sea booleano en la respuesta
const mapTareaResponse = (tarea) => {
    if (!tarea) return null;
    return {
        ...tarea,
        completada: Boolean(tarea.completada) // MySQL devuelve 0 o 1 para BOOLEAN
    };
};

// Crear una nueva tarea asociada a un objetivo
export const crearTarea = async (req, res) => {
    const { id_objetivo } = req.params;
    const { titulo, descripcion } = req.body;

    if (!titulo) {
        return res.status(400).json({ message: 'El título de la tarea es requerido.' });
    }

    try {
        const [objetivoRows] = await pool.query('SELECT id_objetivo FROM objetivos WHERE id_objetivo = ?', [id_objetivo]);
        if (objetivoRows.length === 0) {
            return res.status(404).json({ message: 'Objetivo no encontrado. No se puede crear la tarea.' });
        }

        const [result] = await pool.query(
            'INSERT INTO tareas (id_objetivo, titulo, descripcion, completada) VALUES (?, ?, ?, ?)',
            [id_objetivo, titulo, descripcion || null, false] // 'completada' por defecto es false
        );

        const insertId = result.insertId;
        const [rows] = await pool.query('SELECT * FROM tareas WHERE id_tarea = ?', [insertId]);
            
        res.status(201).json(mapTareaResponse(rows[0]));

    } catch (error) {
        console.error('Error al crear tarea:', error);
        res.status(500).json({ message: 'Error interno del servidor al crear la tarea.' });
    }
};

// Obtener todas las tareas de un objetivo específico
export const obtenerTareasPorObjetivo = async (req, res) => {
    const { id_objetivo } = req.params;
    try {
        const [objetivoRows] = await pool.query('SELECT id_objetivo FROM objetivos WHERE id_objetivo = ?', [id_objetivo]);
        if (objetivoRows.length === 0) {
            return res.status(404).json({ message: 'Objetivo no encontrado.' });
        }

        const [rows] = await pool.query('SELECT * FROM tareas WHERE id_objetivo = ? ORDER BY fecha_creacion DESC', [id_objetivo]);
        res.status(200).json(rows.map(mapTareaResponse));
    } catch (error)
        {
        console.error('Error al obtener tareas por objetivo:', error);
        res.status(500).json({ message: 'Error interno del servidor al obtener las tareas.' });
    }
};

// Obtener una tarea específica por su ID
export const obtenerTarea = async (req, res) => {
    const { id_tarea } = req.params;
    try {
        const [rows] = await pool.query('SELECT * FROM tareas WHERE id_tarea = ?', [id_tarea]);
        if (rows.length <= 0) {
            return res.status(404).json({ message: 'Tarea no encontrada.' });
        }
        res.status(200).json(mapTareaResponse(rows[0]));
    } catch (error) {
        console.error('Error al obtener tarea:', error);
        res.status(500).json({ message: 'Error interno del servidor al obtener la tarea.' });
    }
};

// Actualizar una tarea (título, descripción, completada)
export const actualizarTarea = async (req, res) => {
    const { id_tarea } = req.params;
    const { titulo, descripcion, completada } = req.body;

    if (titulo === undefined && descripcion === undefined && completada === undefined) {
        return res.status(400).json({ message: 'Se requiere al menos un campo para actualizar (titulo, descripcion, completada).' });
    }
    
    if (titulo !== undefined && titulo.trim() === '') {
        return res.status(400).json({ message: 'El título no puede ser vacío.' });
    }

    try {
        const [existingTareaRows] = await pool.query('SELECT * FROM tareas WHERE id_tarea = ?', [id_tarea]);
        if (existingTareaRows.length === 0) {
            return res.status(404).json({ message: 'Tarea no encontrada.' });
        }
        const existingTarea = existingTareaRows[0];

        const finalTitulo = titulo !== undefined ? titulo : existingTarea.titulo;
        const finalDescripcion = descripcion !== undefined ? descripcion : existingTarea.descripcion;
        const finalCompletada = completada !== undefined ? Boolean(completada) : Boolean(existingTarea.completada);

        const [result] = await pool.query(
            'UPDATE tareas SET titulo = ?, descripcion = ?, completada = ? WHERE id_tarea = ?',
            [finalTitulo, finalDescripcion, finalCompletada, id_tarea]
        );
        
        if (result.affectedRows === 0 && result.changedRows === 0) {
             const [updatedRowsUnchanged] = await pool.query('SELECT * FROM tareas WHERE id_tarea = ?', [id_tarea]);
             return res.status(200).json(mapTareaResponse(updatedRowsUnchanged[0]));
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Tarea no encontrada durante la actualización.' });
        }

        const [updatedRows] = await pool.query('SELECT * FROM tareas WHERE id_tarea = ?', [id_tarea]);
        res.status(200).json(mapTareaResponse(updatedRows[0]));

    } catch (error) {
        console.error('Error al actualizar tarea:', error);
        res.status(500).json({ message: 'Error interno del servidor al actualizar la tarea.' });
    }
};

// Eliminar una tarea
export const eliminarTarea = async (req, res) => {
    const { id_tarea } = req.params;
    try {
        const [result] = await pool.query('DELETE FROM tareas WHERE id_tarea = ?', [id_tarea]);
        if (result.affectedRows <= 0) {
            return res.status(404).json({ message: 'Tarea no encontrada.' });
        }
        res.status(204).send();
    } catch (error) {
        console.error('Error al eliminar tarea:', error);
        res.status(500).json({ message: 'Error interno del servidor al eliminar la tarea.' });
    }
};