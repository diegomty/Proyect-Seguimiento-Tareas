// src/pages/ObjetivosListPage.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { obtenerTodosLosObjetivos } from '../services/apiService'; // Importa la función

function ObjetivosListPage() {
  const [objetivos, setObjetivos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const cargarObjetivos = async () => {
      try {
        setLoading(true);
        const data = await obtenerTodosLosObjetivos();
        setObjetivos(data);
        setError(null); // Limpiar errores previos
      } catch (err) {
        console.error("Error en el componente al cargar objetivos:", err);
        setError(err.message || 'Error al cargar los objetivos. Intenta de nuevo más tarde.');
        // Opcionalmente, podrías verificar err.response.data para mensajes de error del backend
        if (err.response && err.response.data && err.response.data.message) {
            setError(err.response.data.message);
        }
      } finally {
        setLoading(false);
      }
    };

    cargarObjetivos();
  }, []); // El array vacío [] asegura que useEffect se ejecute solo una vez (al montar el componente)

  if (loading) {
    return <p>Cargando objetivos...</p>;
  }

  if (error) {
    return <p style={{ color: 'red' }}>Error: {error}</p>;
  }

  return (
    <div>
      <h2>Mis Objetivos</h2>
      <Link to="/objetivos/nuevo" style={{ marginBottom: '20px', display: 'inline-block' }}>
        Crear Nuevo Objetivo
      </Link>

      {objetivos.length === 0 ? (
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
              {/* Enlaces para acciones futuras */}
              <Link to={`/objetivos/${objetivo.id_objetivo}`}>Ver Detalles</Link> | {' '}
              <Link to={`/objetivos/${objetivo.id_objetivo}/editar`}>Editar</Link> | {' '}
              <button onClick={() => alert(`Eliminar objetivo ${objetivo.id_objetivo} (no implementado)`)}>
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