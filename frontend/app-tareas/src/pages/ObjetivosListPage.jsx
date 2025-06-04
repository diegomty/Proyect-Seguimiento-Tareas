import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { obtenerTodosLosObjetivos, eliminarObjetivoPorId } from '../services/apiService'; // Importa la función

function ObjetivosListPage() {
  const [objetivos, setObjetivos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteError, setDeleteError] = useState(null);

  
    const cargarObjetivos = async () => {
      try {
        setLoading(true);
        setError(null); // Limpiar errores previos
        setDeleteError(null); // Limpiar errores de eliminación previos
        const data = await obtenerTodosLosObjetivos();
        setObjetivos(data);
      } catch (err) {
        console.error("Error en el componente al cargar objetivos:", err);
        const errMsg = err.response?.data?.message || err.message || 'Error al cargar los objetivos.';
        setError(errMsg);
      } finally {
        setLoading(false);
      }
    };
  useEffect(() => {
    cargarObjetivos();
  }, []); // El array vacío [] asegura que useEffect se ejecute solo una vez (al montar el componente)

  const handleEliminarObjetivo = async (idObjetivo) => {
    // Pedir confirmación
    if (window.confirm('¿Estás seguro de que deseas eliminar este objetivo y todas sus tareas asociadas?')) {
      try {
        setDeleteError(null); // Limpiar errores de eliminación previos
        await eliminarObjetivoPorId(idObjetivo);
        // Actualizar la lista de objetivos en el estado, filtrando el eliminado
        setObjetivos(prevObjetivos => prevObjetivos.filter(obj => obj.id_objetivo !== idObjetivo));
        // Opcional: mostrar un mensaje de éxito
        alert('Objetivo eliminado exitosamente.');
      } catch (err) {
        console.error(`Error al eliminar objetivo ${idObjetivo}:`, err);
        const errMsg = err.response?.data?.message || err.message || 'Error al eliminar el objetivo.';
        setDeleteError(errMsg); // Mostrar error de eliminación
        alert(`Error al eliminar: ${errMsg}`); // También como alerta para visibilidad inmediata
      }
    }
  };

  if (loading) {
    return <p>Cargando objetivos...</p>;
  }

  // Mostrar error de carga principal si existe
  if (error && !loading) {
    return <p style={{ color: 'red' }}>Error de carga: {error}</p>;
  }

  return (
    <div>
      <h2>Mis Objetivos</h2>
      <Link to="/objetivos/nuevo" style={{ marginBottom: '20px', display: 'inline-block' }}>
        Crear Nuevo Objetivo
      </Link>

      {/* Mostrar error de eliminación si existe */}
      {deleteError && <p style={{ color: 'red', marginTop: '10px' }}>Error al eliminar: {deleteError}</p>}

      {objetivos.length === 0 && !error ? ( // Asegurarse de no mostrar "No hay objetivos" si hubo un error de carga
        <p>No hay objetivos creados todavía.</p>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {objetivos.map((objetivo) => (
            <li key={objetivo.id_objetivo} style={{ border: '1px solid #ccc', marginBottom: '10px', padding: '10px' }}>
              <h3>{objetivo.nombre_objetivo}</h3>
              <p>
                Inicio: {objetivo.fecha_inicio ? new Date(objetivo.fecha_inicio).toLocaleDateString() : 'No especificada'}
              </p>
              <p>
                Fin Planeado: {objetivo.fecha_planeada_final ? new Date(objetivo.fecha_planeada_final).toLocaleDateString() : 'No especificada'}
              </p>
              <p style={{ fontSize: '0.8em', color: '#555' }}>
                Creado: {new Date(objetivo.fecha_creacion).toLocaleString()}
              </p>
              <Link to={`/objetivos/${objetivo.id_objetivo}`}>Ver Detalles</Link> | {' '}
              <Link to={`/objetivos/${objetivo.id_objetivo}/editar`}>Editar</Link> | {' '}
              <button onClick={() => handleEliminarObjetivo(objetivo.id_objetivo)}> {/* LLAMADA A LA FUNCIÓN */}
                Eliminar
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default ObjetivosListPage;