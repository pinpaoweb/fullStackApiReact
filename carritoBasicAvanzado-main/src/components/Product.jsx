import React, { useState } from 'react';

const Product = ({ product, onAddToCart }) => {
  const [quantity, setQuantity] = useState(1);
 
  const imageURL = `http://localhost:5000/uploads/${product.imagen}`;
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
