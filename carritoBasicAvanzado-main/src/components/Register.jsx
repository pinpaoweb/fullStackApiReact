import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    email: ''
  });
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/auth/register', formData, {
        withCredentials: true // Asegúrate de incluir cookies en solicitudes cruzadas
      });
      setMessage('Registro exitoso');
      localStorage.setItem('username', formData.username);
      window.dispatchEvent(new Event('storage')); // Disparar evento de almacenamiento
      navigate('/');
    } catch (error) {
      setMessage(error.response?.data?.error || 'Error en el registro');
    }
  };

  return (
    <div className="payment-form">
      <form onSubmit={handleSubmit} autoComplete="off">
        <h2>Register</h2>
        {message && <p>{message}</p>}
        <label htmlFor="username">
          Username:
          <input
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            autoComplete="username"
          />
        </label>
        <label htmlFor="email">
          Email:
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            autoComplete="email"
          />
        </label>
        <label htmlFor="password">
          Password:
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            autoComplete="new-password"
          />
        </label>
        <button type="submit">Register</button>
      </form>
    </div>
  );
};

export default Register;
