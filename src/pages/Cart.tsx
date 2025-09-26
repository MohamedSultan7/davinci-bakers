import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, AlertCircle } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { api } from '@/lib/apiClient';
import QtyStepper from '@/components/shared/QtyStepper';
import EmptyState from '@/components/shared/EmptyState';

const Cart = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  // Cart query
  const { data: cart, isLoading } = useQuery({
    queryKey: ['cart'],
    queryFn: () => api.cart.get(),
  });

  // Update cart item mutation
  const updateItemMutation = useMutation({
    mutationFn: ({ productId, quantity }: { productId: string; quantity: number }) =>
      api.cart.update(productId, quantity),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
      setValidationErrors([]);
    },
    onError: (error: any) => {
      toast({
        title: 'Error updating cart',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  // Remove item mutation
  const removeItemMutation = useMutation({
    mutationFn: (productId: string) => api.cart.remove(productId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
      setValidationErrors([]);
      toast({
        title: 'Item removed',
        description: 'Item has been removed from your cart.',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error removing item',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  // Clear cart mutation
  const clearCartMutation = useMutation({
    mutationFn: () => api.cart.clear(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
      setValidationErrors([]);
      toast({
        title: 'Cart cleared',
        description: 'All items have been removed from your cart.',
      });
    },
  });

  // Validate cart mutation
  const validateCartMutation = useMutation({
    mutationFn: () => api.cart.validate(),
    onSuccess: (result) => {
      if (result.valid) {
        setValidationErrors([]);
        navigate('/checkout');
      } else {
        setValidationErrors(result.errors);
        toast({
          title: 'Cart validation failed',
          description: 'Please fix the issues below before proceeding.',
          variant: 'destructive',
        });
      }
    },
    onError: (error: any) => {
      toast({
        title: 'Validation error',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  const handleUpdateQuantity = (productId: string, quantity: number) => {
    updateItemMutation.mutate({ productId, quantity });
  };

  const handleRemoveItem = (productId: string) => {
    removeItemMutation.mutate(productId);
  };

  const handleProceedToCheckout = () => {
    validateCartMutation.mutate();
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Skeleton className="h-8 w-48 mb-6" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <Card key={i}>
                <CardContent className="p-6">
                  <div className="flex gap-4">
                    <Skeleton className="w-20 h-20 rounded-lg" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-4 w-3/4" />
                      <Skeleton className="h-4 w-1/2" />
                      <Skeleton className="h-4 w-1/4" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          <div>
            <Card>
              <CardContent className="p-6 space-y-4">
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-12 w-full" />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-foreground mb-8">Shopping Cart</h1>
        <EmptyState
          icon={<ShoppingBag className="h-16 w-16" />}
          title="Your cart is empty"
          description="Start shopping to add items to your cart."
          action={{
            label: 'Browse Catalog',
            onClick: () => navigate('/catalog'),
          }}
        />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-4xl font-bold text-foreground">Shopping Cart</h1>
        <Button 
          variant="ghost" 
          onClick={() => clearCartMutation.mutate()}
          disabled={clearCartMutation.isPending}
        >
          Clear Cart
        </Button>
      </div>

      {/* Validation errors */}
      {validationErrors.length > 0 && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            <div className="space-y-1">
              {validationErrors.map((error, index) => (
                <div key={index}>{error}</div>
              ))}
            </div>
          </AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart items */}
        <div className="lg:col-span-2 space-y-4">
          {cart.items.map((item) => (
            <Card key={item.productId} className="animate-fade-in">
              <CardContent className="p-6">
                <div className="flex gap-4">
                  {/* Product image */}
                  <div className="w-20 h-20 bg-muted rounded-lg overflow-hidden flex-shrink-0">
                    <img 
                      src={item.imageUrl} 
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Product details */}
                  <div className="flex-1 space-y-2">
                    <div className="flex items-start justify-between">
                      <div>
                        <Link 
                          to={`/product/${item.productId}`}
                          className="font-semibold text-foreground story-link"
                        >
                          {item.name}
                        </Link>
                        <p className="text-sm text-muted-foreground">SKU: {item.sku}</p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveItem(item.productId)}
                        disabled={removeItemMutation.isPending}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <QtyStepper
                          value={item.quantity}
                          onChange={(quantity) => handleUpdateQuantity(item.productId, quantity)}
                          min={1}
                          max={999}
                          disabled={updateItemMutation.isPending}
                          size="sm"
                        />
                        <span className="text-sm text-muted-foreground">
                          ${item.unitPrice.toFixed(2)} each
                        </span>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-foreground">
                          ${item.lineTotal.toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Order summary */}
        <div>
          <Card className="sticky top-8">
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Subtotal ({cart.items.reduce((sum, item) => sum + item.quantity, 0)} items)</span>
                  <span>${cart.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax</span>
                  <span>${cart.tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>{cart.shipping === 0 ? 'Free' : `$${cart.shipping.toFixed(2)}`}</span>
                </div>
                {cart.subtotal < 75 && cart.shipping > 0 && (
                  <p className="text-xs text-muted-foreground">
                    Free shipping on orders over $75
                  </p>
                )}
              </div>

              <div className="border-t pt-4">
                <div className="flex justify-between text-lg font-semibold">
                  <span>Total</span>
                  <span>${cart.total.toFixed(2)}</span>
                </div>
              </div>

              <Button 
                className="w-full" 
                onClick={handleProceedToCheckout}
                disabled={validateCartMutation.isPending}
              >
                {validateCartMutation.isPending ? (
                  'Validating...'
                ) : (
                  <>
                    Proceed to Checkout
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>

              <Button 
                variant="outline" 
                className="w-full"
                asChild
              >
                <Link to="/catalog">
                  Continue Shopping
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Cart;