import { useState, useMemo, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, ShoppingCart, Star, Clock, Calendar, AlertTriangle } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { useAuthStore } from '@/stores/auth';
import { api } from '@/lib/apiClient';
import { moqConfig } from '@/mocks/seed';
import QtyStepper from '@/components/shared/QtyStepper';
import ProductCard from '@/components/shared/ProductCard';
import EmptyState from '@/components/shared/EmptyState';

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { isAuthenticated, isEmailVerified } = useAuthStore();

  // Product query
  const { data: product, isLoading, error } = useQuery({
    queryKey: ['product', id],
    queryFn: () => api.products.get(id!),
    enabled: !!id,
  });

  // MOQ configuration for this product
  const moq = useMemo(() => {
    if (!product) return { minOrderQty: 1, increment: 1, defaultQty: 1 };
    return moqConfig[product.sku] || { minOrderQty: 1, increment: 1, defaultQty: 1 };
  }, [product]);

  // Initialize quantity with minimum order quantity when product is available
  const [quantity, setQuantity] = useState(() => {
    return product ? moq.minOrderQty : 1;
  });

  // Update quantity when product loads and MOQ is available
  useEffect(() => {
    if (product) {
      const productMoq = moqConfig[product.sku] || { minOrderQty: 1, increment: 1, defaultQty: 1 };
      if (quantity < productMoq.minOrderQty) {
        setQuantity(productMoq.minOrderQty);
      }
    }
  }, [product]);

  // Related products query
  const { data: relatedProducts } = useQuery({
    queryKey: ['products', 'related', product?.categoryId],
    queryFn: () => api.products.list({ 
      categoryId: product?.categoryId,
      pageSize: 4
    }),
    enabled: !!product?.categoryId,
  });

  // Add to cart mutation
  const addToCartMutation = useMutation({
    mutationFn: ({ productId, qty }: { productId: string; qty: number }) => 
      api.cart.add(productId, qty),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
      toast({
        title: 'Added to cart',
        description: `${quantity} ${product?.name} added to your cart.`,
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to add product to cart',
        variant: 'destructive',
      });
    },
  });

  // Quantity validation and helpers
  const isValidQuantity = useMemo(() => {
    const { minOrderQty = 1, increment = 1 } = moq;
    return quantity >= minOrderQty && (quantity - minOrderQty) % increment === 0;
  }, [quantity, moq]);

  const suggestedQuantity = useMemo(() => {
    const { minOrderQty = 1, increment = 1 } = moq;
    if (quantity < minOrderQty) return minOrderQty;
    if ((quantity - minOrderQty) % increment !== 0) {
      return minOrderQty + Math.ceil((quantity - minOrderQty) / increment) * increment;
    }
    return quantity;
  }, [quantity, moq]);

  const showPricing = isAuthenticated && isEmailVerified;

  const handleAddToCart = () => {
    if (!product) return;
    const finalQuantity = isValidQuantity ? quantity : suggestedQuantity;
    addToCartMutation.mutate({ productId: product.id, qty: finalQuantity });
  };

  const handleBuyNow = () => {
    handleAddToCart();
    navigate('/cart');
  };

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <EmptyState
          icon={<AlertTriangle className="h-12 w-12" />}
          title="Product Not Found"
          description="The product you're looking for doesn't exist or has been removed."
          action={{
            label: 'Browse Catalog',
            onClick: () => navigate('/catalog'),
          }}
        />
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb skeleton */}
        <div className="mb-6">
          <Skeleton className="h-4 w-48" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Image skeleton */}
          <div>
            <Skeleton className="aspect-square rounded-2xl" />
          </div>

          {/* Details skeleton */}
          <div className="space-y-6">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-24 w-full" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-1/4" />
              <Skeleton className="h-8 w-1/3" />
            </div>
            <Skeleton className="h-12 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) return null;

  const relatedProductsData = relatedProducts?.data.filter(p => p.id !== product.id).slice(0, 4) || [];

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="mb-6 animate-fade-in">
        <ol className="flex items-center space-x-2 text-sm text-muted-foreground">
          <li>
            <Link to="/" className="hover:text-foreground transition-colors">
              Home
            </Link>
          </li>
          <li>/</li>
          <li>
            <Link to="/catalog" className="hover:text-foreground transition-colors">
              Catalog
            </Link>
          </li>
          <li>/</li>
          <li>
            <Link 
              to={`/catalog?category=${product.categoryId}`}
              className="hover:text-foreground transition-colors"
            >
              {product.categoryName}
            </Link>
          </li>
          <li>/</li>
          <li className="text-foreground font-medium">{product.name}</li>
        </ol>
      </nav>

      {/* Back button */}
      <Button 
        variant="ghost" 
        onClick={() => navigate(-1)}
        className="mb-6 animate-fade-in"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back
      </Button>

      {/* Product details */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        {/* Product image */}
        <div className="animate-fade-in">
          <div className="aspect-square bg-muted rounded-2xl overflow-hidden">
            <img 
              src={product.imageUrls[0]} 
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Product info */}
        <div className="space-y-6 animate-fade-in">
          {/* Header */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="secondary">{product.categoryName}</Badge>
              <Badge 
                variant={product.inventory > 10 ? "default" : product.inventory > 0 ? "warning" : "destructive"}
              >
                {product.inventory > 10 ? 'In Stock' : product.inventory > 0 ? 'Low Stock' : 'Out of Stock'}
              </Badge>
            </div>
            <h1 className="text-3xl font-bold text-foreground mb-2">{product.name}</h1>
            <p className="text-lg text-muted-foreground">{product.description}</p>
          </div>

          {/* Product details */}
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-foreground mb-2">Product Details</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">SKU:</span>
                  <span className="ml-2 font-medium">{product.sku}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Available:</span>
                  <span className="ml-2 font-medium">{product.inventory} units</span>
                </div>
                {product.leadTimeDays > 0 && (
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 text-muted-foreground mr-2" />
                    <span className="text-muted-foreground">{product.leadTimeDays} day lead time</span>
                  </div>
                )}
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 text-muted-foreground mr-2" />
                  <span className="text-muted-foreground">
                    Available: {product.availableDays.join(', ')}
                  </span>
                </div>
              </div>
            </div>

            {/* Tags */}
            <div>
              <h3 className="font-semibold text-foreground mb-2">Features</h3>
              <div className="flex flex-wrap gap-2">
                {product.tags.map(tag => (
                  <Badge key={tag} variant="outline">{tag}</Badge>
                ))}
              </div>
            </div>

            {/* Allergens */}
            {product.allergens.length > 0 && (
              <div>
                <h3 className="font-semibold text-foreground mb-2">Allergen Information</h3>
                <div className="flex flex-wrap gap-2">
                  {product.allergens.map(allergen => (
                    <Badge key={allergen} variant="destructive">{allergen}</Badge>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Pricing and purchase */}
          <Card className="p-6 bg-muted/30">
            {showPricing ? (
              <div className="space-y-4">
                <div className="flex items-baseline justify-between">
                  <span className="text-3xl font-bold text-foreground">
                    {product.formattedPrice}
                  </span>
                  <span className="text-muted-foreground">per unit</span>
                </div>

                {/* MOQ information */}
                <div className="text-sm text-muted-foreground space-y-1">
                  {moq.minOrderQty > 1 && (
                    <p>Minimum order: {moq.minOrderQty} units</p>
                  )}
                  {moq.increment > 1 && (
                    <p>Sold in increments of: {moq.increment}</p>
                  )}
                </div>

                {/* Quantity selector */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Quantity</label>
                  <div className="flex items-center gap-4">
                    <QtyStepper
                      value={quantity}
                      onChange={setQuantity}
                      min={moq.minOrderQty || 1}
                      max={product.inventory}
                      increment={moq.increment || 1}
                      disabled={product.inventory === 0}
                    />
                    {!isValidQuantity && (
                      <p className="text-sm text-warning">
                        Rounded to: {suggestedQuantity} units
                      </p>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Total: {(product.price * (isValidQuantity ? quantity : suggestedQuantity)).toFixed(2)}
                  </p>
                </div>

                {/* Action buttons */}
                <div className="flex gap-3">
                  <Button 
                    className="flex-1"
                    onClick={handleBuyNow}
                    disabled={product.inventory === 0 || addToCartMutation.isPending}
                  >
                    <ShoppingCart className="mr-2 h-4 w-4" />
                    Buy Now
                  </Button>
                  <Button 
                    variant="outline" 
                    className="flex-1"
                    onClick={handleAddToCart}
                    disabled={product.inventory === 0 || addToCartMutation.isPending}
                  >
                    Add to Cart
                  </Button>
                </div>
              </div>
            ) : (
              <div className="text-center space-y-4">
                <p className="text-muted-foreground">
                  Wholesale pricing and ordering available to verified business accounts
                </p>
                <div className="flex gap-3">
                  <Button asChild className="flex-1">
                    <Link to="/login">Sign In</Link>
                  </Button>
                  <Button variant="outline" asChild className="flex-1">
                    <Link to="/register">Request Access</Link>
                  </Button>
                </div>
              </div>
            )}
          </Card>
        </div>
      </div>

      {/* Related products */}
      {relatedProductsData.length > 0 && (
        <section className="animate-fade-in">
          <h2 className="text-2xl font-bold text-foreground mb-6">More from {product.categoryName}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProductsData.map((relatedProduct) => (
              <ProductCard
                key={relatedProduct.id}
                product={relatedProduct}
                onAddToCart={(productId, qty) => 
                  addToCartMutation.mutate({ productId, qty })
                }
                isLoading={addToCartMutation.isPending}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default ProductDetail;