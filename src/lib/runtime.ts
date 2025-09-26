// Runtime configuration - Controls whether to use mock data or real API
export const useMocks = true;

// Environment configuration placeholders (unused for mocks but ready for real API)
export const config = {
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api',
  stripePublishableKey: import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || '',
};

// Feature flags
export const features = {
  enableOrderPolling: true,
  enableRateLimitSimulation: true,
  enableOfflineDetection: true,
};