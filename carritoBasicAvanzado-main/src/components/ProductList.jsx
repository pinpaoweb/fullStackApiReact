import React, { useEffect, useState } from 'react'; // Import useState for loading state
import Product from './Product';

const ProductList = ({ products, onAddToCart, loading, error }) => {
  // Add loading and error states
  const [isLoading, setIsLoading] = useState(false);
  const [productListError, setProductListError] = useState(null);

  // Handle potential errors during data fetching (optional)
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Simulate API call or data fetching logic
        const response = await fetch('https://your-api.com/products');
        const data = await response.json();
        setProducts(data); // Update products if data fetching is successful
      } catch (error) {
        setProductListError(error.message); // Set error message if fetching fails
      } finally {
        setIsLoading(false);
      }
    };

    if (!products) { // Fetch data if products are not provided
      fetchData();
    }
  }, [products]); // Update effect only when products change

  // Render based on loading, error, or product list
  if (isLoading) {
    return <p>Cargando productos...</p>;
  }

  if (productListError) {
    return <p>Error al cargar productos: {productListError}</p>;
  }

  return (
    <div className="product-list">
      {products.map(product => (
        <Product key={product.id} product={product} onAddToCart={onAddToCart} />
      ))}
    </div>
  );
};

export default ProductList;
