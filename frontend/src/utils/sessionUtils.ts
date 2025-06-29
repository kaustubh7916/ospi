// Browser and OS detection utilities
export const detectBrowser = (): number => {
  const userAgent = navigator.userAgent;
  
  if (userAgent.includes('Chrome')) return 1;
  if (userAgent.includes('Firefox')) return 2;
  if (userAgent.includes('Safari') && !userAgent.includes('Chrome')) return 3;
  if (userAgent.includes('Edge')) return 4;
  if (userAgent.includes('Opera')) return 5;
  
  return 1; // Default to Chrome
};

export const detectOperatingSystem = (): number => {
  const userAgent = navigator.userAgent;
  
  if (userAgent.includes('Windows')) return 1;
  if (userAgent.includes('Mac')) return 2;
  if (userAgent.includes('Linux')) return 3;
  if (userAgent.includes('Android')) return 4;
  if (userAgent.includes('iOS')) return 5;
  
  return 1; // Default to Windows
};

export const getCurrentMonth = (): string => {
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return monthNames[new Date().getMonth()];
};

export const isWeekend = (): boolean => {
  const day = new Date().getDay();
  return day === 0 || day === 6;
};

export const getRandomVisitorType = (): string => {
  const types = ['New_Visitor', 'Returning_Visitor'];
  return types[Math.floor(Math.random() * types.length)];
};

export const getRandomRegion = (): number => {
  return Math.floor(Math.random() * 9) + 1; // 1-9
};

export const getRandomTrafficType = (): number => {
  return Math.floor(Math.random() * 20) + 1; // 1-20
};

// Time tracking utilities
export const formatDuration = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
};

// API utilities
export const API_BASE_URL = 'http://localhost:5000';

export const predictPurchase = async (sessionData: any) => {
  try {
    const response = await fetch(`${API_BASE_URL}/predict`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(sessionData),
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error predicting purchase:', error);
    throw error;
  }
}; 