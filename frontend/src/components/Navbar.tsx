import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useSession } from '../context/SessionContext';

const Navbar: React.FC = () => {
  const location = useLocation();
  const { state } = useSession();
  
  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-brand">
          <span>🛒 OSPI</span>
          <span>Online Shopper Purchase Intention</span>
        </Link>
        
        <ul className="navbar-nav">
          <li>
            <Link
              to="/"
              className={`nav-link ${isActive('/') ? 'active' : ''}`}
            >
              Home
            </Link>
          </li>
          
          <li>
            <Link
              to="/products"
              className={`nav-link ${isActive('/products') ? 'active' : ''}`}
            >
              Products
            </Link>
          </li>
          
          <li>
            <Link
              to="/cart"
              className={`nav-link ${isActive('/cart') ? 'active' : ''}`}
            >
              Cart
              {state.cartItems.length > 0 && (
                <span className="cart-badge">
                  {state.cartItems.length}
                </span>
              )}
            </Link>
          </li>
          
          <li>
            <Link
              to="/checkout"
              className={`nav-link ${isActive('/checkout') ? 'active' : ''}`}
            >
              Checkout
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar; 