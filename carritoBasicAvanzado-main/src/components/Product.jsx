import React, { useEffect, useState } from 'react';
import axios from 'axios';

const API_URL = 'https://apireact1-1.onrender.com';

function ProductPage({ productId }) {
  const [product, setProduct] = useState(null);

  useEffect(() => {
    axios.get(`${API_URL}/api/products/${productId}`)
      .then(response => {
        setProduct(response.data);
      })
      .catch(error => {
        console.error('Error al obtener el producto:', error);
      });
  }, [productId]);

  return (
    <div>
      {product ? (
        <Product product={product} />
      ) : (
        <p>Cargando producto...</p>
      )}
    </div>
  );
}

const Product = ({ product, onAddToCart }) => {
  const [quantity, setQuantity] = useState(1);
 
  const imageURL = product.imagen 
    ? (product.imagen.startsWith('http') 
        ? product.imagen.replace('http://localhost:5000', API_URL) 
        : `${API_URL}/uploads/${product.imagen}`)
    : '/images/no-image.png';

  return (
    <div className="product">
      <img src={imageURL} alt={product.name} />
      <h2>{product.name}</h2>
      <p>${product.price.toFixed(2)}</p>
      <div className="quantity-controls">
        <button onClick={() => setQuantity(Math.max(1, quantity - 1))}>-</button>
        <span>{quantity}</span>
        <button onClick={() => setQuantity(quantity + 1)}>+</button>
      </div>
      <button onClick={() => onAddToCart(product, quantity)}>Añadir al Carrito</button>
    </div>
  );
};

export default Product;