import React from 'react';
import { useNavigate } from 'react-router-dom';

const AsesoriaPersonal = () => {
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
          <h3>🤝 Asesoría Personalizada</h3>
          <p>No estás solo en tu camino al bienestar. Nuestros expertos están listos para resolver todas tus dudas sobre nuestros productos.</p>
          <ul className="envios-lista">
            <li>✅ <strong>Guía experta:</strong> Recomendaciones basadas en tus necesidades.</li>
            <li>✅ <strong>Atención cercana:</strong> Respondemos tus preguntas vía WhatsApp.</li>
            <li>✅ <strong>Seguimiento:</strong> Te acompañamos en todo tu proceso de uso.</li>
          </ul>
          <button onClick={handleGoToCatalogo} className="btn-comprar">Ver Catálogo</button>
        </div>
        <div className="envios-foto">
          <img src="/images/asesoria.jpg" alt="Asesoría Personal" />
        </div>
      </div>
    </section>
  );
};
export default AsesoriaPersonal;