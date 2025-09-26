import { 
  Product, Category, User, Order, Cart, CartItem, AuthTokens, 
  LoginRequest, RegisterRequest, VerifyOtpRequest, ProductFilters, 
  PaginatedResponse, PaymentIntent, CreateOrderRequest, DeliveryAddress 
} from '@/types';
import { products, categories, users, orders, deliveryAddresses, moqConfig } from './seed';

// In-memory state
let currentUser: User | null = null;
let userSessions: Map<string, { user: User; tokens: AuthTokens }> = new Map();
let userCarts: Map<string, Cart> = new Map();
let allOrders: Order[] = [...orders];
let orderCounter = orders.length + 1;

// Utility functions
const delay = (ms: number = Math.random() * 400 + 300) => new Promise(resolve => setTimeout(resolve, ms));

const shouldThrowRateLimit = () => Math.random() < 0.05; // 5% chance
const shouldThrowServerError = () => Math.random() < 0.02; // 2% chance

const throwApiError = (message: string, code?: string) => {
  throw new Error(JSON.stringify({ message, code }));
};

const generateTokens = (userId: string): AuthTokens => ({
  accessToken: `mock_access_${userId}_${Date.now()}`,
  refreshToken: `mock_refresh_${userId}_${Date.now()}`,
  expiresAt: Date.now() + 3600000, // 1 hour
});

const calculateCart = (items: CartItem[]): Cart => {
  const subtotal = items.reduce((sum, item) => sum + item.lineTotal, 0);
  const tax = subtotal * 0.09; // 9% tax
  const shipping = subtotal > 75 ? 0 : 15; // Free shipping over $75
  const total = subtotal + tax + shipping;

  return {
    items,
    subtotal: Math.round(subtotal * 100) / 100,
    tax: Math.round(tax * 100) / 100,
    shipping,
    total: Math.round(total * 100) / 100,
  };
};

// Mock service class
export class MockApiService {
  // Auth endpoints
  static async register(request: RegisterRequest): Promise<{ user: User; tokens: AuthTokens }> {
    await delay();
    
    if (shouldThrowRateLimit()) throwApiError('Too many requests', 'RATE_LIMIT');
    if (shouldThrowServerError()) throwApiError('Internal server error', 'SERVER_ERROR');

    // Check if user already exists
    const existingUser = users.find(u => u.email === request.email);
    if (existingUser) throwApiError('User already exists', 'USER_EXISTS');

    const newUser: User = {
      id: `user-${Date.now()}`,
      companyName: request.companyName,
      contactName: request.contactName,
      email: request.email,
      phone: request.phone,
      isEmailVerified: false,
      role: 'user',
    };

    users.push(newUser);
    const tokens = generateTokens(newUser.id);
    userSessions.set(newUser.id, { user: newUser, tokens });
    currentUser = newUser;

    return { user: newUser, tokens };
  }

  static async login(request: LoginRequest): Promise<{ user: User; tokens: AuthTokens }> {
    await delay();
    
    if (shouldThrowRateLimit()) throwApiError('Too many requests', 'RATE_LIMIT');
    if (shouldThrowServerError()) throwApiError('Internal server error', 'SERVER_ERROR');

    const user = users.find(u => u.email === request.email);
    if (!user) throwApiError('Invalid credentials', 'INVALID_CREDENTIALS');

    const tokens = generateTokens(user.id);
    userSessions.set(user.id, { user, tokens });
    currentUser = user;

    return { user, tokens };
  }

  static async sendOtp(email: string): Promise<{ success: boolean }> {
    await delay();
    
    if (shouldThrowRateLimit()) throwApiError('Too many requests', 'RATE_LIMIT');
    
    console.log(`Mock OTP sent to ${email}: 123456`);
    return { success: true };
  }

  static async verifyOtp(request: VerifyOtpRequest): Promise<{ user: User; tokens: AuthTokens }> {
    await delay();
    
    if (shouldThrowRateLimit()) throwApiError('Too many requests', 'RATE_LIMIT');
    if (request.otp !== '123456') throwApiError('Invalid OTP', 'INVALID_OTP');

    const user = users.find(u => u.email === request.email);
    if (!user) throwApiError('User not found', 'USER_NOT_FOUND');

    // Mark email as verified
    user.isEmailVerified = true;
    const tokens = generateTokens(user.id);
    userSessions.set(user.id, { user, tokens });
    currentUser = user;

    return { user, tokens };
  }

