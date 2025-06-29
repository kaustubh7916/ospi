import React from 'react';
import { useSession } from '../context/SessionContext';

interface CartItemProps {
  item: {
    id: string;
    name: string;
    price: number;
    image: string;
    quantity: number;
  };
}

const CartItem: React.FC<CartItemProps> = ({ item }) => {
  const { dispatch } = useSession();

  const handleRemove = () => {
    dispatch({ type: 'REMOVE_FROM_CART', productId: item.id });
  };

  return (
    <div className="cart-item">
      <img
        src={item.image}
        alt={item.name}
        className="cart-item-image"
      />
      
      <div className="cart-item-info">
        <h3 className="cart-item-title">{item.name}</h3>
        <p className="cart-item-price">Quantity: {item.quantity}</p>
      </div>
      
      <div style={{ textAlign: 'right' }}>
        <p style={{ fontSize: '1.125rem', fontWeight: 'bold', color: '#111827' }}>
          ${(item.price * item.quantity).toFixed(2)}
        </p>
        <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>${item.price.toFixed(2)} each</p>
      </div>
      
      <button
        onClick={handleRemove}
        style={{ 
          color: '#ef4444', 
          background: 'none', 
          border: 'none', 
          cursor: 'pointer',
          padding: '0.25rem'
        }}
        onMouseOver={(e) => e.currentTarget.style.color = '#dc2626'}
        onMouseOut={(e) => e.currentTarget.style.color = '#ef4444'}
      >
        <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
      </button>
    </div>
  );
};

export default CartItem; 