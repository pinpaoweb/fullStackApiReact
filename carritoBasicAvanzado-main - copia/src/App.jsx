import React, { useState, useEffect } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import axios from 'axios';

// Componentes
import Header from './components/Header';
import ProductList from './components/ProductList';
import CartMenu from './components/CartMenu';
import CartPage from './components/CartPage';
import SalesReport from './components/SalesReport';
import InvoiceForm from './components/InvoiceForm';
import InvoicePDF from './components/InvoicePDF';
import Register from './components/Register';
import Login from './components/Login';
import ManageProducts from './components/ManageProducts';
import Pedidos from './components/Pedidos';
import ManageOrders from './components/ManageOrders';
import UpdateUser from './components/UpdateUser';
import AdminDashboard from './components/AdminDashboard';
import ProtectedRoute from './components/ProtectedRoute';
import EnviosSeguros from './components/EnviosSeguros';
import ComponentesNaturales from './components/ComponentesNaturales';
import AsesoriaPersonal from './components/AsesoriaPersonal';
import EnergiaRendimiento from './components/EnergiaRendimiento';
import Layout from './components/Layout';
import CalculadoraIMC from './components/CalculadoraIMC';

import './index.css';

// Definimos la base fuera del componente
const API_BASE = window.location.hostname === 'localhost' 
  ? 'http://localhost:5000' 
  : 'http://192.168.1.40:5000';

const mapProductData = (product) => {
  return {
    id: product._id,
    name: product.nombre,
    price: product.precio,
    imagen: product.imagen,
    descripcion: product.descripcion
  };
};

const App = () => {
  const [products, setProducts] = useState([]);
  const [salesData, setSalesData] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const [showCartMenu, setShowCartMenu] = useState(false);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Usamos API_BASE en todas las llamadas
        const resProd = await axios.get(`${API_BASE}/api/productos`, { withCredentials: true });
        setProducts(resProd.data.map(mapProductData));

        const resSales = await axios.get(`${API_BASE}/api/sales`);
        const ventasFormateadas = resSales.data.map((venta) => {
          let fecha = venta.date || venta.createdAt || venta.fecha;
          let fechaValida = fecha ? new Date(fecha) : new Date();
          return {
            ...venta,
            date: fechaValida.toISOString().split('T')[0],
            total: Number(venta.total) || 0
          };
        });
        setSalesData(ventasFormateadas);
      } catch (err) {
        console.error('Error en carga inicial:', err);
      }
    };
    fetchData();
  }, []);

  const handleAddToCart = (product, quantity) => {
    setCartItems(prev => {
      const found = prev.find(i => i.product.id === product.id);
      if (found) return prev.map(i => i.product.id === product.id ? { ...i, quantity: i.quantity + quantity } : i);
      return [...prev, { product, quantity }];
    });
    setShowCartMenu(true);
  };

  const handleRemoveFromCart = (id) => setCartItems(prev => prev.filter(i => i.product.id !== id));
  const handleReduceQuantity = (id) => setCartItems(prev => prev.map(i => i.product.id === id ? { ...i, quantity: Math.max(1, i.quantity - 1) } : i));

  return (
    <div className="app">
      <Header cartCount={cartItems.length} />
      
      <Routes>
  {/* Ruta de Inicio completa */}
  <Route path="/" element={
    <Layout>
      <section className="hero-section">
        <div className="hero-overlay">
          <div className="hero-content">
            <h1>Natural Belleza y Vitalidad Online</h1>
            <p>Encuentra tu equilibrio perfecto.</p>
            <a href="#catalogo" className="btn-hero">Explorar Catálogo</a>
          </div>
        </div>
      </section>

      <section className="benefits-bar">
        <Link to="/envios" className="benefit-item">📦 Envíos Seguros</Link>
        <Link to="/componentes" className="benefit-item">🌿 Componentes Naturales</Link>
        <Link to="/asesoria" className="benefit-item">💬 Asesoría Personal</Link>
        <Link to="/energia" className="benefit-item">⚡ Energía y Rendimiento</Link>
      </section>

      <div id="catalogo" className="catalogo-container">
        <h2 className="titulo-catalogo">Nuestros Productos Estrella</h2>
        <ProductList products={products} onAddToCart={handleAddToCart} />
        <div className="btn-container-volver">
          <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="btn-volver">
            ⬅ Volver al Inicio
          </button>
        </div>
      </div>
    </Layout>
  } />

  {/* Rutas Públicas */}
  <Route path="/cart" element={<Layout><CartPage cartItems={cartItems} onAddToCart={handleAddToCart} onRemoveFromCart={handleRemoveFromCart} onReduceQuantity={handleReduceQuantity} /></Layout>} />
  <Route path="/register" element={<Layout><Register /></Layout>} />
  <Route path="/login" element={<Layout><Login /></Layout>} />
  <Route path="/envios" element={<Layout><EnviosSeguros /></Layout>} />
  <Route path="/componentes" element={<Layout><ComponentesNaturales /></Layout>} />
  <Route path="/asesoria" element={<Layout><AsesoriaPersonal /></Layout>} />
  <Route path="/energia" element={<Layout><EnergiaRendimiento /></Layout>} />

  {/* Rutas Protegidas (Solo Usuarios Registrados) */}
  <Route path="/pedidos" element={<ProtectedRoute><Layout><Pedidos /></Layout></ProtectedRoute>} />
  <Route path="/update-user" element={<ProtectedRoute><Layout><UpdateUser /></Layout></ProtectedRoute>} />
  <Route path="/invoice" element={<ProtectedRoute><Layout><InvoiceForm cartItems={cartItems} /></Layout></ProtectedRoute>} />
  <Route path="/invoice-pdf" element={<ProtectedRoute><Layout><InvoicePDF /></Layout></ProtectedRoute>} />

  {/* Rutas Protegidas (Solo Administradores) */}
  <Route path="/admin" element={<ProtectedRoute allowedRole="admin"><Layout><AdminDashboard /></Layout></ProtectedRoute>} />
  <Route path="/admin/orders" element={<ProtectedRoute allowedRole="admin"><Layout><ManageOrders /></Layout></ProtectedRoute>} />
  <Route path="/sales-report" element={<ProtectedRoute allowedRole="admin"><Layout><SalesReport data={salesData} /></Layout></ProtectedRoute>} />
  <Route path="/manage-products" element={<ProtectedRoute allowedRole="admin"><Layout><ManageProducts /></Layout></ProtectedRoute>} />
  <Route path="/manage-orders" element={<ProtectedRoute allowedRole="admin"><Layout><ManageOrders /></Layout></ProtectedRoute>} />
  <Route path="/imc" element={<ProtectedRoute><Layout><CalculadoraIMC /></Layout></ProtectedRoute>} />
</Routes>
      
      {showCartMenu && (
        <CartMenu 
          cartItems={cartItems} 
          onClose={() => setShowCartMenu(false)} 
          onAddToCart={handleAddToCart} 
          onRemoveFromCart={handleRemoveFromCart} 
          onReduceQuantity={handleReduceQuantity} 
        />
      )}
    </div>
  );
};

export default App;