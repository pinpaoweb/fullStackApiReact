import Product from './Product';


const ProductList = ({ products = [], onAddToCart }) => {
  return (
    <div className="product-list">
      {products.map((product) => (
        <Product
          key={product.id}   // 🔥 IMPORTANTE: NO _id
          product={product}
          onAddToCart={onAddToCart}
        />
      ))}
    </div>
  );
};

export default ProductList;