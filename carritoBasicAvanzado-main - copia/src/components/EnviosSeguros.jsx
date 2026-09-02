import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const EnviosSeguros = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleGoToCatalogo = () => {
    // Si ya estamos en el home, hacemos scroll directo
    if (location.pathname === '/') {
      const element = document.getElementById('catalogo');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      // Si estamos en otra página, navegamos y luego hacemos scroll
      navigate('/');
      setTimeout(() => {
        const element = document.getElementById('catalogo');
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    }
  };

  return (
    <section className="envios-section">
      <div className="envios-container">
        <div className="envios-info">
          <h3>🚀 Envíos Seguros y Garantizados</h3>
          <p>Comprar en PINPAO es sinónimo de tranquilidad. Tu pedido llega a la puerta de tu casa con los más altos estándares de cuidado.</p>
          <ul className="envios-lista">
            <li>✅ <strong>Seguimiento en tiempo real:</strong> Sabrás dónde está tu pedido en todo momento.</li>
            <li>✅ <strong>Empaque protegido:</strong> Tus productos naturales llegan intactos y frescos.</li>
            <li>✅ <strong>Envío gratis:</strong> Por compras superiores a $150.000.</li>
          </ul>
          <button onClick={handleGoToCatalogo} className="btn-comprar">
            Ver Catálogo
          </button>
        </div>
        <div className="envios-foto">
          <img 
            src="/images/image_728ba4.jpg" 
            alt="Envío seguro"
            onError={(e) => {
              e.target.style.display = 'none'; // Oculta la imagen si falla
              console.error("No se pudo cargar la imagen: /images/image_728ba4.jpg");
            }}
          />
        </div>
      </div>
    </section>
  );
};

export default EnviosSeguros;