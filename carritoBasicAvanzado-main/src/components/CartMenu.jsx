import React from 'react';
import { useNavigate } from 'react-router-dom'; // Importa useNavigate

const CartMenu = ({ cartItems, onClose, onAddToCart, onRemoveFromCart, onReduceQuantity }) => {
  const navigate = useNavigate(); // Inicializa la navegación
  const total = cartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0).toFixed(2);

  return (
    <div className="cart-menu-overlay" onClick={onClose}>
      {/* Usamos e.stopPropagation() para que al dar clic dentro, no se cierre */}
      <div className="cart-menu" onClick={(e) => e.stopPropagation()}>
        <div className="cart-header">
          <h2>Tu Carrito</h2>
          <button className="close-button" onClick={onClose}>✕</button>
        </div>

        {cartItems.length === 0 ? (
          <p className="empty-msg">Tu carrito está vacío.</p>
        ) : (
          <ul className="cart-items-list">
            {cartItems.map(item => (
              <li key={item.product.id} className="cart-item">
                <span className="cart-item-name">{item.product.name}</span>
                <div className="quantity-controls">
                  <button onClick={() => onReduceQuantity(item.product.id)}>-</button>
                  <span>{item.quantity}</span>
                  <button onClick={() => onAddToCart(item.product, 1)}>+</button>
                </div>
                <button className="remove-button" onClick={() => onRemoveFromCart(item.product.id)}>Eliminar</button>
              </li>
            ))}
          </ul>
        )}

        <div className="cart-footer">
          <div className="cart-total">
            <strong>Total: ${total}</strong>
          </div>
          <div className="cart-menu-actions">
            <button className="btn-secondary" onClick={onClose}>Seguir Comprando</button>
            <button className="btn-pagar" onClick={() => { onClose(); navigate('/invoice'); }}>
              Finalizar Compra
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartMenu;