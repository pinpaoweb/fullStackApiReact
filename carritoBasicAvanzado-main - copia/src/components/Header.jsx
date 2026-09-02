import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // IMPORTANTE: Link debe importarse aquí
import PropTypes from 'prop-types';
import "../App.css";

const Header = ({ cartCount }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState({
    username: localStorage.getItem('username'),
    role: localStorage.getItem('role')
  });

  useEffect(() => {
    const updateHeader = () => {
      setUser({
        username: localStorage.getItem('username'),
        role: localStorage.getItem('role')
      });
    };

    window.addEventListener('storage', updateHeader);
    window.addEventListener('user-login', updateHeader);

    return () => {
      window.removeEventListener('storage', updateHeader);
      window.removeEventListener('user-login', updateHeader);
    };
  }, []);

  const handleLogout = (e) => {
    e.preventDefault();
    localStorage.clear(); 
    setUser({ username: null, role: null });
    window.dispatchEvent(new CustomEvent('user-login'));
    navigate('/');
  };

  return (
    <header className="header">
      <h1 style={{ color: '#FF8C00' }}>PINPAO</h1>
      <nav>
        <Link to="/">Inicio</Link>
        <Link to="/imc">Calculadora IMC</Link>
        <Link to="/cart">Carrito ({cartCount})</Link>
        <Link to="/sales-report">Reporte de Ventas</Link>
        
        {user.role === 'admin' && (
          <>
            <Link to="/manage-products">G. Productos</Link>
            <Link to="/manage-orders">G. Pedidos</Link>
          </>
        )}

        {user.username ? (
          <>
            <Link to="/pedidos">Mis Pedidos</Link>
            <span style={{ marginLeft: '10px' }}>
              <Link to="/update-user">Bienvenido, {user.username} ({user.role})</Link>
            </span>
            <button onClick={handleLogout} style={{ marginLeft: '10px' }}>
              Cerrar Sesión
            </button>
          </>
        ) : (
          <>
            <Link to="/register">Registro</Link>
            <Link to="/login">Ingresar</Link>
          </>
        )}
      </nav>
    </header>
  );
};

Header.propTypes = {
  cartCount: PropTypes.number.isRequired,
};

export default Header;