import PropTypes from 'prop-types';
import Product from './Product';

const ProductList = ({ products, onAddToCart }) => (
  <div className="product-list">
    {products.map(product => (
      <Product 
        key={product.id} 
        product={product} 
        onAddToCart={onAddToCart} 
      />
    ))}
  </div>
);

ProductList.propTypes = {
  products: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    // Puedes agregar aquí otros campos si los usas, como nombre o precio
  })).isRequired,
  onAddToCart: PropTypes.func.isRequired,
};

export default ProductList;