import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const InvoiceForm = ({ cartItems }) => {
  const [formData, setFormData] = useState({ 
    name: '', 
    email: '', 
    address: '', 
    barrio: '', 
    municipio: '', 
    departamento: '' 
  });
  
  const navigate = useNavigate();

  // URL dinámica según el entorno (Local o Producción)
  const API_URL = window.location.hostname === 'localhost' 
    ? "http://localhost:5000" 
    : "https://react1api.vercel.app";

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // 1. Calculamos el total y generamos el código de pago
      const totalCalculado = cartItems.reduce(
        (sum, item) => sum + item.product.price * item.quantity,
        0
      );
      const codigoPago = Math.floor(Math.random() * 1000000);

      const pedido = {
        cliente: localStorage.getItem('userId') || 'guest',
        pedido: cartItems.map(item => ({
          producto: item.product._id || item.product.id, // Mapeo seguro del ID
          nombre: item.product.name,        
          cantidad: item.quantity,
          precio: item.product.price,       
          imagen: item.product.imagen       
        })),
        total: totalCalculado,
        paymentCode: codigoPago,
        nombreEnvio: formData.name,
        telefonoEnvio: formData.email, 
        direccionEnvio: formData.address,
        barrioEnvio: formData.barrio,
        municipioEnvio: formData.municipio,
        departamentoEnvio: formData.departamento
      };

      console.log("ENVIANDO PEDIDO:", pedido);

      // 2. Enviamos los datos al backend usando la URL dinámica
      await axios.post(`${API_URL}/api/pedidos`, pedido);

      alert('Pedido enviado correctamente');

      // 3. Redirección a la pantalla del PDF pasando los datos
      navigate('/invoice-pdf', {
        state: { 
          ...formData, 
          cartItems, 
          total: totalCalculado, 
          paymentCode: codigoPago 
        }
      });

    } catch (error) {
      console.error('ERROR EN EL FORMULARIO:', error.response?.data || error.message);
      alert('Error al crear pedido');
    }
  };

  return (
    <div className="payment-form">
      <h1>Invoice Form</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Nombres y apellidos completos</label>
          <input type="text" name="name" autoComplete="name" value={formData.name} onChange={handleChange} required />
        </div>
        
        <div>
          <label>Teléfono de contacto</label>
          <input 
            type="tel" 
            name="email" 
            autoComplete="tel" 
            value={formData.email} 
            onChange={handleChange} 
            required 
          />
        </div>

        <div>
          <label>Dirección de residencia</label>
          <input type="text" name="address" autoComplete="address" value={formData.address} onChange={handleChange} required />
        </div>

        <div>
          <label>Barrio</label>
          <input type="text" name="barrio" autoComplete="barrio" value={formData.barrio} onChange={handleChange} required />
        </div>

        <div>
          <label>Municipio</label>
          <input type="text" name="municipio" autoComplete="municipio" value={formData.municipio} onChange={handleChange} required />
        </div>

        <div>
          <label>Departamento</label>
          <input type="text" name="departamento" autoComplete="departamento" value={formData.departamento} onChange={handleChange} required />
        </div>

        <button type="submit">Generar factura</button>
      </form>
    </div>
  );
};

export default InvoiceForm;