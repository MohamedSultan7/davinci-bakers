import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, User, LogOut, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuthStore } from '@/stores/auth';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/apiClient';
import { useState } from 'react';

const Navigation = () => {
  const navigate = useNavigate();
  const { isAuthenticated, isEmailVerified, user, logout } = useAuthStore();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Get cart count for authenticated users
  const { data: cart } = useQuery({
    queryKey: ['cart'],
    queryFn: () => api.cart.get(),
    enabled: isAuthenticated && isEmailVerified,
  });

  const cartItemCount = cart?.items.reduce((sum, item) => sum + item.quantity, 0) || 0;

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <>
      {/* Main Header */}
      <nav className="border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-12 h-12 rounded-full">
              <img src='/favicon.png'></img>
            </div>
            <span className="font-bold text-xl text-foreground">DaVinci Bakers</span>
          </Link>

          {/* Main Navigation - Desktop Only */}
          <div className="hidden md:flex items-center space-x-8">
            <Link 
              to="/" 
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Home
            </Link>
            <Link 
              to="/catalog" 
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Catalog
            </Link>
            <Link 
              to="/cart" 
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Cart
            </Link>
            <Link 
              to="/orders" 
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Orders
            </Link>
            <Link 
              to="/checkout" 
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Checkout
            </Link>
            <Link 
              to="/login" 
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Login
            </Link>
            <Link 
              to="/register" 
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Register
            </Link>
            <Link 
              to="/verify-otp" 
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Verify OTP
            </Link>
            <Link 
              to="/pending-access" 
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Pending Access
            </Link>
          </div>

          {/* Right Actions */}
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                {/* User info */}
                <div className="hidden md:flex flex-col items-end text-sm">
                  <span className="text-foreground font-medium">{user?.contactName}</span>
                  <span className="text-muted-foreground text-xs">{user?.companyName}</span>
                </div>

                {/* Cart (only for verified users) */}
                {isEmailVerified && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="relative"
                    onClick={() => navigate('/cart')}
                  >
                    <ShoppingCart className="h-5 w-5" />
                    {cartItemCount > 0 && (
                      <Badge 
                        variant="destructive" 
                        className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center text-xs"
                      >
                        {cartItemCount}
                      </Badge>
                    )}
                  </Button>
                )}

                {/* User dropdown */}
                <div className="flex items-center space-x-2">
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => navigate('/orders')}
                    disabled={!isEmailVerified}
                  >
                    <User className="h-5 w-5" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={handleLogout}
                  >
                    <LogOut className="h-5 w-5" />
                  </Button>
                </div>
              </>
            ) : (
              <>
                <Button 
                  variant="ghost" 
                  onClick={() => navigate('/login')}
                  className="hidden md:inline-flex"
                >
                  Sign In
                </Button>
                <Button 
                  onClick={() => navigate('/register')}
                  className="hidden md:inline-flex"
                >
                  Request Access
                </Button>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Mobile Menu Bar */}
      <div className="md:hidden bg-card border-b border-border sticky top-16 z-40">
        <div className="container mx-auto px-4 h-12 flex items-center justify-between">
          <span className="text-sm font-medium text-foreground">Browse Menu</span>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile navigation */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-border bg-card">
          <div className="px-4 py-2 space-y-1">
            <Link 
              to="/" 
              className="block py-3 text-muted-foreground hover:text-foreground transition-colors border-b border-border/50"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Home
            </Link>
            <Link 
              to="/catalog" 
              className="block py-3 text-muted-foreground hover:text-foreground transition-colors border-b border-border/50"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Catalog
            </Link>
            <Link 
              to="/cart" 
              className="block py-3 text-muted-foreground hover:text-foreground transition-colors border-b border-border/50"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Cart
            </Link>
            <Link 
              to="/orders" 
              className="block py-3 text-muted-foreground hover:text-foreground transition-colors border-b border-border/50"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Orders
            </Link>
            <Link 
              to="/checkout" 
              className="block py-3 text-muted-foreground hover:text-foreground transition-colors border-b border-border/50"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Checkout
            </Link>
            
            {/* Authentication links for mobile */}
            {!isAuthenticated ? (
              <>
                <Link 
                  to="/login" 
                  className="block py-3 text-muted-foreground hover:text-foreground transition-colors border-b border-border/50"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Login
                </Link>
                <Link 
                  to="/register" 
                  className="block py-3 text-muted-foreground hover:text-foreground transition-colors border-b border-border/50"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Register
                </Link>
              </>
            ) : (
              <>
                <Link 
                  to="/orders" 
                  className="block py-3 text-muted-foreground hover:text-foreground transition-colors border-b border-border/50"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  My Orders
                </Link>
                <button 
                  className="block w-full text-left py-3 text-muted-foreground hover:text-foreground transition-colors border-b border-border/50"
                  onClick={() => {
                    handleLogout();
                    setIsMobileMenuOpen(false);
                  }}
                >
                  Logout
                </button>
              </>
            )}
            
            <Link 
              to="/verify-otp" 
              className="block py-3 text-muted-foreground hover:text-foreground transition-colors border-b border-border/50"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Verify OTP
            </Link>
            <Link 
              to="/pending-access" 
              className="block py-3 text-muted-foreground hover:text-foreground transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Pending Access
            </Link>
          </div>
        </div>
      )}
    </>
  );
};

export default Navigation;