import React, { useState } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import './ModalOrders.css';

const ModalOrders = ({ order, setSelectedOrder, setOrders, setFilteredOrders, orders, filteredOrders }) => {
  const [orderToDelete, setOrderToDelete] = useState(null);

  const handleUpdateOrder = async (updatedOrder) => {
    try {
      const response = await axios.put(`http://localhost:5000/api/pedidos/${updatedOrder._id}`, updatedOrder);
      setOrders(orders.map(o => (o._id === updatedOrder._id ? response.data : o)));
      setFilteredOrders(filteredOrders.map(o => (o._id === updatedOrder._id ? response.data : o)));
      setSelectedOrder(null);
    } catch (error) {
      console.error('Error al actualizar el pedido', error);
    }
  };

  const confirmDeleteOrder = () => setOrderToDelete(order._id);
  const handleCloseConfirmation = () => setOrderToDelete(null);

  const handleDeleteOrder = async () => {
    try {
      await axios.delete(`http://localhost:5000/api/pedidos/${orderToDelete}`);
      setOrders(orders.filter(o => o._id !== orderToDelete));
      setFilteredOrders(filteredOrders.filter(o => o._id !== orderToDelete));
      setOrderToDelete(null);
      setSelectedOrder(null);
    } catch (error) {
      console.error('Error al eliminar el pedido', error);
    }
  };

  // Función útil para obtener las iniciales del producto
  const getInitials = (name) => {
    return name ? name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2) : 'P';
  };

  return (
    <div className="modal">
      <div className="modal-contenido">
        <button className="cerrar-boton" onClick={() => setSelectedOrder(null)}>×</button>
        <h3>Actualizar Pedido</h3>

        {/* Zona del formulario fija */}
        <div className="form-fila">
          <label>Estado:
            <select value={order.estado} onChange={(e) => setSelectedOrder({ ...order, estado: e.target.value })} className="estado-select">
              <option value="PENDIENTE">Pendiente</option>
              <option value="PAGADO">Pagado</option>
              <option value="ENVIADO">Enviado</option>
            </select>
          </label>
        </div>

        {/* Zona de lista con scroll */}
        <div className="lista-productos-scroll">
          <h4>Productos del Pedido:</h4>
          {order.pedido?.map((item, index) => (
            <div key={index} className="producto-detalle">
              {/* Lógica de imagen profesional (con fallback) */}
              {item.producto?.imagen ? (
                <img 
                  src={`http://localhost:5000/uploads/${item.producto.imagen}`} 
                  alt={item.producto.nombre}
                  className="foto-producto"
                  onError={(e) => {
                    // Si falla, muestra el recuadro con iniciales
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'flex';
                  }}
                />
              ) : null}
              {/* Recuadro de fallback (iniciales) */}
              <div className="foto-placeholder" style={{ display: item.producto?.imagen ? 'none' : 'flex' }}>
                {getInitials(item.producto?.nombre)}
              </div>
              
              <div className="info-producto">
                <strong>{item.producto?.nombre || "Producto"}</strong>
                <p>Cantidad: {item.cantidad} | Precio: ${item.precio?.toLocaleString('es-CO')}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Zona de botones fija al fondo */}
        <div className="boton-fila">
          <button className="btn-actualizar" onClick={() => handleUpdateOrder(order)}>Actualizar</button>
          <button className="btn-eliminar" onClick={confirmDeleteOrder}>Eliminar</button>
        </div>

        {orderToDelete && (
          <div className="modal-confirmacion">
            <div className="modal-contenido-confirmacion">
              <p>¿Está seguro de eliminar este pedido?</p>
              <div className="boton-confirmacion-fila">
                <button onClick={handleDeleteOrder}>Eliminar</button>
                <button onClick={handleCloseConfirmation}>Cancelar</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

ModalOrders.propTypes = {
  order: PropTypes.object.isRequired,
  setSelectedOrder: PropTypes.func.isRequired,
  setOrders: PropTypes.func.isRequired,
  setFilteredOrders: PropTypes.func.isRequired,
  orders: PropTypes.arrayOf(PropTypes.object).isRequired,
  filteredOrders: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default ModalOrders;