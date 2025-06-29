import React, { useEffect } from 'react';
import { useSession } from '../context/SessionContext';
import ProductCard from '../components/ProductCard';

// Dummy product data
const products = [
  {
    id: '1',
    name: 'Wireless Bluetooth Headphones',
    price: 89.99,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=300&fit=crop',
    description: 'High-quality wireless headphones with noise cancellation and 30-hour battery life.',
    category: 'Electronics'
  },
  {
    id: '2',
    name: 'Smart Fitness Watch',
    price: 199.99,
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=300&fit=crop',
    description: 'Advanced fitness tracking with heart rate monitor and GPS capabilities.',
    category: 'Electronics'
  },
  {
    id: '3',
    name: 'Organic Cotton T-Shirt',
    price: 29.99,
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=300&fit=crop',
    description: 'Comfortable and sustainable cotton t-shirt available in multiple colors.',
    category: 'Clothing'
  },
  {
    id: '4',
    name: 'Stainless Steel Water Bottle',
    price: 24.99,
    image: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=400&h=300&fit=crop',
    description: 'Insulated water bottle that keeps drinks cold for 24 hours or hot for 12 hours.',
    category: 'Home & Garden'
  },
  {
    id: '5',
    name: 'Wireless Charging Pad',
    price: 39.99,
    image: 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=400&h=300&fit=crop',
    description: 'Fast wireless charging pad compatible with all Qi-enabled devices.',
    category: 'Electronics'
  },
  {
    id: '6',
    name: 'Premium Coffee Maker',
    price: 149.99,
    image: 'https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=400&h=300&fit=crop',
    description: 'Programmable coffee maker with built-in grinder and thermal carafe.',
    category: 'Home & Garden'
  }
];

const Products: React.FC = () => {
  const { dispatch } = useSession();

  useEffect(() => {
    dispatch({ type: 'VISIT_PAGE', page: 'products' });
  }, [dispatch]);

  return (
    <div className="page" style={{ backgroundColor: '#f8fafc' }}>
      <div className="container">
        <div className="page-header">
          <h1 className="page-title">
            🛍️ Our Products
          </h1>
          <p className="page-subtitle">
            Browse our selection of high-quality products
          </p>
        </div>

        <div className="grid grid-cols-3">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        <div style={{ textAlign: 'center', marginTop: '3rem' }}>
          <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>
            Session data is being tracked as you browse products
          </p>
        </div>
      </div>
    </div>
  );
};

export default Products; 