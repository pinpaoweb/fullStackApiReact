import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Header = ({ cartCount }) => {
  const [user, setUser] = useState({
    username: localStorage.getItem('username'),
    role: localStorage.getItem('role')
  });
  const navigate = useNavigate();

  const handleLogout = () => {
    ['username', 'token', 'role', 'userId'].forEach(item => localStorage.removeItem(item));
    setUser({ username: null, role: null });
    navigate('/');
  };

  useEffect(() => {
    const handleStorageChange = () => {
      setUser({
        username: localStorage.getItem('username'),
        role: localStorage.getItem('role')
      });
    };

    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  return (
    <header className="header">
      <h1>Aplicación de Carrito de Compras</h1>
      <nav>
        <Link to="/">Inicio</Link>
        <Link to="/cart">Carrito ({cartCount})</Link>
        <Link to="/sales-report">Reporte de Ventas</Link>
        {user.role === 'admin' && <Link to="/manage-products">G. Productos</Link>}
        {user.username ? (
          <>
            <span>Bienvenido, {user.username} ({user.role})</span>
            <Link to="/" onClick={handleLogout}>Cerrar S.</Link>
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

export default Header;
