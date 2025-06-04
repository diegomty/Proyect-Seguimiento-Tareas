// src/pages/ObjetivoDetailPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { obtenerObjetivoPorId, obtenerTareasDelObjetivo } from '../services/apiService';

function ObjetivoDetailPage() {
  const { id } = useParams(); // Obtiene el 'id' de la URL
  const [objetivo, setObjetivo] = useState(null);
  const [tareas, setTareas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const cargarDatosDelObjetivo = async () => {
      try {
        setLoading(true);
        setError(null);

        // Cargar detalles del objetivo
        const objetivoData = await obtenerObjetivoPorId(id);
        setObjetivo(objetivoData);

        // Cargar tareas del objetivo
        const tareasData = await obtenerTareasDelObjetivo(id);
        setTareas(tareasData);

      } catch (err) {
        console.error("Error al cargar datos del objetivo:", err);
        setError(err.response?.data?.message || err.message || 'Error al cargar los datos.');
      } finally {
        setLoading(false);
      }
    };

    cargarDatosDelObjetivo();
  }, [id]); // Se ejecuta cuando el 'id' cambia

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
              {/* Botones para acciones de tarea (editar, eliminar, marcar completada) */}
            </li>
          ))}
        </ul>
      )}
       <Link to="/objetivos" style={{display: 'block', marginTop: '20px'}}>Volver a la lista de Objetivos</Link>
    </div>
  );
}

export default ObjetivoDetailPage;