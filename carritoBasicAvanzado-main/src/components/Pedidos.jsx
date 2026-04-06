import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Pedidos = () => {
  const [pedidos, setPedidos] = useState([]);
  const userId = localStorage.getItem('userId');

  useEffect(() => {
    const fetchPedidos = async () => {
      try {
        // Asegúrate de incluir las credenciales si es necesario
        const response = await axios.get(`http://localhost:5000/api/pedidos/cliente/${userId}`, { withCredentials: true });
        const sortedPedidos = response.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setPedidos(sortedPedidos);
      } catch (error) {
        console.error('Error al obtener los pedidos', error);
      }
    };

    if (userId) {
      fetchPedidos();
    }
  }, [userId]);

  return (
    <div className="pedidos-container">
      <h2>Mis Pedidos</h2>
      {pedidos.length > 0 ? (
        pedidos.map(pedido => (
          <div key={pedido._id} className="pedido-card">
            <div className="pedido-header">
              <p><strong>ID del Pedido:</strong> {pedido._id}</p>
              <p><strong>Fecha del Pedido:</strong> {new Date(pedido.createdAt).toLocaleDateString()}</p>
              <p><strong className={`estado ${pedido.estado ? pedido.estado.toLowerCase() : 'desconocido'}`}>Estado: {pedido.estado || 'Desconocido'}</strong></p>
              <p><strong>Código de Pago:</strong> {pedido.paymentCode}</p>
            </div>
            <div className="pedido-body">
              <h3>Productos</h3>
              {pedido.pedido.map(item => (
                <div key={item._id} className="pedido-item">
                  <img 
                    src={item.producto?.imagen ? `http://localhost:5000/uploads/${item.producto.imagen}` : 'default-image.png'} 
                    alt={item.producto?.nombre || 'Imagen no disponible'} 
                    className="product-image" 
                  />
                  <div className="item-details">
                    <p><strong>Producto:</strong> {item.producto?.nombre || 'Producto eliminado'}</p>
                    <p><strong>Cantidad:</strong> {item.cantidad}</p>
                    <p><strong>Precio:</strong> ${item.producto?.precio ? item.producto.precio.toFixed(2) : 'N/A'}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="pedido-footer">
              <h3>Información de Envío</h3>
              <p><strong>Nombre:</strong> {pedido.nombreEnvio}</p>
              <p><strong>Teléfono:</strong> {pedido.telefonoEnvio}</p>
              <p><strong>Dirección:</strong> {pedido.direccionEnvio}</p>
              <p><strong>Barrio:</strong> {pedido.barrioEnvio}</p>
              <p><strong>Municipio:</strong> {pedido.municipioEnvio}</p>
              <p><strong>Departamento:</strong> {pedido.departamentoEnvio}</p>
              <p><strong>Total:</strong> ${pedido.total.toFixed(2)}</p>
            </div>
          </div>
        ))
      ) : (
        <p>No tienes pedidos.</p>
      )}
    </div>
  );
};

export default Pedidos;
