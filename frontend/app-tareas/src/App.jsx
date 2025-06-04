import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import HomePage from './pages/HomePage';
import ObjetivosListPage from './pages/ObjetivosListPage';
import ObjetivoFormPage from './pages/ObjetivoFormPage'; 
import ObjetivoDetailPage from './pages/ObjetivoDetailPage';// Importa la nueva página
import NotFoundPage from './pages/NotFoundPage';
import './App.css';

function App() {
  return (
    <Router>
      <div>
        {/* ... (nav existente) ... */}
        <hr />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/objetivos" element={<ObjetivosListPage />} />
          <Route path="/objetivos/nuevo" element={<ObjetivoFormPage />} />
          <Route path="/objetivos/:id" element={<ObjetivoDetailPage />} /> {/* Nueva ruta */}
          {/* <Route path="/objetivos/:id/editar" element={<ObjetivoFormPage mode="edit" />} />
          */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;