  static async refreshToken(refreshToken: string): Promise<{ tokens: AuthTokens }> {
    await delay();
    
    if (shouldThrowRateLimit()) throwApiError('Too many requests', 'RATE_LIMIT');
    
    // In real implementation, would validate refresh token
    const session = Array.from(userSessions.values()).find(s => s.tokens.refreshToken === refreshToken);
    if (!session) throwApiError('Invalid refresh token', 'INVALID_TOKEN');

    const newTokens = generateTokens(session.user.id);
    session.tokens = newTokens;
    return { tokens: newTokens };
  }

  static async logout(): Promise<{ success: boolean }> {
    await delay();
    currentUser = null;
    return { success: true };
  }

  // Product endpoints
  static async listProducts(filters: ProductFilters = {}): Promise<PaginatedResponse<Product>> {
    await delay();
    
    if (shouldThrowRateLimit()) throwApiError('Too many requests', 'RATE_LIMIT');
    if (shouldThrowServerError()) throwApiError('Internal server error', 'SERVER_ERROR');

    let filteredProducts = [...products];

    // Apply filters
    if (filters.search) {
      const search = filters.search.toLowerCase();
      filteredProducts = filteredProducts.filter(p => 
        p.name.toLowerCase().includes(search) ||
        p.description.toLowerCase().includes(search) ||
        p.tags.some(tag => tag.toLowerCase().includes(search))
      );
    }

    if (filters.categoryId) {
      filteredProducts = filteredProducts.filter(p => p.categoryId === filters.categoryId);
    }

    if (filters.tags && filters.tags.length > 0) {
      filteredProducts = filteredProducts.filter(p => 
        filters.tags!.some(tag => p.tags.includes(tag))
      );
    }

    // Pagination
    const page = filters.page || 1;
    const pageSize = filters.pageSize || 12;
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedProducts = filteredProducts.slice(startIndex, endIndex);

    return {
      data: paginatedProducts,
      page,
      pageSize,
      total: filteredProducts.length,
      totalPages: Math.ceil(filteredProducts.length / pageSize),
    };
  }

  static async getProduct(id: string): Promise<Product> {
    await delay();
    
    if (shouldThrowRateLimit()) throwApiError('Too many requests', 'RATE_LIMIT');
    
    const product = products.find(p => p.id === id);
    if (!product) throwApiError('Product not found', 'PRODUCT_NOT_FOUND');
    
    return product;
  }

  static async listCategories(): Promise<Category[]> {
    await delay();
    
    if (shouldThrowRateLimit()) throwApiError('Too many requests', 'RATE_LIMIT');
    
    return categories;
  }

  // Cart endpoints
  static async getCart(): Promise<Cart> {
    await delay();
    
    if (!currentUser) throwApiError('Authentication required', 'AUTH_REQUIRED');
    
    const cart = userCarts.get(currentUser.id) || calculateCart([]);
    return cart;
  }

  static async addToCart(productId: string, quantity: number): Promise<Cart> {
    await delay();
    
    if (!currentUser) throwApiError('Authentication required', 'AUTH_REQUIRED');
    if (shouldThrowRateLimit()) throwApiError('Too many requests', 'RATE_LIMIT');

    const product = products.find(p => p.id === productId);
    if (!product) throwApiError('Product not found', 'PRODUCT_NOT_FOUND');

    // Get MOQ config for this SKU
    const moq = moqConfig[product.sku] || {};
    const minQty = moq.minOrderQty || 1;
    const increment = moq.increment || 1;

    // Validate quantity
    if (quantity < minQty) {
      throwApiError(`Minimum order quantity is ${minQty}`, 'MIN_QTY_NOT_MET');
    }
    
    if ((quantity - minQty) % increment !== 0) {
      const adjustedQty = minQty + Math.ceil((quantity - minQty) / increment) * increment;
      throwApiError(`Quantity must be in increments of ${increment}. Suggested: ${adjustedQty}`, 'INVALID_INCREMENT');
    }

    if (quantity > product.inventory) {
      throwApiError(`Only ${product.inventory} items available`, 'INSUFFICIENT_INVENTORY');
    }

    const currentCart = userCarts.get(currentUser.id) || calculateCart([]);
    const existingItemIndex = currentCart.items.findIndex(item => item.productId === productId);

    let newItems: CartItem[];
    if (existingItemIndex >= 0) {
      // Update existing item
      newItems = [...currentCart.items];
      newItems[existingItemIndex] = {
        ...newItems[existingItemIndex],
        quantity,
        lineTotal: Math.round(product.price * quantity * 100) / 100,
      };
    } else {
      // Add new item
      const newItem: CartItem = {
        productId,
        sku: product.sku,
        name: product.name,
        imageUrl: product.imageUrls[0],
        unitPrice: product.price,
        quantity,
        lineTotal: Math.round(product.price * quantity * 100) / 100,
      };
      newItems = [...currentCart.items, newItem];
    }

    const updatedCart = calculateCart(newItems);
    userCarts.set(currentUser.id, updatedCart);
    return updatedCart;
  }

