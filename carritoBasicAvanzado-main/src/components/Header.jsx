import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Header = ({ cartCount }) => {
  const [user, setUser] = useState({
    username: localStorage.getItem('username'),
    role: localStorage.getItem('role')
  });
  const navigate = useNavigate();

  // Función para manejar el cierre de sesión
  const handleLogout = () => {
    // Elimina los datos del usuario del almacenamiento local
    ['username', 'token', 'role', 'userId'].forEach(item => localStorage.removeItem(item));
    // Actualiza el estado del usuario
    setUser({ username: null, role: null });
    // Redirige al usuario a la página de inicio
    navigate('/');
  };

  useEffect(() => {
    // Actualiza el estado del usuario cuando el componente se monta
    setUser({
      username: localStorage.getItem('username'),
      role: localStorage.getItem('role')
    });

    // Maneja el evento de cambio en el almacenamiento local
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
      <h1>SGCI</h1>
      <nav>
        <Link to="/">Inicio</Link>
        <Link to="/cart">Carrito ({cartCount})</Link>
        <Link to="/sales-report">Reporte de Ventas</Link>
        {user.role === 'admin' && <Link to="/manage-products">G. Productos</Link>}
        {user.role === 'admin' && <Link to="/manage-orders">G. Pedidos</Link>}
        {user.username ? (
          <>
            <Link to="/pedidos">Mis Pedidos</Link>
            <span> <Link to="/update-user">Bienvenido, {user.username} ({user.role})</Link></span>
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
