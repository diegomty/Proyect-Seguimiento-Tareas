import React, { useState, useEffect } from 'react';

function ObjetivoForm({ onSubmit, initialData = null, isEditMode = false }) {
  const [nombre_objetivo, setNombreObjetivo] = useState('');
  const [fecha_inicio, setFechaInicio] = useState('');
  const [fecha_planeada_final, setFechaPlaneadaFinal] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (isEditMode && initialData) {
      setNombreObjetivo(initialData.nombre_objetivo || '');
      setFechaInicio(initialData.fecha_inicio ? initialData.fecha_inicio.split('T')[0] : '');
      setFechaPlaneadaFinal(initialData.fecha_planeada_final ? initialData.fecha_planeada_final.split('T')[0] : '');
    }
  }, [isEditMode, initialData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!nombre_objetivo.trim()) {
      setError('El nombre del objetivo es requerido.');
      return;
    }
    setError('');
    setSubmitting(true);

    const objetivoData = {
      nombre_objetivo,
      // Enviar null si la fecha está vacía, de lo contrario enviar el valor
      fecha_inicio: fecha_inicio || null,
      fecha_planeada_final: fecha_planeada_final || null,
    };

    try {
      await onSubmit(objetivoData);
      // El componente padre (ObjetivoFormPage) se encargará de la redirección
    } catch (apiError) {
      console.error("Error en el formulario al enviar:", apiError);
      setError(apiError.response?.data?.message || apiError.message || 'Ocurrió un error al guardar el objetivo.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <div>
        <label htmlFor="nombre_objetivo">Nombre del Objetivo:</label>
        <input
          type="text"
          id="nombre_objetivo"
          value={nombre_objetivo}
          onChange={(e) => setNombreObjetivo(e.target.value)}
          required
          disabled={submitting}
        />
      </div>
      <div>
        <label htmlFor="fecha_inicio">Fecha de Inicio:</label>
        <input
          type="date"
          id="fecha_inicio"
          value={fecha_inicio}
          onChange={(e) => setFechaInicio(e.target.value)}
          disabled={submitting}
        />
      </div>
      <div>
        <label htmlFor="fecha_planeada_final">Fecha Planeada Final:</label>
        <input
          type="date"
          id="fecha_planeada_final"
          value={fecha_planeada_final}
          onChange={(e) => setFechaPlaneadaFinal(e.target.value)}
          disabled={submitting}
        />
      </div>
      <button type="submit" disabled={submitting}>
        {submitting ? 'Guardando...' : (isEditMode ? 'Actualizar Objetivo' : 'Crear Objetivo')}
      </button>
    </form>
  );
}

export default ObjetivoForm;