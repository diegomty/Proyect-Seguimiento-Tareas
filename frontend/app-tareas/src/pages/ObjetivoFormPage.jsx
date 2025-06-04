// src/pages/ObjetivoFormPage.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import ObjetivoForm from '../components/ObjetivoForm';
import { crearNuevoObjetivo } from '../services/apiService'; // Importa la función del servicio

function ObjetivoFormPage() {
  const navigate = useNavigate();

  const handleCreateObjetivo = async (objetivoData) => {
    // llamamos al servicio y manejamos la redirección o errores finales.
    try {
      const nuevoObjetivo = await crearNuevoObjetivo(objetivoData);
      console.log('Objetivo creado:', nuevoObjetivo);
      navigate('/objetivos'); // Redirige a la lista de objetivos después de crear
    } catch (error) {
     
      console.error('Error al crear objetivo desde la página:', error);
      
      throw error; 
    }
  };

  return (
    <div>
      <h2>Crear Nuevo Objetivo</h2>
      <ObjetivoForm onSubmit={handleCreateObjetivo} />
    </div>
  );
}

export default ObjetivoFormPage;