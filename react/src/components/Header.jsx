import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';

const Header = ({ cartCount }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState({
    username: localStorage.getItem('username'),
    role: localStorage.getItem('role')
  });

  // Escuchar cambios de login en la misma pestaña
  useEffect(() => {
    const handleUserUpdate = () => {
      setUser({
        username: localStorage.getItem('username'),
        role: localStorage.getItem('role')
      });
    };

    window.addEventListener('storage', handleUserUpdate);
    window.addEventListener('user-login', handleUserUpdate);
    return () => {
      window.removeEventListener('storage', handleUserUpdate);
      window.removeEventListener('user-login', handleUserUpdate);
    };
  }, []);

  const handleLogout = (e) => {
    e.preventDefault();
    localStorage.clear();
    setUser({ username: null, role: null });
    window.dispatchEvent(new Event('storage'));
    navigate('/');
  };

  return (
    <header className="mi-header">
      <div className="brand-container">
        <h1>PINPAO</h1>
        <span className="brand-slogan">Natural, Belleza y Vitalidad Online</span>
      </div>
      
      <nav>
        <Link to="/">Inicio</Link>
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
              Bienvenido, {user.username} ({user.role})
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