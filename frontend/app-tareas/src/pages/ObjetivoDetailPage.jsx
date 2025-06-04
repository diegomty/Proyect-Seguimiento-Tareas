// src/pages/ObjetivoDetailPage.jsx
import React, { useState, useEffect, useCallback } from 'react'; // Añadir useCallback
import { useParams, Link } from 'react-router-dom';
import {
  obtenerObjetivoPorId,
  obtenerTareasDelObjetivo,
  crearNuevaTarea 
} from '../services/apiService';

// Un pequeño componente para el formulario de nueva tarea (puede estar en este archivo o separado)
function NuevaTareaForm({ idObjetivo, onTareaCreada }) {
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
      onTareaCreada(nuevaTarea); // Llama al callback con la tarea creada
      setTitulo(''); // Limpiar formulario
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

  // Usamos useCallback para memoizar la función cargarTareas,
  // así no se recrea innecesariamente si se pasa como dependencia a otro useEffect (no es el caso aquí aún, pero es buena práctica)
  const cargarTareas = useCallback(async () => {
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

        const objetivoData = await obtenerObjetivoPorId(id);
        setObjetivo(objetivoData);

        await cargarTareas(); // Cargar tareas después de cargar el objetivo

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

  // Callback para cuando se crea una nueva tarea
  const handleTareaCreada = (nuevaTarea) => {
    setTareas(prevTareas => [...prevTareas, nuevaTarea]);
  };

  if (loading) {
    return <p>Cargando detalles del objetivo...</p>;
  }

  if (error) {
    return <p style={{ color: 'red' }}>Error: {error}</p>;
  }

  if (!objetivo) {
    return <p>Objetivo no encontrado.</p>;
  }

  return (
    <div>
      <h2>Detalles del Objetivo</h2>
      {/* ... (detalles del objetivo como antes) ... */}
      <h3>{objetivo.nombre_objetivo}</h3>
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

      <hr style={{ margin: '20px 0' }}/>

      <h3>Tareas Asociadas</h3>

      {/* Formulario para añadir nueva tarea */}
      <NuevaTareaForm idObjetivo={objetivo.id_objetivo} onTareaCreada={handleTareaCreada} />

      {tareas.length === 0 ? (
        <p>Este objetivo aún no tiene tareas.</p>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {tareas.map((tarea) => (
            <li key={tarea.id_tarea} style={{ border: '1px solid #eee', marginBottom: '10px', padding: '10px' }}>
              <h4>{tarea.titulo}</h4>
              <p>{tarea.descripcion || 'Sin descripción.'}</p>
              <p>
                <strong>Completada:</strong> {tarea.completada ? 'Sí' : 'No'}
              </p>
              <p style={{ fontSize: '0.8em', color: '#555' }}>
                Creada: {new Date(tarea.fecha_creacion).toLocaleString()}
              </p>
              {/* Aquí irán botones para editar/eliminar tarea */}
            </li>
          ))}
        </ul>
      )}
       <Link to="/objetivos" style={{display: 'block', marginTop: '20px'}}>Volver a la lista de Objetivos</Link>
    </div>
  );
}

export default ObjetivoDetailPage;