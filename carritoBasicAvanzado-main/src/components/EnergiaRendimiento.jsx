import React from 'react';
import { useNavigate } from 'react-router-dom';

const EnergiaRendimiento = () => {
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
          <h3>⚡ Energía y Rendimiento Superior</h3>
          <p>Maximiza tu vitalidad diaria con fórmulas diseñadas para superar tus metas físicas y mentales con Power Maker.</p>
          <ul className="envios-lista">
            <li>✅ <strong>Potencia total:</strong> Diseñado para el alto rendimiento.</li>
            <li>✅ <strong>Recuperación rápida:</strong> Ideal para tu rutina diaria.</li>
            <li>✅ <strong>Fórmula premium:</strong> Nutrición inteligente para tu cuerpo.</li>
          </ul>
          <button onClick={handleGoToCatalogo} className="btn-comprar">Ver Catálogo</button>
        </div>
        <div className="envios-foto">
          <img src="/images/energia.jpg" alt="Energía y Rendimiento" />
        </div>
      </div>
    </section>
  );
};
export default EnergiaRendimiento;