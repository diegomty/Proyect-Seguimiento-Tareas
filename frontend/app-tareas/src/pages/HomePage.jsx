import React from 'react';
import { Link } from 'react-router-dom'; 
import './HomePage.css'; 

import heroImage from '../images/imagen1.png'; 

function HomePage() {
  return (
    <div className="home-container">
      <header className="home-hero">
       
        {heroImage && <img src={heroImage} alt="Productivity background" className="hero-bg-image" />}

       
        <div className="hero-content">
          <h1>Bienvenido a tu Aplicación de Seguimiento de Tareas</h1>
          <Link to="/objetivos" className="cta-button">
            Ver Mis Objetivos
          </Link>
        </div>
      </header>
    </div>
  );
}

export default HomePage;