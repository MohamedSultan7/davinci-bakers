import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Search, Filter, X } from 'lucide-react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { api } from '@/lib/apiClient';
import ProductCard from '@/components/shared/ProductCard';
import EmptyState from '@/components/shared/EmptyState';
import { moqConfig } from '@/mocks/seed';

const Catalog = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '');

  // Categories query
  const { data: categories = [] } = useQuery({
    queryKey: ['categories'],
    queryFn: () => api.categories.list(),
  });

  // Products query
  const { data: productsResponse, isLoading, error, refetch } = useQuery({
    queryKey: ['products', search, selectedCategory],
    queryFn: () => api.products.list({
      search: search || undefined,
      categoryId: selectedCategory || undefined,
      page: 1,
      pageSize: 12,
    }),
  });

  // Add to cart mutation
  const [addingToCart, setAddingToCart] = useState<string | null>(null);

  const handleAddToCart = async (productId: string, quantity: number) => {
    try {
      setAddingToCart(productId);
      
      // Find the product to get its SKU
      const product = products.find(p => p.id === productId);
      if (!product) {
        throw new Error('Product not found');
      }
      
      // Get MOQ configuration for this product
      const moq = moqConfig[product.sku] || { minOrderQty: 1, increment: 1, defaultQty: 1 };
      
      // Use the minimum order quantity instead of the passed quantity
      const finalQuantity = moq.minOrderQty;
      
      await api.cart.add(productId, finalQuantity);
      
      // Invalidate cart queries to update the cart UI
      queryClient.invalidateQueries({ queryKey: ['cart'] });
      
      toast({
        title: 'Added to cart',
        description: `${finalQuantity} ${product.name} added to your cart.`,
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to add product to cart',
        variant: 'destructive',
      });
    } finally {
      setAddingToCart(null);
    }
  };

  // Update URL params when filters change
  useEffect(() => {
    const params = new URLSearchParams();
    if (search) params.set('search', search);
    if (selectedCategory) params.set('category', selectedCategory);
    setSearchParams(params);
  }, [search, selectedCategory, setSearchParams]);

  const clearFilters = () => {
    setSearch('');
    setSelectedCategory('');
  };

  const hasActiveFilters = search || selectedCategory;
  const products = productsResponse?.data || [];

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <EmptyState
          icon={<X className="h-12 w-12" />}
          title="Error Loading Products"
          description="We couldn't load the product catalog. Please try again."
          action={{
            label: 'Retry',
            onClick: () => refetch(),
          }}
        />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-foreground mb-2">Product Catalog</h1>
        <p className="text-lg text-muted-foreground">
          Discover our premium selection of artisan breads and pastries
        </p>
      </div>

      {/* Filters */}
      <Card className="mb-8">
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search products..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Category Filter */}
            <div className="flex flex-wrap gap-2">
              <Button
                variant={selectedCategory === '' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedCategory('')}
              >
                All Categories
              </Button>
              {categories.map((category) => (
                <Button
                  key={category.id}
                  variant={selectedCategory === category.id ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedCategory(category.id)}
                >
                  {category.name}
                </Button>
              ))}
            </div>

            {/* Clear Filters */}
            {hasActiveFilters && (
              <Button variant="ghost" size="sm" onClick={clearFilters}>
                <X className="h-4 w-4 mr-2" />
                Clear
              </Button>
            )}
          </div>

          {/* Active Filters */}
          {hasActiveFilters && (
            <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t">
              {search && (
                <Badge variant="secondary" className="gap-1">
                  Search: {search}
                  <X 
                    className="h-3 w-3 cursor-pointer" 
                    onClick={() => setSearch('')}
                  />
                </Badge>
              )}
              {selectedCategory && (
                <Badge variant="secondary" className="gap-1">
                  Category: {categories.find(c => c.id === selectedCategory)?.name}
                  <X 
                    className="h-3 w-3 cursor-pointer" 
                    onClick={() => setSelectedCategory('')}
                  />
                </Badge>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Results */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <Card key={i} className="overflow-hidden">
              <Skeleton className="aspect-square" />
              <CardContent className="p-6">
                <Skeleton className="h-4 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/2 mb-4" />
                <Skeleton className="h-16 w-full mb-4" />
                <Skeleton className="h-10 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : products.length === 0 ? (
        <EmptyState
          icon={<Filter className="h-12 w-12" />}
          title="No Products Found"
          description={
            hasActiveFilters 
              ? "No products match your current filters. Try adjusting your search criteria."
              : "No products are currently available in our catalog."
          }
          action={hasActiveFilters ? {
            label: 'Clear Filters',
            onClick: clearFilters,
          } : undefined}
        />
      ) : (
        <>
          {/* Results count */}
          <div className="mb-6">
            <p className="text-muted-foreground">
              Showing {products.length} of {productsResponse?.total || 0} products
            </p>
          </div>

          {/* Products grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={handleAddToCart}
                isLoading={addingToCart === product.id}
              />
            ))}
          </div>

          {/* Load more / Pagination placeholder */}
          {productsResponse && productsResponse.totalPages > 1 && (
            <div className="text-center">
              <Button variant="outline" disabled>
                Load More Products (Coming Soon)
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Catalog;