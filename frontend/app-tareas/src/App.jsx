import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';

import HomePage from './pages/HomePage';
import ObjetivosListPage from './pages/ObjetivosListPage';
import ObjetivoFormPage from './pages/ObjetivoFormPage';
import ObjetivoDetailPage from './pages/ObjetivoDetailPage';
import NotFoundPage from './pages/NotFoundPage';

import './App.css'; 

function App() {
  return (
    <Router>
      <div className="app-container"> 
        <nav className="main-nav"> 
          <ul>
            <li>
              <Link to="/">Inicio</Link>
            </li>
            <li>
              <Link to="/objetivos">Objetivos</Link>
            </li>
          </ul>
        </nav>

        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/objetivos" element={<ObjetivosListPage />} />
          <Route path="/objetivos/nuevo" element={<ObjetivoFormPage />} />
          <Route path="/objetivos/:id" element={<ObjetivoDetailPage />} />
          <Route path="/objetivos/:id/editar" element={<ObjetivoFormPage isEditMode={true} />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;