import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect } from "react";

// Pages
import Index from "./pages/Index.tsx";
import Catalog from "./pages/Catalog.tsx";
import ProductDetail from "./pages/ProductDetail.tsx";
import Login from "./pages/Login.tsx";
import Register from "./pages/Register.tsx";
import VerifyOtp from "./pages/VerifyOtp.tsx";
import PendingAccess from "./pages/PendingAccess.tsx";
import Cart from "./pages/Cart.tsx";
import Checkout from "./pages/Checkout.tsx";
import Orders from "./pages/Orders.tsx";
import OrderDetail from "./pages/OrderDetail.tsx";
import NotFound from "./pages/NotFound.tsx";

// Components
import Layout from "./components/shared/Layout.tsx";
import AuthGuard from "./components/shared/AuthGuard.tsx";

// Stores
import { initializeAuth } from "./stores/auth.ts";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (failureCount, error) => {
        // Don't retry on auth errors or rate limits
        if ((error as any)?.code === 'AUTH_REQUIRED' || (error as any)?.code === 'RATE_LIMIT') {
          return false;
        }
        return failureCount < 3;
      },
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

const App = () => {
  useEffect(() => {
    initializeAuth();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Layout>
            <Routes>
              {/* Public routes */}
              <Route path="/" element={<Index />} />
              <Route path="/catalog" element={<Catalog />} />
              <Route path="/product/:id" element={<ProductDetail />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/verify-otp" element={<VerifyOtp />} />
              <Route path="/pending-access" element={<PendingAccess />} />
              
              {/* Protected routes */}
              <Route path="/cart" element={
                <AuthGuard requireVerified>
                  <Cart />
                </AuthGuard>
              } />
              <Route path="/checkout" element={
                <AuthGuard requireVerified>
                  <Checkout />
                </AuthGuard>
              } />
              <Route path="/orders" element={
                <AuthGuard requireVerified>
                  <Orders />
                </AuthGuard>
              } />
              <Route path="/orders/:id" element={
                <AuthGuard requireVerified>
                  <OrderDetail />
                </AuthGuard>
              } />
              
              {/* Catch-all route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Layout>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