  static async updateCartItem(productId: string, quantity: number): Promise<Cart> {
    return this.addToCart(productId, quantity); // Same logic for updates
  }

  static async removeFromCart(productId: string): Promise<Cart> {
    await delay();
    
    if (!currentUser) throwApiError('Authentication required', 'AUTH_REQUIRED');

    const currentCart = userCarts.get(currentUser.id) || calculateCart([]);
    const newItems = currentCart.items.filter(item => item.productId !== productId);
    
    const updatedCart = calculateCart(newItems);
    userCarts.set(currentUser.id, updatedCart);
    return updatedCart;
  }

  static async clearCart(): Promise<Cart> {
    await delay();
    
    if (!currentUser) throwApiError('Authentication required', 'AUTH_REQUIRED');
    
    const emptyCart = calculateCart([]);
    userCarts.set(currentUser.id, emptyCart);
    return emptyCart;
  }

  static async validateCart(): Promise<{ valid: boolean; errors: string[] }> {
    await delay();
    
    if (!currentUser) throwApiError('Authentication required', 'AUTH_REQUIRED');
    
    const cart = userCarts.get(currentUser.id) || calculateCart([]);
    const errors: string[] = [];

    for (const item of cart.items) {
      const product = products.find(p => p.id === item.productId);
      if (!product) {
        errors.push(`Product ${item.name} is no longer available`);
        continue;
      }

      if (item.quantity > product.inventory) {
        errors.push(`Only ${product.inventory} ${item.name} available (you have ${item.quantity})`);
      }

      // Check MOQ constraints
      const moq = moqConfig[product.sku] || {};
      const minQty = moq.minOrderQty || 1;
      const increment = moq.increment || 1;

      if (item.quantity < minQty) {
        errors.push(`${item.name}: Minimum order quantity is ${minQty}`);
      }
      
      if ((item.quantity - minQty) % increment !== 0) {
        errors.push(`${item.name}: Must be ordered in increments of ${increment}`);
      }
    }

    return { valid: errors.length === 0, errors };
  }

  // Order endpoints
  static async createOrder(request: CreateOrderRequest): Promise<Order> {
    await delay();
    
    if (!currentUser) throwApiError('Authentication required', 'AUTH_REQUIRED');
    if (shouldThrowRateLimit()) throwApiError('Too many requests', 'RATE_LIMIT');

    const cart = userCarts.get(currentUser.id);
    if (!cart || cart.items.length === 0) {
      throwApiError('Cart is empty', 'EMPTY_CART');
    }

    const deliveryAddress = deliveryAddresses.find(addr => addr.id === request.deliveryAddressId);
    if (!deliveryAddress) throwApiError('Delivery address not found', 'ADDRESS_NOT_FOUND');

    // Validate cart one more time
    const validation = await this.validateCart();
    if (!validation.valid) {
      throwApiError(`Cart validation failed: ${validation.errors.join(', ')}`, 'CART_INVALID');
    }

    const newOrder: Order = {
      id: `order-${Date.now()}`,
      orderNumber: `BB-2024-${String(orderCounter++).padStart(3, '0')}`,
      createdAt: new Date().toISOString(),
      status: 'placed',
      paymentStatus: 'paid',
      items: cart.items.map(item => ({
        sku: item.sku,
        name: item.name,
        unitPrice: item.unitPrice,
        quantity: item.quantity,
        lineTotal: item.lineTotal,
      })),
      subtotal: cart.subtotal,
      tax: cart.tax,
      shipping: cart.shipping,
      total: cart.total,
      deliveryAddress,
      requestedDate: request.requestedDate,
      poNumber: request.poNumber,
      notes: request.notes,
    };

    allOrders.unshift(newOrder); // Add to beginning for recent first
    
    // Clear the cart
    userCarts.set(currentUser.id, calculateCart([]));

    return newOrder;
  }

