import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ObjetivoForm from '../components/ObjetivoForm';
import {
  crearNuevoObjetivo,
  obtenerObjetivoPorId,
  actualizarObjetivoExistente
} from '../services/apiService';

// La prop isEditMode la recibiremos de la configuración de la ruta en App.jsx
function ObjetivoFormPage({ isEditMode = false }) {
  const navigate = useNavigate();
  const { id } = useParams(); // Obtiene el 'id' de la URL si está presente (para modo edición)

  const [initialData, setInitialData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [pageError, setPageError] = useState(''); // Para errores a nivel de página (ej. no se encuentra el objetivo)

  useEffect(() => {
    if (isEditMode && id) {
      setLoading(true);
      setPageError('');
      obtenerObjetivoPorId(id)
        .then(data => {
          setInitialData(data);
        })
        .catch(err => {
          console.error("Error al cargar datos del objetivo para editar:", err);
          setPageError(err.response?.data?.message || err.message || 'No se pudo cargar el objetivo para editar.');
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [isEditMode, id, navigate]);

  const handleSubmitObjetivo = async (objetivoData) => {
    try {
      if (isEditMode) {
        await actualizarObjetivoExistente(id, objetivoData);
        console.log('Objetivo actualizado:', id);
        navigate(`/objetivos/${id}`); // Redirige a la página de detalles del objetivo
      } else {
        const nuevoObjetivo = await crearNuevoObjetivo(objetivoData);
        console.log('Objetivo creado:', nuevoObjetivo);
        navigate('/objetivos'); // Redirige a la lista de objetivos
      }
    } catch (error) {
      // El error específico del formulario
      // ya es manejado por ObjetivoForm. Si llega aquí, es un error que ObjetivoForm no pudo manejar
      // o que queremos manejar a nivel de página.
      console.error('Error en handleSubmitObjetivo (página):', error);
      throw error;
    }
  };

  if (loading && isEditMode) {
    return <p>Cargando datos del objetivo...</p>;
  }

  if (pageError) {
    return <p style={{ color: 'red' }}>Error: {pageError}</p>;
  }

  // Si es modo edición pero no hay datos iniciales (y no está cargando), puede ser un error o que aún no se cargó.
  // El pageError debería cubrir el caso de no encontrar el objetivo.
  if (isEditMode && !initialData && !loading) {
    return <p>No se pudieron cargar los datos del objetivo para editar.</p>;
  }


  return (
    <div>
      <h2>{isEditMode ? 'Editar Objetivo' : 'Crear Nuevo Objetivo'}</h2>
      <ObjetivoForm
        onSubmit={handleSubmitObjetivo}
        initialData={initialData} // Será null en modo creación
        isEditMode={isEditMode}
      />
    </div>
  );
}

export default ObjetivoFormPage;