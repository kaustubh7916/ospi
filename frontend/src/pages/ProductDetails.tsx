import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSession } from '../context/SessionContext';

// Dummy product data (same as Products page)
const products = [
  {
    id: '1',
    name: 'Wireless Bluetooth Headphones',
    price: 89.99,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=300&fit=crop',
    description: 'High-quality wireless headphones with noise cancellation and 30-hour battery life. Perfect for music lovers and professionals who need crystal clear audio quality. Features include active noise cancellation, touch controls, and a comfortable over-ear design.',
    category: 'Electronics',
    features: ['Active Noise Cancellation', '30-hour Battery Life', 'Touch Controls', 'Bluetooth 5.0', 'Built-in Microphone']
  },
  {
    id: '2',
    name: 'Smart Fitness Watch',
    price: 199.99,
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=300&fit=crop',
    description: 'Advanced fitness tracking with heart rate monitor and GPS capabilities. Track your workouts, monitor your health metrics, and stay connected with smartphone notifications. Water-resistant design perfect for swimming and outdoor activities.',
    category: 'Electronics',
    features: ['Heart Rate Monitor', 'GPS Tracking', 'Water Resistant', 'Sleep Tracking', 'Smartphone Notifications']
  },
  {
    id: '3',
    name: 'Organic Cotton T-Shirt',
    price: 29.99,
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=300&fit=crop',
    description: 'Comfortable and sustainable cotton t-shirt available in multiple colors. Made from 100% organic cotton, this shirt is soft, breathable, and environmentally friendly. Perfect for everyday wear.',
    category: 'Clothing',
    features: ['100% Organic Cotton', 'Multiple Colors', 'Breathable Fabric', 'Sustainable Production', 'Comfortable Fit']
  },
  {
    id: '4',
    name: 'Stainless Steel Water Bottle',
    price: 24.99,
    image: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=400&h=300&fit=crop',
    description: 'Insulated water bottle that keeps drinks cold for 24 hours or hot for 12 hours. Made from premium stainless steel with a vacuum insulation technology. Perfect for outdoor activities and daily hydration.',
    category: 'Home & Garden',
    features: ['24hr Cold Retention', '12hr Hot Retention', 'Stainless Steel', 'BPA Free', 'Leak Proof']
  },
  {
    id: '5',
    name: 'Wireless Charging Pad',
    price: 39.99,
    image: 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=400&h=300&fit=crop',
    description: 'Fast wireless charging pad compatible with all Qi-enabled devices. Sleek design with LED indicator lights and non-slip base. Charges your phone quickly and safely without the hassle of cables.',
    category: 'Electronics',
    features: ['Qi Compatible', 'Fast Charging', 'LED Indicators', 'Non-slip Base', 'Compact Design']
  },
  {
    id: '6',
    name: 'Premium Coffee Maker',
    price: 149.99,
    image: 'https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=400&h=300&fit=crop',
    description: 'Programmable coffee maker with built-in grinder and thermal carafe. Brew the perfect cup of coffee with customizable settings and automatic shut-off. Includes a built-in grinder for fresh coffee beans.',
    category: 'Home & Garden',
    features: ['Built-in Grinder', 'Programmable Timer', 'Thermal Carafe', 'Customizable Settings', 'Auto Shut-off']
  }
];

const ProductDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { dispatch } = useSession();
  const [quantity, setQuantity] = useState(1);

  const product = products.find(p => p.id === id);

  useEffect(() => {
    if (product) {
      dispatch({ type: 'VISIT_PAGE', page: `product-${id}` });
    }
  }, [dispatch, id, product]);

  const handleAddToCart = () => {
    if (product) {
      const cartItem = {
        ...product,
        quantity
      };
      dispatch({ type: 'ADD_TO_CART', product: cartItem });
      navigate('/cart');
    }
  };

  if (!product) {
    return (
      <div className="page">
        <div className="container">
          <div style={{ textAlign: 'center', padding: '2rem' }}>
            <h1>Product not found</h1>
            <button 
              className="btn btn-primary" 
              onClick={() => navigate('/products')}
              style={{ marginTop: '1rem' }}
            >
              Back to Products
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="container">
        <div className="product-details">
          <div>
            <img 
              src={product.image} 
              alt={product.name} 
              className="product-image"
            />
          </div>
          
          <div className="product-info">
            <span className="card-category">{product.category}</span>
            <h1>{product.name}</h1>
            <div className="product-price">${product.price.toFixed(2)}</div>
            <p className="product-description">{product.description}</p>
            
            <div style={{ marginBottom: '2rem' }}>
              <h3 style={{ marginBottom: '1rem', color: '#111827' }}>Key Features:</h3>
              <ul style={{ listStyle: 'none', padding: 0 }}>
                {product.features.map((feature, index) => (
                  <li key={index} style={{ 
                    padding: '0.5rem 0', 
                    borderBottom: '1px solid #e5e7eb',
                    display: 'flex',
                    alignItems: 'center'
                  }}>
                    <span style={{ 
                      color: '#4f46e5', 
                      marginRight: '0.5rem',
                      fontSize: '1.25rem'
                    }}>✓</span>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
            
            <div style={{ marginBottom: '2rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>
                Quantity:
              </label>
              <select 
                value={quantity} 
                onChange={(e) => setQuantity(Number(e.target.value))}
                style={{
                  padding: '0.5rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '0.375rem',
                  fontSize: '1rem',
                  marginRight: '1rem'
                }}
              >
                {[1, 2, 3, 4, 5].map(num => (
                  <option key={num} value={num}>{num}</option>
                ))}
              </select>
            </div>
            
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <button 
                className="btn btn-primary"
                onClick={handleAddToCart}
                style={{ flex: '1', minWidth: '200px' }}
              >
                🛒 Add to Cart
              </button>
              
              <button 
                className="btn btn-secondary"
                onClick={() => navigate('/products')}
                style={{ flex: '1', minWidth: '200px' }}
              >
                ← Back to Products
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails; 