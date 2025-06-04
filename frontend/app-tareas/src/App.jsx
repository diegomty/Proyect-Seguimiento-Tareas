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
      <div>
       
        <nav style={{ padding: '10px', marginBottom: '10px', background: '#f0f0f0' }}>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', gap: '15px' }}>
            <li>
              <Link to="/">Inicio</Link>
            </li>
            <li>
              <Link to="/objetivos">Objetivos</Link>
            </li>
            
          </ul>
        </nav>

        <hr /> 

        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/objetivos" element={<ObjetivosListPage />} />
          <Route path="/objetivos/nuevo" element={<ObjetivoFormPage />} />
          <Route path="/objetivos/:id" element={<ObjetivoDetailPage />} />
          
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;