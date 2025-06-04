// src/controllers/objetivos.controller.js
import pool from '../config/db.js';

// Crear un nuevo objetivo
export const crearObjetivo = async (req, res) => {
    const { nombre_objetivo, fecha_inicio, fecha_planeada_final } = req.body;

    if (!nombre_objetivo) {
        return res.status(400).json({ message: 'El nombre del objetivo es requerido.' });
    }

    try {
        const [result] = await pool.query(
            'INSERT INTO objetivos (nombre_objetivo, fecha_inicio, fecha_planeada_final) VALUES (?, ?, ?)',
            [nombre_objetivo, fecha_inicio || null, fecha_planeada_final || null]
        );

        const insertId = result.insertId;
        // Hacemos un SELECT para obtener el objeto completo con fechas generadas por la BD
        const [rows] = await pool.query('SELECT * FROM objetivos WHERE id_objetivo = ?', [insertId]);
        
        if (rows.length <= 0) {
            return res.status(500).json({ message: 'Error al recuperar el objetivo recién creado.' });
        }

        res.status(201).json(rows[0]); // Devuelve el objeto directamente de la BD

    } catch (error) {
        console.error('Error al crear objetivo:', error);
        // Manejar error de formato de fecha en la inserción si es necesario
        if (error.code === 'ER_TRUNCATED_WRONG_VALUE' || error.code === 'WARN_DATA_TRUNCATED' || error.code === 'ER_WRONG_VALUE') {
            return res.status(400).json({ message: 'Formato de fecha inválido para fecha_inicio o fecha_planeada_final. Usar YYYY-MM-DD o un formato de fecha/hora válido.' });
        }
        res.status(500).json({ message: 'Error interno del servidor al crear el objetivo.' });
    }
};

// Obtener todos los objetivos
export const obtenerObjetivos = async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM objetivos ORDER BY fecha_creacion DESC');
        res.status(200).json(rows); // Devuelve los objetos directamente de la BD
    } catch (error) {
        console.error('Error al obtener objetivos:', error);
        res.status(500).json({ message: 'Error interno del servidor al obtener los objetivos.' });
    }
};

// Obtener un objetivo por ID
export const obtenerObjetivo = async (req, res) => {
    const { id } = req.params;
    try {
        const [rows] = await pool.query('SELECT * FROM objetivos WHERE id_objetivo = ?', [id]);
        if (rows.length <= 0) {
            return res.status(404).json({ message: 'Objetivo no encontrado.' });
        }
        res.status(200).json(rows[0]); // Devuelve el objeto directamente de la BD
    } catch (error) {
        console.error('Error al obtener objetivo:', error);
        res.status(500).json({ message: 'Error interno del servidor al obtener el objetivo.' });
    }
};

// Actualizar un objetivo por ID
export const actualizarObjetivo = async (req, res) => {
    const { id } = req.params;
    const { nombre_objetivo, fecha_inicio, fecha_planeada_final } = req.body;

    if (nombre_objetivo === undefined && fecha_inicio === undefined && fecha_planeada_final === undefined) {
        return res.status(400).json({ message: 'Se requiere al menos un campo para actualizar.' });
    }
    
    try {
        const [existingObjetivoRows] = await pool.query('SELECT * FROM objetivos WHERE id_objetivo = ?', [id]);
        if (existingObjetivoRows.length === 0) {
            return res.status(404).json({ message: 'Objetivo no encontrado.' });
        }
        const existingObjetivo = existingObjetivoRows[0];

        const finalNombreObjetivo = nombre_objetivo !== undefined ? nombre_objetivo : existingObjetivo.nombre_objetivo;
        
        // Para las fechas, si la clave está en el body, se usa su valor (o null si es falsy pero no undefined).
        // Si la clave no está, se mantiene el valor existente.
        const finalFechaInicio = req.body.hasOwnProperty('fecha_inicio') ? (req.body.fecha_inicio || null) : existingObjetivo.fecha_inicio;
        const finalFechaPlaneadaFinal = req.body.hasOwnProperty('fecha_planeada_final') ? (req.body.fecha_planeada_final || null) : existingObjetivo.fecha_planeada_final;

        if (finalNombreObjetivo === '' && nombre_objetivo !== undefined) {
             return res.status(400).json({ message: 'El nombre del objetivo no puede ser vacío.' });
        }

        const [result] = await pool.query(
            'UPDATE objetivos SET nombre_objetivo = ?, fecha_inicio = ?, fecha_planeada_final = ? WHERE id_objetivo = ?',
            [finalNombreObjetivo, finalFechaInicio, finalFechaPlaneadaFinal, id]
        );

        if (result.affectedRows === 0 && result.changedRows === 0) {
            const [updatedRowsUnchanged] = await pool.query('SELECT * FROM objetivos WHERE id_objetivo = ?', [id]);
            return res.status(200).json(updatedRowsUnchanged[0]);
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Objetivo no encontrado durante la actualización.' });
        }

        const [updatedRows] = await pool.query('SELECT * FROM objetivos WHERE id_objetivo = ?', [id]);
        res.status(200).json(updatedRows[0]); // Devuelve el objeto directamente de la BD

    } catch (error) {
        console.error('Error al actualizar objetivo:', error);
        if (error.code === 'ER_TRUNCATED_WRONG_VALUE' || error.code === 'WARN_DATA_TRUNCATED' || error.code === 'ER_WRONG_VALUE') {
            return res.status(400).json({ message: 'Formato de fecha inválido para fecha_inicio o fecha_planeada_final. Usar YYYY-MM-DD o un formato de fecha/hora válido.' });
        }
        res.status(500).json({ message: 'Error interno del servidor al actualizar el objetivo.' });
    }
};

// Eliminar un objetivo por ID
export const eliminarObjetivo = async (req, res) => {
    const { id } = req.params;
    try {
        const [result] = await pool.query('DELETE FROM objetivos WHERE id_objetivo = ?', [id]);
        if (result.affectedRows <= 0) {
            return res.status(404).json({ message: 'Objetivo no encontrado.' });
        }
        res.status(204).send();
    } catch (error) {
        console.error('Error al eliminar objetivo:', error);
        res.status(500).json({ message: 'Error interno del servidor al eliminar el objetivo.' });
    }
};