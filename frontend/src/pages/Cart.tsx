import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSession } from '../context/SessionContext';
import CartItem from '../components/CartItem';

const Cart: React.FC = () => {
  const navigate = useNavigate();
  const { state, dispatch } = useSession();

  useEffect(() => {
    dispatch({ type: 'VISIT_PAGE', page: 'cart' });
  }, [dispatch]);

  const total = state.cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  if (state.cartItems.length === 0) {
    return (
      <div className="page">
        <div className="container">
          <div className="page-header">
            <h1 className="page-title">🛒 Your Cart</h1>
            <p className="page-subtitle">Your shopping cart is empty</p>
          </div>
          
          <div style={{ textAlign: 'center', padding: '3rem 0' }}>
            <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🛍️</div>
            <h2 style={{ marginBottom: '1rem', color: '#374151' }}>Your cart is empty</h2>
            <p style={{ color: '#6b7280', marginBottom: '2rem' }}>
              Looks like you haven't added any products to your cart yet.
            </p>
            <button 
              className="btn btn-primary"
              onClick={() => navigate('/products')}
            >
              Start Shopping
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="container">
        <div className="page-header">
          <h1 className="page-title">🛒 Your Cart</h1>
          <p className="page-subtitle">
            {state.cartItems.length} item{state.cartItems.length !== 1 ? 's' : ''} in your cart
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
          <div>
            <h2 style={{ marginBottom: '1.5rem', color: '#111827' }}>Cart Items</h2>
            {state.cartItems.map((item) => (
              <CartItem key={item.id} item={item} />
            ))}
          </div>

          <div>
            <div className="cart-total">
              <h3 style={{ marginBottom: '1rem', color: '#111827' }}>Order Summary</h3>
              
              <div style={{ marginBottom: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <span>Subtotal:</span>
                  <span>${total.toFixed(2)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <span>Shipping:</span>
                  <span>Free</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <span>Tax:</span>
                  <span>${(total * 0.08).toFixed(2)}</span>
                </div>
                <hr style={{ margin: '1rem 0', border: 'none', borderTop: '1px solid #e5e7eb' }} />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', fontSize: '1.125rem' }}>
                  <span>Total:</span>
                  <span>${(total * 1.08).toFixed(2)}</span>
                </div>
              </div>

              <button 
                className="btn btn-primary"
                onClick={() => navigate('/checkout')}
                style={{ width: '100%', marginBottom: '1rem' }}
              >
                Proceed to Checkout
              </button>
              
              <button 
                className="btn btn-secondary"
                onClick={() => navigate('/products')}
                style={{ width: '100%' }}
              >
                Continue Shopping
              </button>
            </div>

            <div style={{ 
              marginTop: '2rem', 
              padding: '1rem', 
              backgroundColor: '#f8fafc', 
              borderRadius: '0.5rem',
              border: '1px solid #e5e7eb'
            }}>
              <h4 style={{ marginBottom: '0.5rem', color: '#111827' }}>💡 Session Tracking</h4>
              <p style={{ fontSize: '0.875rem', color: '#6b7280', margin: 0 }}>
                Your browsing behavior is being tracked for ML analysis. 
                Visit checkout to see the purchase prediction!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart; 