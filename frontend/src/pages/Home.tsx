import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSession } from '../context/SessionContext';

const Home: React.FC = () => {
  const { dispatch } = useSession();

  useEffect(() => {
    // Start the session when user visits home
    dispatch({ type: 'START_SESSION' });
    dispatch({ type: 'VISIT_PAGE', page: 'home' });
  }, [dispatch]);

  return (
    <div className="hero">
      <div className="container">
        <div style={{ textAlign: 'center' }}>
          <div style={{ marginBottom: '2rem' }}>
            <h1 className="hero-title">
              🛒 Welcome to OSPI
            </h1>
            <p className="hero-subtitle">
              Online Shopper Purchase Intention Predictor
            </p>
            <div className="hero-divider"></div>
          </div>

          <div style={{ maxWidth: '48rem', margin: '0 auto 3rem auto' }}>
            <p style={{ fontSize: '1.125rem', color: '#374151', lineHeight: '1.75', marginBottom: '2rem' }}>
              Experience our advanced machine learning system that predicts purchase intentions 
              based on your browsing behavior. Start shopping and see how our AI analyzes 
              your session data in real-time!
            </p>
            
            <div className="feature-grid">
              <div className="feature-card">
                <div className="feature-icon">🎯</div>
                <h3 className="feature-title">Smart Prediction</h3>
                <p className="feature-text">Advanced ML models analyze your behavior patterns</p>
              </div>
              
              <div className="feature-card">
                <div className="feature-icon">📊</div>
                <h3 className="feature-title">Real-time Tracking</h3>
                <p className="feature-text">Session data collected as you browse products</p>
              </div>
              
              <div className="feature-card">
                <div className="feature-icon">🔍</div>
                <h3 className="feature-title">Behavior Analysis</h3>
                <p className="feature-text">Understand what drives purchase decisions</p>
              </div>
            </div>
          </div>

          <Link
            to="/products"
            className="btn btn-primary"
            style={{ 
              fontSize: '1.125rem', 
              padding: '1rem 2rem',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
            }}
          >
            🛍️ Start Shopping
            <svg style={{ marginLeft: '0.5rem', width: '20px', height: '20px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>

          <div style={{ marginTop: '3rem', fontSize: '0.875rem', color: '#6b7280' }}>
            <p>Your session data will be automatically tracked as you browse</p>
            <p>Visit the checkout page to see the ML prediction results</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home; 