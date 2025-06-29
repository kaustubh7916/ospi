import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';

// Session data interface
export interface SessionData {
  Administrative: number;
  Administrative_Duration: number;
  Informational: number;
  Informational_Duration: number;
  ProductRelated: number;
  ProductRelated_Duration: number;
  BounceRates: number;
  ExitRates: number;
  PageValues: number;
  SpecialDay: number;
  Month: string;
  OperatingSystems: number;
  Browser: number;
  Region: number;
  TrafficType: number;
  VisitorType: string;
  Weekend: boolean;
}

// Session state interface
interface SessionState {
  sessionData: SessionData;
  pageVisits: string[];
  startTime: number;
  productPageStartTime: number | null;
  cartItems: any[];
  isSessionStarted: boolean;
}

// Action types
type SessionAction =
  | { type: 'START_SESSION' }
  | { type: 'VISIT_PAGE'; page: string }
  | { type: 'ADD_TO_CART'; product: any }
  | { type: 'REMOVE_FROM_CART'; productId: string }
  | { type: 'UPDATE_PRODUCT_DURATION' }
  | { type: 'RESET_SESSION' };

// Initial session data
const getInitialSessionData = (): SessionData => {
  const now = new Date();
  const isWeekend = now.getDay() === 0 || now.getDay() === 6;
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  
  // Detect browser and OS
  const userAgent = navigator.userAgent;
  let browser = 1; // Default to Chrome
  let os = 1; // Default to Windows
  
  if (userAgent.includes('Firefox')) browser = 2;
  else if (userAgent.includes('Safari') && !userAgent.includes('Chrome')) browser = 3;
  
  if (userAgent.includes('Mac')) os = 2;
  else if (userAgent.includes('Linux')) os = 3;
  
  // Random visitor type
  const visitorTypes = ['New_Visitor', 'Returning_Visitor'];
  const visitorType = visitorTypes[Math.floor(Math.random() * visitorTypes.length)];
  
  return {
    Administrative: 0,
    Administrative_Duration: 0,
    Informational: 0,
    Informational_Duration: 0,
    ProductRelated: 0,
    ProductRelated_Duration: 0,
    BounceRates: 1.0, // Start with bounce rate of 1.0
    ExitRates: 1.0, // Start with exit rate of 1.0
    PageValues: 0,
    SpecialDay: 0,
    Month: monthNames[now.getMonth()],
    OperatingSystems: os,
    Browser: browser,
    Region: Math.floor(Math.random() * 9) + 1, // Random region 1-9
    TrafficType: Math.floor(Math.random() * 20) + 1, // Random traffic type 1-20
    VisitorType: visitorType,
    Weekend: isWeekend,
  };
};

// Initial state
const initialState: SessionState = {
  sessionData: getInitialSessionData(),
  pageVisits: [],
  startTime: Date.now(),
  productPageStartTime: null,
  cartItems: [],
  isSessionStarted: false,
};

// Session reducer
const sessionReducer = (state: SessionState, action: SessionAction): SessionState => {
  switch (action.type) {
    case 'START_SESSION':
      return {
        ...state,
        isSessionStarted: true,
        startTime: Date.now(),
      };
      
    case 'VISIT_PAGE':
      const newPageVisits = [...state.pageVisits, action.page];
      const uniquePages = new Set(newPageVisits);
      
      // Update bounce rate (1.0 if only 1 page, else 0)
      const bounceRates = uniquePages.size === 1 ? 1.0 : 0;
      
      // Update exit rate (simplified calculation)
      const exitRates = 1 / Math.max(uniquePages.size, 1);
      
      // Update page values based on page type
      let pageValues = state.sessionData.PageValues;
      if (action.page.includes('product')) {
        pageValues += 0.1;
      } else if (action.page.includes('cart') || action.page.includes('checkout')) {
        pageValues += 0.5;
      }
      
      // Update product related metrics
      let productRelated = state.sessionData.ProductRelated;
      let productRelatedDuration = state.sessionData.ProductRelated_Duration;
      
      if (action.page.includes('product')) {
        productRelated += 1;
        if (state.productPageStartTime) {
          const duration = (Date.now() - state.productPageStartTime) / 1000;
          productRelatedDuration += duration;
        }
      }
      
      return {
        ...state,
        pageVisits: newPageVisits,
        sessionData: {
          ...state.sessionData,
          BounceRates: bounceRates,
          ExitRates: exitRates,
          PageValues: pageValues,
          ProductRelated: productRelated,
          ProductRelated_Duration: productRelatedDuration,
        },
        productPageStartTime: action.page.includes('product') ? Date.now() : null,
      };
      
    case 'ADD_TO_CART':
      return {
        ...state,
        cartItems: [...state.cartItems, action.product],
        sessionData: {
          ...state.sessionData,
          PageValues: state.sessionData.PageValues + 0.3,
        },
      };
      
    case 'REMOVE_FROM_CART':
      return {
        ...state,
        cartItems: state.cartItems.filter(item => item.id !== action.productId),
      };
      
    case 'UPDATE_PRODUCT_DURATION':
      if (state.productPageStartTime) {
        const duration = (Date.now() - state.productPageStartTime) / 1000;
        return {
          ...state,
          sessionData: {
            ...state.sessionData,
            ProductRelated_Duration: state.sessionData.ProductRelated_Duration + duration,
          },
          productPageStartTime: Date.now(),
        };
      }
      return state;
      
    case 'RESET_SESSION':
      return {
        ...initialState,
        sessionData: getInitialSessionData(),
      };
      
    default:
      return state;
  }
};

// Context
const SessionContext = createContext<{
  state: SessionState;
  dispatch: React.Dispatch<SessionAction>;
} | undefined>(undefined);

// Provider component
export const SessionProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(sessionReducer, initialState);

  // Update product duration periodically when on product pages
  useEffect(() => {
    if (state.productPageStartTime) {
      const interval = setInterval(() => {
        dispatch({ type: 'UPDATE_PRODUCT_DURATION' });
      }, 1000);
      
      return () => clearInterval(interval);
    }
  }, [state.productPageStartTime]);

  return (
    <SessionContext.Provider value={{ state, dispatch }}>
      {children}
    </SessionContext.Provider>
  );
};

// Hook to use session context
export const useSession = () => {
  const context = useContext(SessionContext);
  if (context === undefined) {
    throw new Error('useSession must be used within a SessionProvider');
  }
  return context;
}; 