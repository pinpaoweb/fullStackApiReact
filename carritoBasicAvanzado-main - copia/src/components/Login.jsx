import React, { useState } from 'react';
import axios from 'axios';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [message, setMessage] = useState('');

  // Detectamos la IP automáticamente para que funcione en cualquier dispositivo
  const API_URL = window.location.hostname === 'localhost' 
    ? 'http://localhost:5000' 
    : `http://${window.location.hostname}:5000`;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // 1. Agregamos { withCredentials: true } para que el celular acepte la sesión/cookie
      const response = await axios.post(`${API_URL}/api/auth/login`, formData, {
        withCredentials: true 
      });
      
      const { token, username, role, userId, email } = response.data;
      
      // 2. Guardado en localStorage
      localStorage.setItem('user', JSON.stringify(response.data));
      localStorage.setItem('username', username);
      localStorage.setItem('role', role);
      localStorage.setItem('token', token);
      localStorage.setItem('userId', userId);
      localStorage.setItem('email', email);
      
      // 3. Disparar eventos de sincronización
      window.dispatchEvent(new Event('storage'));
      window.dispatchEvent(new CustomEvent('user-login'));
      
      setMessage('Login exitoso');

      // 4. Redirección segura
      if (role === 'admin') {
        window.location.href = '/admin';
      } else {
        window.location.href = '/';
      }
      
    } catch (error) {
      console.error("Error en login:", error);
      setMessage(error.response?.data?.error || 'Error en el login. Verifica tu red.');
    }
  };

  return (
    <div className="payment-form">
      <form onSubmit={handleSubmit}>
        <h2>Login</h2>
        {message && <p>{message}</p>}
        <label>
          Email:
          <input type="email" name="email" value={formData.email} onChange={handleChange} required />
        </label>
        <label>
          Password:
          <input type="password" name="password" value={formData.password} onChange={handleChange} required />
        </label>
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;