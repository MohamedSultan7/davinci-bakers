import axios from 'axios';
import { useMocks, config } from './runtime';
import { MockApiService } from '@/mocks/service';

// Create axios instance (ready for real API)
export const apiClient = axios.create({
  baseURL: config.apiBaseUrl,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptors (ready for real API but idle for mocks)
apiClient.interceptors.request.use(
  (config) => {
    // Add auth token when available
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        // Try to refresh token
        const refreshToken = localStorage.getItem('refreshToken');
        if (refreshToken) {
          const response = await apiClient.post('/auth/refresh', { refreshToken });
          const { accessToken } = response.data;
          localStorage.setItem('accessToken', accessToken);
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          return apiClient(originalRequest);
        }
      } catch (refreshError) {
        // Refresh failed, redirect to login
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        window.location.href = '/login';
      }
    }
    
    return Promise.reject(error);
  }
);

// Generic API wrapper that routes to mock or real API
class ApiWrapper {
  private async handleRequest<T>(mockFn: () => Promise<T>, realApiFn?: () => Promise<T>): Promise<T> {
    if (useMocks) {
      try {
        return await mockFn();
      } catch (error) {
        // Parse mock error format
        if (error instanceof Error) {
          try {
            const parsedError = JSON.parse(error.message);
            const apiError = new Error(parsedError.message);
            (apiError as any).code = parsedError.code;
            throw apiError;
          } catch {
            throw error;
          }
        }
        throw error;
      }
    } else {
      if (!realApiFn) {
        throw new Error('Real API function not implemented yet');
      }
      return await realApiFn();
    }
  }

  // Auth API
  auth = {
    register: (data: any) => this.handleRequest(() => MockApiService.register(data)),
    login: (data: any) => this.handleRequest(() => MockApiService.login(data)),
    sendOtp: (email: string) => this.handleRequest(() => MockApiService.sendOtp(email)),
    verifyOtp: (data: any) => this.handleRequest(() => MockApiService.verifyOtp(data)),
    refreshToken: (token: string) => this.handleRequest(() => MockApiService.refreshToken(token)),
    logout: () => this.handleRequest(() => MockApiService.logout()),
  };

  // Products API
  products = {
    list: (filters: any) => this.handleRequest(() => MockApiService.listProducts(filters)),
    get: (id: string) => this.handleRequest(() => MockApiService.getProduct(id)),
  };

  // Categories API
  categories = {
    list: () => this.handleRequest(() => MockApiService.listCategories()),
  };

  // Cart API
  cart = {
    get: () => this.handleRequest(() => MockApiService.getCart()),
    add: (productId: string, quantity: number) => this.handleRequest(() => MockApiService.addToCart(productId, quantity)),
    update: (productId: string, quantity: number) => this.handleRequest(() => MockApiService.updateCartItem(productId, quantity)),
    remove: (productId: string) => this.handleRequest(() => MockApiService.removeFromCart(productId)),
    clear: () => this.handleRequest(() => MockApiService.clearCart()),
    validate: () => this.handleRequest(() => MockApiService.validateCart()),
  };

  // Orders API
  orders = {
    create: (data: any) => this.handleRequest(() => MockApiService.createOrder(data)),
    list: (status?: string) => this.handleRequest(() => MockApiService.listOrders(status)),
    get: (id: string) => this.handleRequest(() => MockApiService.getOrder(id)),
    reorder: (id: string) => this.handleRequest(() => MockApiService.reorder(id)),
  };

  // Payments API
  payments = {
    createIntent: (amount: number) => this.handleRequest(() => MockApiService.createPaymentIntent(amount)),
    confirm: (clientSecret: string) => this.handleRequest(() => MockApiService.confirmPayment(clientSecret)),
  };
}

export const api = new ApiWrapper();