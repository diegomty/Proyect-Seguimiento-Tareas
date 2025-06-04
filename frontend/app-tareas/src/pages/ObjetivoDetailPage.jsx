// src/pages/ObjetivoDetailPage.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  obtenerObjetivoPorId,
  obtenerTareasDelObjetivo,
  crearNuevaTarea,
  actualizarTareaExistente,
  eliminarTareaPorId // Importar la función de eliminación
} from '../services/apiService';

// ... (Componente NuevaTareaForm sin cambios) ...
function NuevaTareaForm({ idObjetivo, onTareaCreada }) {
    // ... (código existente del formulario de nueva tarea)
    const [titulo, setTitulo] = useState('');
    const [descripcion, setDescripcion] = useState('');
    const [error, setError] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!titulo.trim()) {
        setError('El título de la tarea es requerido.');
        return;
        }
        setError('');
        setSubmitting(true);
        try {
        const nuevaTarea = await crearNuevaTarea(idObjetivo, { titulo, descripcion });
        onTareaCreada(nuevaTarea);
        setTitulo('');
        setDescripcion('');
        } catch (apiError) {
        console.error("Error al crear tarea (formulario):", apiError);
        setError(apiError.response?.data?.message || apiError.message || 'Error al crear la tarea.');
        } finally {
        setSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} style={{ marginTop: '20px', marginBottom: '20px', padding: '15px', border: '1px dashed #ccc' }}>
        <h4>Añadir Nueva Tarea</h4>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <div>
            <label htmlFor="tarea-titulo">Título:</label>
            <input
            type="text"
            id="tarea-titulo"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            required
            disabled={submitting}
            style={{ marginLeft: '5px', marginBottom: '5px' }}
            />
        </div>
        <div>
            <label htmlFor="tarea-descripcion">Descripción (Opcional):</label>
            <textarea
            id="tarea-descripcion"
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            disabled={submitting}
            style={{ marginLeft: '5px', width: '90%', minHeight: '60px' }}
            />
        </div>
        <button type="submit" disabled={submitting} style={{ marginTop: '10px' }}>
            {submitting ? 'Añadiendo...' : 'Añadir Tarea'}
        </button>
        </form>
    );
}

