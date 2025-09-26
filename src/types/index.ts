// Core types for B2B Bakery Platform

export interface Product {
  id: string;
  sku: string;
  name: string;
  description: string;
  imageUrls: string[];
  categoryId: string;
  categoryName: string;
  price: number;
  formattedPrice: string;
  inventory: number;
  tags: string[];
  allergens: string[];
  leadTimeDays: number;
  availableDays: ('Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri')[];
}

export interface Category {
  id: string;
  name: string;
}

export interface User {
  id: string;
  companyName: string;
  contactName: string;
  email: string;
  phone: string;
  isEmailVerified: boolean;
  role: 'user' | 'admin';
}

export interface CartItem {
  productId: string;
  sku: string;
  name: string;
  imageUrl: string;
  unitPrice: number;
  quantity: number;
  lineTotal: number;
}

export interface Cart {
  items: CartItem[];
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
}

export interface OrderItem {
  sku: string;
  name: string;
  unitPrice: number;
  quantity: number;
  lineTotal: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  createdAt: string;
  status: 'placed' | 'confirmed' | 'preparing' | 'ready' | 'delivered' | 'cancelled';
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  items: OrderItem[];
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
  deliveryAddress: DeliveryAddress;
  requestedDate?: string;
  deliveredDate?: string;
  poNumber?: string;
  notes?: string;
}

export interface DeliveryAddress {
  id: string;
  companyName: string;
  streetAddress: string;
  city: string;
  state: string;
  zipCode: string;
  contactName: string;
  contactPhone: string;
}

export interface MOQConfig {
  [sku: string]: {
    minOrderQty?: number;
    increment?: number;
    defaultQty?: number;
  };
}

// API Response types
export interface PaginatedResponse<T> {
  data: T[];
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

export interface ApiError {
  message: string;
  code?: string;
  details?: Record<string, any>;
}

// Auth types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  companyName: string;
  contactName: string;
  email: string;
  phone: string;
  password: string;
}

export interface VerifyOtpRequest {
  email: string;
  otp: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
}

// Product filters
export interface ProductFilters {
  search?: string;
  categoryId?: string;
  tags?: string[];
  page?: number;
  pageSize?: number;
}

// Payment types
export interface PaymentIntent {
  clientSecret: string;
  amount: number;
  currency: string;
}

export interface CreateOrderRequest {
  deliveryAddressId: string;
  requestedDate?: string;
  poNumber?: string;
  notes?: string;
  paymentIntentId: string;
}