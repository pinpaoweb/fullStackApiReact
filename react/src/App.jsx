
import { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import PropTypes from 'prop-types';
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

const App = () => {
  const [products, setProducts] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const [showCartMenu, setShowCartMenu] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/productos');
        const mappedProducts = response.data.map(p => ({
          id: p._id,
          name: p.nombre,
          price: p.precio,
          imagen: p.imagen
        }));
        setProducts(mappedProducts);
      } catch (error) {
        console.error('Error al obtener productos', error);
      }
    };
    fetchProducts();
  }, []);

  const handleAddToCart = (product, quantity) => {
    const existingItem = cartItems.find(item => item.product.id === product.id);
    if (existingItem) {
      setCartItems(cartItems.map(item => item.product.id === product.id ? { ...item, quantity: item.quantity + quantity } : item));
    } else {
      setCartItems([...cartItems, { product, quantity }]);
    }
    setShowCartMenu(true);
  };

  const handleRemoveFromCart = (productId) => {
    setCartItems(cartItems.filter(item => item.product.id !== productId));
  };

  const handleReduceQuantity = (productId) => {
    const existingItem = cartItems.find(item => item.product.id === productId);
    if (existingItem.quantity > 1) {
      setCartItems(cartItems.map(item => item.product.id === productId ? { ...item, quantity: item.quantity - 1 } : item));
    } else {
      handleRemoveFromCart(productId);
    }
  };

  const handleCloseCartMenu = () => setShowCartMenu(false);

  const PrivateRoute = ({ children }) => {
    const role = localStorage.getItem('role');
    return role === 'admin' ? children : <div>No tienes acceso a esta página</div>;
  };

  // Validamos children aquí para satisfacer a ESLint
  PrivateRoute.propTypes = {
    children: PropTypes.node.isRequired,
  };

  return (
    <div className="app">
      <Header cartCount={cartItems.length} />

      <Routes>
        <Route path="/" element={
          <main>
            <section className="hero-section">
              <div className="hero-overlay">
                <h1>Natural, Belleza y Vitalidad Online</h1>
                <p>Encuentra tu equilibrio perfecto. Nutrición, energía y cuidado personal para llevar tu día a un nuevo nivel.</p>
                <a href="#catalogo" className="btn-hero">Explorar Catálogo</a>
              </div>
            </section>
            <div id="catalogo">
              <ProductList products={products} onAddToCart={handleAddToCart} />
            </div>
          </main>
        } />
        
        <Route path="/cart" element={<CartPage cartItems={cartItems} onRemoveFromCart={handleRemoveFromCart} onReduceQuantity={handleReduceQuantity} />} />
        <Route path="/sales-report" element={<SalesReport data={[]} />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/manage-products" element={<PrivateRoute><ManageProducts /></PrivateRoute>} />
        <Route path="/pedidos" element={<Pedidos />} />
        <Route path="/manage-orders" element={<PrivateRoute><ManageOrders /></PrivateRoute>} />
        <Route path="/update-user" element={<UpdateUser />} />
        <Route path="/invoice" element={<InvoiceForm cartItems={cartItems} />} />
        <Route path="/invoice-pdf" element={<InvoicePDF />} />
      </Routes>

      {showCartMenu && (
        <CartMenu 
          cartItems={cartItems} 
          onClose={handleCloseCartMenu} 
          onAddToCart={handleAddToCart}
          onRemoveFromCart={handleRemoveFromCart}
          onReduceQuantity={handleReduceQuantity}
        />
      )}
    </div>
  );
};

export default App;