  static async listOrders(status?: string): Promise<PaginatedResponse<Order>> {
    await delay();
    
    if (!currentUser) throwApiError('Authentication required', 'AUTH_REQUIRED');
    if (shouldThrowRateLimit()) throwApiError('Too many requests', 'RATE_LIMIT');

    let filteredOrders = allOrders;
    
    if (status && status !== 'all') {
      filteredOrders = allOrders.filter(order => order.status === status);
    }

    return {
      data: filteredOrders,
      page: 1,
      pageSize: filteredOrders.length,
      total: filteredOrders.length,
      totalPages: 1,
    };
  }

  static async getOrder(id: string): Promise<Order> {
    await delay();
    
    if (!currentUser) throwApiError('Authentication required', 'AUTH_REQUIRED');
    if (shouldThrowRateLimit()) throwApiError('Too many requests', 'RATE_LIMIT');

    const order = allOrders.find(o => o.id === id);
    if (!order) throwApiError('Order not found', 'ORDER_NOT_FOUND');

    // Simulate order status progression for non-terminal orders
    if (['placed', 'confirmed', 'preparing', 'ready'].includes(order.status)) {
      const progression = ['placed', 'confirmed', 'preparing', 'ready', 'delivered'];
      const currentIndex = progression.indexOf(order.status);
      
      // 30% chance to advance status on each call
      if (Math.random() < 0.3 && currentIndex < progression.length - 1) {
        order.status = progression[currentIndex + 1] as Order['status'];
        
        if (order.status === 'delivered' && !order.deliveredDate) {
          order.deliveredDate = new Date().toISOString();
        }
      }
    }

    return order;
  }

  static async reorder(orderId: string): Promise<Cart> {
    await delay();
    
    if (!currentUser) throwApiError('Authentication required', 'AUTH_REQUIRED');

    const order = allOrders.find(o => o.id === orderId);
    if (!order) throwApiError('Order not found', 'ORDER_NOT_FOUND');

    // Convert order items back to cart items
    const cartItems: CartItem[] = [];
    
    for (const orderItem of order.items) {
      const product = products.find(p => p.sku === orderItem.sku);
      if (product && orderItem.quantity <= product.inventory) {
        cartItems.push({
          productId: product.id,
          sku: orderItem.sku,
          name: orderItem.name,
          imageUrl: product.imageUrls[0],
          unitPrice: orderItem.unitPrice,
          quantity: orderItem.quantity,
          lineTotal: orderItem.lineTotal,
        });
      }
    }

    const newCart = calculateCart(cartItems);
    userCarts.set(currentUser.id, newCart);
    return newCart;
  }

  // Payment endpoints
  static async createPaymentIntent(amount: number): Promise<PaymentIntent> {
    await delay();
    
    if (shouldThrowRateLimit()) throwApiError('Too many requests', 'RATE_LIMIT');
    if (shouldThrowServerError()) throwApiError('Payment service unavailable', 'PAYMENT_ERROR');

    return {
      clientSecret: `mock_secret_${Date.now()}`,
      amount,
      currency: 'usd',
    };
  }

  static async confirmPayment(clientSecret: string): Promise<{ success: boolean }> {
    await delay(1000); // Longer delay for payment processing
    
    if (shouldThrowRateLimit()) throwApiError('Too many requests', 'RATE_LIMIT');
    
    // 5% chance of payment failure for testing
    if (Math.random() < 0.05) {
      throwApiError('Payment failed - card declined', 'PAYMENT_DECLINED');
    }

    return { success: true };
  }

  // Utility methods
  static getCurrentUser(): User | null {
    return currentUser;
  }

  static setCurrentUser(user: User | null): void {
    currentUser = user;
  }
}