function ObjetivoDetailPage() {
  const { id } = useParams();
  const [objetivo, setObjetivo] = useState(null);
  const [tareas, setTareas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [taskUpdateError, setTaskUpdateError] = useState(null);
  const [taskDeleteError, setTaskDeleteError] = useState(null); // Estado para errores de eliminación de tareas


  const cargarTareas = useCallback(async () => {
    // ... (código existente de cargarTareas)
    try {
        const tareasData = await obtenerTareasDelObjetivo(id);
        setTareas(tareasData);
      } catch (err) {
        console.error("Error al cargar tareas:", err);
        setError(prevError => `${prevError || ''} Error al cargar tareas: ${err.response?.data?.message || err.message}. `);
      }
  }, [id]);

  useEffect(() => {
    const cargarDatosDelObjetivo = async () => {
      try {
        setLoading(true);
        setError(null);
        setTaskUpdateError(null);
        setTaskDeleteError(null); // Limpiar errores de eliminación de tarea al cargar
        const objetivoData = await obtenerObjetivoPorId(id);
        setObjetivo(objetivoData);
        await cargarTareas();
      } catch (err) {
        console.error("Error al cargar datos del objetivo:", err);
        setError(err.response?.data?.message || err.message || 'Error al cargar los datos.');
      } finally {
        setLoading(false);
      }
    };
    if (id) {
        cargarDatosDelObjetivo();
    }
  }, [id, cargarTareas]);

  const handleTareaCreada = (nuevaTarea) => {
    setTareas(prevTareas => [...prevTareas, nuevaTarea]);
  };

  const handleToggleCompletada = async (tareaAActualizar) => {
    // ... (código existente de handleToggleCompletada)
    setTaskUpdateError(null);
    const nuevoEstadoCompletada = !tareaAActualizar.completada;
    try {
      const tareaActualizada = await actualizarTareaExistente(
        tareaAActualizar.id_tarea,
        { completada: nuevoEstadoCompletada }
      );
      setTareas(prevTareas =>
        prevTareas.map(t =>
          t.id_tarea === tareaAActualizar.id_tarea ? tareaActualizada : t
        )
      );
    } catch (apiError) {
      console.error("Error al actualizar estado de tarea:", apiError);
      setTaskUpdateError(apiError.response?.data?.message || apiError.message || 'Error al actualizar la tarea.');
    }
  };

  // Función para manejar la eliminación de una tarea
  const handleEliminarTarea = async (idTareaAEliminar) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar esta tarea?')) {
      setTaskDeleteError(null); // Limpiar errores previos
      try {
        await eliminarTareaPorId(idTareaAEliminar);
        // Actualizar el estado local de las tareas filtrando la eliminada
        setTareas(prevTareas =>
          prevTareas.filter(t => t.id_tarea !== idTareaAEliminar)
        );
        alert('Tarea eliminada exitosamente.'); // Opcional
      } catch (apiError) {
        console.error("Error al eliminar tarea:", apiError);
        const errMsg = apiError.response?.data?.message || apiError.message || 'Error al eliminar la tarea.';
        setTaskDeleteError(errMsg);
        alert(`Error al eliminar tarea: ${errMsg}`);
      }
    }
  };


  if (loading) return <p>Cargando detalles del objetivo...</p>;
  if (error && !objetivo) return <p style={{ color: 'red' }}>Error: {error}</p>;

  return (
    <div>
      {/* ... (renderizado de detalles del objetivo como antes) ... */}
      {objetivo && (
        <>
            <h2>Detalles del Objetivo</h2>
            <h3>{objetivo.nombre_objetivo}</h3>
            {/* ... más detalles del objetivo ... */}
             <p><strong>ID:</strong> {objetivo.id_objetivo}</p>
            <p>
                <strong>Fecha de Inicio:</strong>
                {objetivo.fecha_inicio ? new Date(objetivo.fecha_inicio).toLocaleDateString() : 'No especificada'}
            </p>
            <p>
                <strong>Fecha Planeada Final:</strong>
                {objetivo.fecha_planeada_final ? new Date(objetivo.fecha_planeada_final).toLocaleDateString() : 'No especificada'}
            </p>
            <p>
                <strong>Creado:</strong> {new Date(objetivo.fecha_creacion).toLocaleString()}
            </p>
            <p>
                <strong>Última Actualización:</strong> {new Date(objetivo.fecha_actualizacion).toLocaleString()}
            </p>
            <Link to={`/objetivos/${id}/editar`}>Editar Objetivo</Link>
        </>
      )}


      <hr style={{ margin: '20px 0' }}/>

      <h3>Tareas Asociadas</h3>
      {objetivo && <NuevaTareaForm idObjetivo={objetivo.id_objetivo} onTareaCreada={handleTareaCreada} />}

      {taskUpdateError && <p style={{ color: 'red', marginTop: '10px' }}>Error al actualizar tarea: {taskUpdateError}</p>}
      {taskDeleteError && <p style={{ color: 'red', marginTop: '10px' }}>Error al eliminar tarea: {taskDeleteError}</p>}
      {error && <p style={{ color: 'red', marginTop: '10px' }}>{error}</p>}


      {tareas.length === 0 && !loading && !(error && error.includes("Error al cargar tareas")) && (
        <p>Este objetivo aún no tiene tareas o no se pudieron cargar.</p>
      )}

      {tareas.length > 0 && (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {tareas.map((tarea) => (
            <li key={tarea.id_tarea} style={{ border: '1px solid #eee', marginBottom: '10px', padding: '10px', background: tarea.completada ? '#e6ffe6' : 'transparent' }}>
              {/* ... (renderizado del título, descripción y checkbox de completada) ... */}
              <h4 style={{ textDecoration: tarea.completada ? 'line-through' : 'none' }}>
                {tarea.titulo}
              </h4>
              <p style={{ textDecoration: tarea.completada ? 'line-through' : 'none' }}>
                {tarea.descripcion || 'Sin descripción.'}
              </p>
              <p>
                <input
                  type="checkbox"
                  checked={Boolean(tarea.completada)} // Asegurarse de que sea booleano
                  onChange={() => handleToggleCompletada(tarea)}
                  id={`tarea-completada-${tarea.id_tarea}`}
                  style={{ marginRight: '8px' }}
                />
                <label htmlFor={`tarea-completada-${tarea.id_tarea}`}>
                    <strong>Completada:</strong> {Boolean(tarea.completada) ? 'Sí' : 'No'}
                </label>
              </p>
              <p style={{ fontSize: '0.8em', color: '#555' }}>
                Creada: {new Date(tarea.fecha_creacion).toLocaleString()}
              </p>

              {/* Botón para Eliminar Tarea */}
              <button 
                onClick={() => handleEliminarTarea(tarea.id_tarea)} 
                style={{ marginLeft: '10px', background: '#ffdddd', border: '1px solid #ffaaaa', cursor: 'pointer' }}
              >
                Eliminar Tarea
              </button>
              {/* Futuro: Botón para editar Tarea
              <button style={{ marginLeft: '10px' }}>Editar Tarea</button>
              */}
            </li>
          ))}
        </ul>
      )}
       <Link to="/objetivos" style={{display: 'block', marginTop: '20px'}}>Volver a la lista de Objetivos</Link>
    </div>
  );
}

export default ObjetivoDetailPage;