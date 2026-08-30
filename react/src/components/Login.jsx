import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', formData);
      
      const { token, username, role, userId, email } = response.data;

      // Guardamos en localStorage
      localStorage.setItem('token', token);
      localStorage.setItem('username', username);
      localStorage.setItem('role', role);
      localStorage.setItem('userId', userId);
      localStorage.setItem('email', email);

      // Disparamos el evento para que Header.jsx se actualice SIN bucles
      //window.dispatchEvent(new Event('authChange'));

      setMessage('Login exitoso');
      
      // Redirección segura
      if (role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/');
      }
    } catch (error) {
      // Manejo de errores más descriptivo
      console.error("Error en login:", error);
      setMessage(error.response?.data?.error || 'Error al iniciar sesión');
    }
  };
  
  return (
    <div className="payment-form">
      <form onSubmit={handleSubmit}>
        <h2>Login</h2>
        {message && <p style={{ color: message.includes('exitoso') ? 'green' : 'red' }}>{message}</p>}
        <label>
          Email:
          <input 
            type="email" 
            name="email" 
            value={formData.email} 
            onChange={handleChange} 
            required 
          />
        </label>
        <label>
          Password:
          <input 
            type="password" 
            name="password" 
            value={formData.password} 
            onChange={handleChange} 
            required 
          />
        </label>
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;