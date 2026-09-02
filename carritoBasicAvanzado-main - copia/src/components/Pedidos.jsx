import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Pedidos = () => {
  const [pedidos, setPedidos] = useState([]);
  const [productos, setProductos] = useState([]);
  const userId = localStorage.getItem('userId');
  const token = localStorage.getItem('token');
  
  const API_URL = window.location.hostname === 'localhost' 
  ? "http://localhost:5000" // Entorno de desarrollo local
  : "https://react1api.vercel.app"; // Entorno de producción (en línea)
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [resPedidos, resProductos] = await Promise.all([
          axios.get(`${API_URL}/api/pedidos/cliente/${userId}`, { 
            headers: { Authorization: `Bearer ${token}` }
          }),
          axios.get(`${API_URL}/api/productos`)
        ]);
        setPedidos(resPedidos.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
        setProductos(resProductos.data);
      } catch (error) {
        console.error('Error al obtener datos', error);
      }
    };
    if (userId) fetchData();
  }, [userId, token]);

  return (
    <div className="pedidos-container">
      <h2>Mis Pedidos</h2>
      {pedidos.map(pedido => (
        <div key={pedido._id} className="pedido-card">
          <div className="pedido-header">
            <p><strong>ID del Pedido:</strong> {pedido._id}</p>
            <p><strong>Fecha:</strong> {new Date(pedido.createdAt).toLocaleDateString()}</p>
            <p className="estado-badge">Estado: <strong>{pedido.estado || 'PROCESANDO'}</strong></p>
            <p><strong>Código de Pago:</strong> {pedido.paymentCode || 'N/A'}</p>
          </div>

          <hr />
          <h4>Productos</h4>

          {pedido.pedido?.map(item => {
            const idBuscado = item.producto?._id || item.producto;
            const productoDetallado = productos.find(p => p._id === idBuscado);

            return (
              <div key={item._id} className="pedido-item">
                <img 
                  src={`${API_URL}/uploads/${productoDetallado?.imagen || item.producto?.imagen || 'default.png'}`} 
                  alt={productoDetallado?.nombre || "Producto"} 
                  className="product-image" 
                />
                <div className="pedido-info">
                  <h4>{productoDetallado?.nombre || item.producto?.nombre}</h4>
                  <p>Cantidad: {item.cantidad}</p>
                  <p>Precio: ${Number(item.precio || productoDetallado?.precio || 0).toLocaleString('es-CO')}</p>
                </div>
              </div>
            );
          })}

          <div className="pedido-envio">
            <h4>Información de Envío</h4>
            {/* Estructura mejorada con Grid */}
            <div className="info-envio-grid">
              <p><strong>Nombre:</strong> {pedido.nombreEnvio || pedido.usuario?.nombre}</p>
              <p><strong>Dirección:</strong> {pedido.direccionEnvio}</p>
              <p><strong>Barrio:</strong> {pedido.barrioEnvio}</p>
              <p><strong>Municipio:</strong> {pedido.municipioEnvio}</p>
              <p><strong>Departamento:</strong> {pedido.departamentoEnvio}</p>
            </div>
            <p className="total-precio"><strong>Total:</strong> ${Number(pedido.total || 0).toLocaleString('es-CO')}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Pedidos;