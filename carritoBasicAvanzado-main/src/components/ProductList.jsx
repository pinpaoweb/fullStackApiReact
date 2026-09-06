import React, { useEffect, useState } from 'react';
import Product from './Product';

const ProductList = ({ products: externalProducts, onAddToCart, loading, error }) => {
  // Estados locales para respaldar si no se pasan props externas
  const [internalProducts, setInternalProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [productListError, setProductListError] = useState(null);

  // Efecto para obtener los datos si no vienen por props, apuntando a tu API real en Render
  useEffect(() => {
    const fetchData = async () => {
      // Si ya hay productos externos, no hacemos la llamada duplicada
      if (externalProducts && externalProducts.length > 0) return;

      setIsLoading(true);
      try {
        const response = await fetch('https://apireact1-1.onrender.com/api/productos');
        if (!response.ok) {
          throw new Error('Error al obtener los productos desde el servidor');
        }
        const data = await response.json();
        setInternalProducts(data);
      } catch (err) {
        setProductListError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [externalProducts]);

  // Usar los productos externos si existen, de lo contrario usar los internos
  const currentProducts = externalProducts && externalProducts.length > 0 ? externalProducts : internalProducts;

  // Renderizado según los estados de carga o error
  if (loading || isLoading) {
    return <p>Cargando productos...</p>;
  }

  if (error || productListError) {
    return <p>Error al cargar productos: {error || productListError}</p>;
  }

  return (
    <div className="product-list">
      {currentProducts && currentProducts.length > 0 ? (
        currentProducts.map(product => (
          <Product key={product._id || product.id} product={product} onAddToCart={onAddToCart} />
        ))
      ) : (
        <p>No hay productos disponibles.</p>
      )}
    </div>
  );
};

export default ProductList;