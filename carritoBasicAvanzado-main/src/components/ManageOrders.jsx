import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ModalOrders from './ModalOrders.jsx';

// Define el componente ManageOrders
const ManageOrders = () => {
  // Declara los estados del componente
  const [orders, setOrders] = useState([]); // Estado para almacenar todos los pedidos
  const [filteredOrders, setFilteredOrders] = useState([]); // Estado para almacenar los pedidos filtrados
  const [searchTerm, setSearchTerm] = useState(''); // Estado para almacenar el término de búsqueda
  const [selectedOrder, setSelectedOrder] = useState(null); // Estado para almacenar el pedido seleccionado

  // useEffect para obtener los pedidos al montar el componente
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        // Realiza una solicitud GET a la API para obtener los pedidos
        const response = await axios.get('http://localhost:5000/api/pedidos', { withCredentials: true });
        // Ordena los pedidos por fecha de creación en orden descendente
        const sortedOrders = response.data
          .filter(order => order.cliente && order.estado) // Filtra pedidos sin cliente o estado
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setOrders(sortedOrders); // Actualiza el estado de los pedidos
        setFilteredOrders(sortedOrders); // Actualiza el estado de los pedidos filtrados
      } catch (error) {
        console.error('Error al obtener los pedidos', error); // Maneja los errores de la solicitud
      }
    };

    fetchOrders(); // Llama a la función para obtener los pedidos
  }, []); // Dependencia vacía para ejecutar el efecto solo una vez

  // Maneja la búsqueda de pedidos
  const handleSearch = (event) => {
    const term = event.target.value.toLowerCase(); // Obtiene el término de búsqueda en minúsculas
    setSearchTerm(term); // Actualiza el estado del término de búsqueda
    // Filtra los pedidos según el nombre del cliente o el estado
    const filtered = orders.filter(order => 
      (order.cliente && order.cliente.username.toLowerCase().includes(term)) || 
      (order.estado && order.estado.toLowerCase().includes(term))
    );
    setFilteredOrders(filtered); // Actualiza el estado de los pedidos filtrados
  };

  // Renderiza el componente
  return (
    <div className="gestionar-pedidos-contenedor">
      <h2>Gestionar Pedidos</h2>
      {/* Campo de entrada para buscar pedidos */}
      <input
        type="text"
        placeholder="Buscar por nombre de cliente o estado"
        value={searchTerm}
        onChange={handleSearch}
        className="buscar-input"
      />
      <div className="pedidos-lista">
        {/* Mapea los pedidos filtrados para mostrarlos */}
        {filteredOrders.length > 0 ? (
          filteredOrders.map(order => (
            <div key={order._id} className={`pedido-tarjeta`} onClick={() => setSelectedOrder(order)}>
              <p><strong>ID del Pedido:</strong> {order._id}</p>
              <p><strong>Cliente:</strong> {order.cliente ? order.cliente.username : 'Desconocido'}</p>
              <p><strong>Estado:</strong> <span className={`estado estado-${order.estado ? order.estado.toLowerCase() : 'desconocido'}`}>{order.estado || 'Desconocido'}</span></p>
              <p><strong>Código de Pago:</strong> {order.paymentCode}</p>
              <p><strong>Total:</strong> ${order.total.toFixed(2)}</p>
            </div>
          ))
        ) : (
          <p>No se encontraron pedidos.</p>
        )}
      </div>
      {/* Muestra el modal si hay un pedido seleccionado */}
      {selectedOrder && (
        <ModalOrders 
          order={selectedOrder} 
          setSelectedOrder={setSelectedOrder} 
          setOrders={setOrders} 
          setFilteredOrders={setFilteredOrders} 
          orders={orders} 
          filteredOrders={filteredOrders} 
        />
      )}
    </div>
  );
};

export default ManageOrders;
