import { useState } from 'react';
import { API_URL } from './config'; // Usamos la configuración centralizada

const Product = ({ product, onAddToCart }) => {
  const [showDesc, setShowDesc] = useState(false);

  // Ya no necesitas definir IP ni baseUrl aquí, usas API_URL importado
  return (
    <div className="product-card">
      <img 
        src={`${API_URL}/uploads/${product.imagen}`} 
        alt={product.name} 
        // Si la imagen falla, ocultamos el elemento
        onError={(e) => { e.target.style.display = 'none'; }} 
      />
      <h3>{product.name}</h3>
      
      <button className="btn-info" onClick={() => setShowDesc(!showDesc)}>
        {showDesc ? 'Ocultar descripción ⬆' : 'Ver descripción ⬇'}
      </button>

      {showDesc && (
        <p className="product-description active">
          {product.descripcion}
        </p>
      )}
      
      <p className="product-price">Precio: ${product.price?.toLocaleString() || '0'}</p>
      
      <button className="btn-agregar" onClick={() => onAddToCart(product, 1)}>
        Agregar al Carrito
      </button>
    </div>
  );
};

export default Product;