import React from 'react';
import { Link } from 'react-router-dom';

interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  description: string;
  category: string;
}

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  return (
    <div className="card">
      <img
        src={product.image}
        alt={product.name}
        className="card-image"
      />
      
      <div className="card-body">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
          <span className="card-category">
            {product.category}
          </span>
          <span className="card-price">
            ${product.price.toFixed(2)}
          </span>
        </div>
        
        <h3 className="card-title">
          {product.name}
        </h3>
        
        <p className="card-text">
          {product.description}
        </p>
        
        <Link
          to={`/product/${product.id}`}
          className="btn btn-primary"
          style={{ width: '100%', textAlign: 'center' }}
        >
          View Details
        </Link>
      </div>
    </div>
  );
};

export default ProductCard; 