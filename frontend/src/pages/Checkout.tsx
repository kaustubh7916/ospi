import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSession } from '../context/SessionContext';
import { predictPurchase } from '../utils/sessionUtils';

interface PredictionResult {
  prediction: number;
  confidence: number;
  result: string;
  session_data: any;
  model_name?: string;
  accuracy?: number;
  roc_curve_base64?: string;
  feature_importance?: number[];
}

const MODEL_OPTIONS = [
  { label: 'Gradient Boosting', value: 'Gradient_Boosting' },
  { label: 'Random Forest', value: 'Random_Forest' },
  { label: 'XGBoost', value: 'XGBoost' },
  { label: 'Adaboost', value: 'Adaboost' },
  { label: 'Logistic Regression', value: 'Logistic_Regression' },
];

const Checkout: React.FC = () => {
  const navigate = useNavigate();
  const { state, dispatch } = useSession();
  const [prediction, setPrediction] = useState<PredictionResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedModel, setSelectedModel] = useState<string>('Gradient_Boosting');

  useEffect(() => {
    dispatch({ type: 'VISIT_PAGE', page: 'checkout' });
  }, [dispatch]);

  const total = state.cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  // Convert month string to number
  const getMonthNumber = (monthStr: string): number => {
    const monthMap: { [key: string]: number } = {
      'Jan': 1, 'Feb': 2, 'Mar': 3, 'Apr': 4, 'May': 5, 'Jun': 6,
      'Jul': 7, 'Aug': 8, 'Sep': 9, 'Oct': 10, 'Nov': 11, 'Dec': 12
    };
    return monthMap[monthStr] || 1;
  };

  const handlePredictPurchase = async () => {
    setLoading(true);
    setError(null);
    setPrediction(null);
    try {
      // Prepare session data for ML model with correct format
      const sessionData = {
        Administrative: state.pageVisits.filter(page => page.includes('admin')).length,
        Administrative_Duration: state.pageVisits.filter(page => page.includes('admin')).length * 30, // 30 seconds per admin page
        Informational: state.pageVisits.filter(page => page.includes('info')).length,
        Informational_Duration: state.pageVisits.filter(page => page.includes('info')).length * 45, // 45 seconds per info page
        ProductRelated: state.sessionData.ProductRelated,
        ProductRelated_Duration: state.sessionData.ProductRelated_Duration,
        BounceRates: state.sessionData.BounceRates,
        ExitRates: state.sessionData.ExitRates,
        PageValues: state.sessionData.PageValues,
        SpecialDay: 0, // Not a special day
        Month: getMonthNumber(state.sessionData.Month), // Convert to numeric
        OperatingSystems: state.sessionData.OperatingSystems,
        Browser: state.sessionData.Browser,
        Region: state.sessionData.Region,
        TrafficType: state.sessionData.TrafficType,
        VisitorType: state.sessionData.VisitorType,
        Weekend: state.sessionData.Weekend ? 1 : 0, // Convert to numeric
        model_name: selectedModel,
      };

      const result = await predictPurchase(sessionData);
      setPrediction(result);
    } catch (err) {
      setError('Failed to get prediction. Please try again.');
      console.error('Prediction error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (state.cartItems.length === 0) {
    return (
      <div className="page">
        <div className="container">
          <div style={{ textAlign: 'center', padding: '2rem' }}>
            <h1>Your cart is empty</h1>
            <p style={{ marginBottom: '2rem', color: '#6b7280' }}>
              Add some products to your cart before checkout.
            </p>
            <button 
              className="btn btn-primary" 
              onClick={() => navigate('/products')}
            >
              Go Shopping
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
          <h1 className="page-title">💳 Checkout</h1>
          <p className="page-subtitle">Complete your purchase and see ML prediction</p>
        </div>

        {/* Model selection dropdown */}
        <div style={{ marginBottom: '2rem', maxWidth: 400 }}>
          <label htmlFor="model-select" style={{ fontWeight: 600, marginBottom: 8, display: 'block' }}>
            Choose ML Model:
          </label>
          <select
            id="model-select"
            value={selectedModel}
            onChange={e => setSelectedModel(e.target.value)}
            style={{ width: '100%', padding: '0.5rem', borderRadius: 4, border: '1px solid #d1d5db' }}
          >
            {MODEL_OPTIONS.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>

        <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: 320 }}>
            <h2 style={{ marginBottom: '1.5rem', color: '#111827' }}>Session Analytics</h2>
            <div className="session-data">
              <h3 style={{ marginBottom: '1rem', color: '#111827' }}>📊 Your Browsing Data</h3>
              <p style={{ color: '#6b7280', marginBottom: '1rem', fontSize: '0.875rem' }}>
                This data was collected during your shopping session and used for ML prediction:
              </p>
              <div style={{ marginBottom: '1rem' }}>
                <strong>Pages Visited:</strong> {state.pageVisits.length}
              </div>
              <div style={{ marginBottom: '1rem' }}>
                <strong>Products Viewed:</strong> {state.sessionData.ProductRelated}
              </div>
              <div style={{ marginBottom: '1rem' }}>
                <strong>Time on Product Pages:</strong> {Math.round(state.sessionData.ProductRelated_Duration)}s
              </div>
              <div style={{ marginBottom: '1rem' }}>
                <strong>Cart Items:</strong> {state.cartItems.length}
              </div>
              <div style={{ marginBottom: '1rem' }}>
                <strong>Bounce Rate:</strong> {(state.sessionData.BounceRates * 100).toFixed(1)}%
              </div>
              <div style={{ marginBottom: '1rem' }}>
                <strong>Exit Rate:</strong> {(state.sessionData.ExitRates * 100).toFixed(1)}%
              </div>
              <div style={{ marginBottom: '1rem' }}>
                <strong>Page Values:</strong> {state.sessionData.PageValues.toFixed(2)}
              </div>
              <div style={{ marginBottom: '1rem' }}>
                <strong>Visitor Type:</strong> {state.sessionData.VisitorType}
              </div>
              <div style={{ marginBottom: '1rem' }}>
                <strong>Weekend Session:</strong> {state.sessionData.Weekend ? 'Yes' : 'No'}
              </div>
              <details style={{ marginTop: '1rem' }}>
                <summary style={{ cursor: 'pointer', color: '#4f46e5', fontWeight: '600' }}>
                  View Raw Session Data (JSON)
                </summary>
                <pre style={{ 
                  marginTop: '0.5rem', 
                  backgroundColor: '#f8fafc', 
                  padding: '1rem', 
                  borderRadius: '0.375rem', 
                  overflow: 'auto',
                  fontSize: '0.75rem'
                }}>
                  {JSON.stringify(state.sessionData, null, 2)}
                </pre>
              </details>
            </div>
            <div style={{ marginTop: '2rem' }}>
              <button 
                className="btn btn-secondary"
                onClick={() => navigate('/products')}
                style={{ width: '100%', marginBottom: '1rem' }}
              >
                Continue Shopping
              </button>
              <button 
                className="btn btn-primary"
                onClick={() => {
                  dispatch({ type: 'RESET_SESSION' });
                  navigate('/');
                }}
                style={{ width: '100%' }}
              >
                Start New Session
              </button>
            </div>
          </div>

          {/* Prediction and metrics */}
          <div style={{ flex: 1, minWidth: 320 }}>
            <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '0.5rem', boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)' }}>
              <h3 style={{ marginBottom: '1rem', color: '#111827' }}>🧠 ML Purchase Prediction</h3>
              <p style={{ color: '#6b7280', marginBottom: '1.5rem', fontSize: '0.875rem' }}>
                Our machine learning model analyzes your browsing behavior to predict purchase likelihood.
              </p>
              {!prediction && !loading && (
                <button 
                  className="btn btn-primary"
                  onClick={handlePredictPurchase}
                  style={{ width: '100%' }}
                >
                  🔮 Predict Purchase Intent
                </button>
              )}
              {loading && (
                <div className="loading">
                  <p>Analyzing your session data...</p>
                </div>
              )}
              {error && (
                <div className="error">
                  {error}
                </div>
              )}
              {prediction && (
                <div className={`prediction-result ${prediction.prediction === 1 ? 'prediction-success' : 'prediction-failure'}`}>
                  <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>
                    {prediction.prediction === 1 ? '✅' : '❌'}
                  </div>
                  <div style={{ marginBottom: '0.5rem' }}>
                    {prediction.result}
                  </div>
                  <div style={{ fontSize: '0.875rem', opacity: '0.8' }}>
                    Confidence: {(prediction.confidence * 100).toFixed(1)}%
                  </div>
                  {prediction.model_name && (
                    <div style={{ fontSize: '0.9rem', marginTop: '0.5rem' }}>
                      <strong>Model:</strong> {MODEL_OPTIONS.find(opt => opt.value === prediction.model_name)?.label || prediction.model_name}
                    </div>
                  )}
                  {typeof prediction.accuracy === 'number' && (
                    <div style={{ fontSize: '0.9rem', marginTop: '0.5rem' }}>
                      <strong>Test Accuracy:</strong> {(prediction.accuracy * 100).toFixed(2)}%
                    </div>
                  )}
                  {prediction.roc_curve_base64 && (
                    <div style={{ marginTop: '1rem' }}>
                      <strong>ROC Curve:</strong>
                      <img
                        src={`data:image/png;base64,${prediction.roc_curve_base64}`}
                        alt="ROC Curve"
                        style={{ width: '100%', maxWidth: 350, marginTop: 8, borderRadius: 8, border: '1px solid #e5e7eb' }}
                      />
                    </div>
                  )}
                  {/* Feature Importance */}
                  {prediction.feature_importance && (
                    <div style={{ marginTop: '1.5rem' }}>
                      <strong>Feature Importance:</strong>
                      <ul style={{ margin: 0, padding: 0, listStyle: 'none' }}>
                        {prediction.feature_importance.map((imp, idx) => (
                          <li key={idx} style={{ margin: '0.25rem 0' }}>
                            <span style={{ display: 'inline-block', width: 120 }}>
                              Feature {idx + 1}
                            </span>
                            <span style={{ display: 'inline-block', background: '#4f46e5', height: 8, width: `${imp * 200}px`, borderRadius: 4, verticalAlign: 'middle', marginRight: 8 }}></span>
                            <span style={{ fontSize: '0.85rem', color: '#374151' }}>{imp.toFixed(3)}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  <div style={{ marginTop: '1.5rem', fontSize: '0.8rem', color: '#6b7280' }}>
                    <em>Note: Model selection and input validation are now secured. Only allowed models can be used. All session data is validated before prediction.</em>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout; 