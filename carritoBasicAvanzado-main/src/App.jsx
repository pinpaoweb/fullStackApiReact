import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import Header from './components/Header';
import ProductList from './components/ProductList';
import CartMenu from './components/CartMenu';
import CartPage from './components/CartPage';
import SalesReport from './components/SalesReport';
import InvoiceForm from './components/InvoiceForm';
import InvoicePDF from './components/InvoicePDF';
import axios from 'axios';
import Register from './components/Register';
import Login from './components/Login';
import ManageProducts from './components/ManageProducts'; // Asegúrate de la ruta correcta
import Pedidos from './components/Pedidos';
import ManageOrders from './components/ManageOrders';
import UpdateUser from './components/UpdateUser';

const initialProducts = [];
const initialSalesData = [];

const logout = async () => {
  try {
    await axios.post('http://localhost:5000/api/logout');
    localStorage.removeItem('token');
    window.location.href = '/login';
  } catch (error) {
    console.error('Error al cerrar sesión:', error);
  }
};

const mapProductData = (product) => {
  return {
    id: product._id,
    name: product.nombre,
    price: product.precio,
    imagen: product.imagen,
  };
};


const App = () => {
  const [products, setProducts] = useState(initialProducts);
  const [salesData] = useState(initialSalesData);
  const [cartItems, setCartItems] = useState([]);
  const [showCartMenu, setShowCartMenu] = useState(false);
  const [paymentInfo, setPaymentInfo] = useState({});
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/productos', { withCredentials: true });
        const mappedProducts = response.data.map(mapProductData);
        setProducts(mappedProducts);
      } catch (error) {
        console.error('Error al obtener los productos', error);
      }
    };

    if (location.pathname === '/') {
      fetchProducts();
    }
  }, [location.pathname]);

  const handleAddToCart = (product, quantity) => {
    const existingItem = cartItems.find(item => item.product.id === product.id);
    if (existingItem) {
      setCartItems(cartItems.map(item =>
        item.product.id === product.id
          ? { ...item, quantity: item.quantity + quantity }
          : item
      ));
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
      setCartItems(cartItems.map(item =>
        item.product.id === productId
          ? { ...item, quantity: item.quantity - 1 }
          : item
      ));
    } else {
      handleRemoveFromCart(productId);
    }
  };

  const handleCloseCartMenu = () => {
    setShowCartMenu(false);
  };

  const handlePaymentInfo = (info) => {
    setPaymentInfo(info);
  };

  const PrivateRoute = ({ children }) => {
    const role = localStorage.getItem('role');
    return role === 'admin' ? children : <div>No tienes acceso a esta página</div>;
  };

  return (
    <div className="app">
      <Header cartCount={cartItems.length} />
      <Routes>
        <Route path="/" element={<ProductList products={products} onAddToCart={handleAddToCart} />} />
        <Route path="/cart" element={<CartPage
          cartItems={cartItems}
          onAddToCart={handleAddToCart}
          onRemoveFromCart={handleRemoveFromCart}
          onReduceQuantity={handleReduceQuantity}
        />} />
        <Route path="/sales-report" element={<SalesReport data={salesData} />} />
        <Route path="/invoice" element={<InvoiceForm cartItems={cartItems} />} />
        <Route path="/invoice-pdf" element={<InvoicePDF />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/manage-products" element={<PrivateRoute><ManageProducts /></PrivateRoute>} />
        <Route path="/pedidos" element={<Pedidos />} />
        <Route path="/manage-orders" element={<PrivateRoute><ManageOrders /></PrivateRoute>} />
        <Route path="/update-user" element={<UpdateUser />} />
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
