import React from 'react';
import { useNavigate } from 'react-router-dom';

const ComponentesNaturales = () => {
  const navigate = useNavigate();

  const handleGoToCatalogo = () => {
    navigate('/');
    setTimeout(() => {
      const element = document.getElementById('catalogo');
      if (element) { element.scrollIntoView({ behavior: 'smooth' }); }
    }, 100);
  };

  return (
    <section className="envios-section">
      <div className="envios-container">
        <div className="envios-info">
          <h3>🌿 Componentes 100% Naturales</h3>
          <p>La pureza es nuestro compromiso. En PINPAO seleccionamos ingredientes de origen natural para potenciar tu bienestar sin químicos agresivos.</p>
          <ul className="envios-lista">
            <li>✅ <strong>Origen Orgánico:</strong> Ingredientes extraídos de fuentes responsables.</li>
            <li>✅ <strong>Sin aditivos artificiales:</strong> Calidad pura para tu organismo.</li>
            <li>✅ <strong>Certificados:</strong> Procesos validados para tu seguridad.</li>
          </ul>
          <button onClick={handleGoToCatalogo} className="btn-comprar">Ver Catálogo</button>
        </div>
        <div className="envios-foto">
          <img src="/images/natural.jpg" alt="Componentes Naturales" />
        </div>
      </div>
    </section>
  );
};
export default ComponentesNaturales;