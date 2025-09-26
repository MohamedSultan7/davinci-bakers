import { Product } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/stores/auth';
import { Link } from 'react-router-dom';

interface ProductCardProps {
  product: Product;
  onAddToCart?: (productId: string, quantity: number) => void;
  isLoading?: boolean;
}

const ProductCard = ({ product, onAddToCart, isLoading }: ProductCardProps) => {
  const { isAuthenticated, isEmailVerified } = useAuthStore();
  const showPricing = isAuthenticated && isEmailVerified;

  return (
    <Card className="group hover:shadow-lg transition-all duration-300 animate-fade-in hover-scale">
      <CardContent className="p-0">
        {/* Image */}
        <div className="aspect-square bg-muted rounded-t-2xl overflow-hidden">
          <img 
            src={product.imageUrls[0]} 
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
        
        <div className="p-6">
          {/* Category and Stock */}
          <div className="flex items-center justify-between mb-2">
            <Badge variant="secondary" className="text-xs">
              {product.categoryName}
            </Badge>
            <Badge 
              variant={product.inventory > 10 ? "default" : product.inventory > 0 ? "warning" : "destructive"}
              className="text-xs"
            >
              {product.inventory > 10 ? 'In Stock' : product.inventory > 0 ? 'Low Stock' : 'Out of Stock'}
            </Badge>
          </div>

          {/* Name */}
          <h3 className="font-semibold text-lg text-foreground mb-2 line-clamp-1">
            {product.name}
          </h3>

          {/* Description */}
          <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
            {product.description}
          </p>

          {/* Tags */}
          <div className="flex flex-wrap gap-1 mb-4">
            {product.tags.slice(0, 2).map(tag => (
              <Badge key={tag} variant="outline" className="text-xs px-2 py-0">
                {tag}
              </Badge>
            ))}
            {product.tags.length > 2 && (
              <Badge variant="outline" className="text-xs px-2 py-0">
                +{product.tags.length - 2}
              </Badge>
            )}
          </div>

          {/* Pricing */}
          <div className="mb-4">
            {showPricing ? (
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold text-foreground">
                  {product.formattedPrice}
                </span>
                <span className="text-sm text-muted-foreground">
                  SKU: {product.sku}
                </span>
              </div>
            ) : (
              <div className="text-center p-3 bg-muted/50 rounded-lg">
                <p className="text-sm text-muted-foreground mb-1">Wholesale pricing available</p>
                <Link to="/login" className="text-primary text-sm story-link">
                  Sign in to view prices
                </Link>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              className="flex-1" 
              asChild
            >
              <Link to={`/product/${product.id}`}>
                View Details
              </Link>
            </Button>
            
            {showPricing && product.inventory > 0 && (
              <Button 
                className="flex-1"
                onClick={() => onAddToCart?.(product.id, 1)}
                disabled={isLoading}
              >
                {isLoading ? 'Adding...' : 'Add to Cart'}
              </Button>
            )}
          </div>

          {/* Lead time info */}
          {product.leadTimeDays > 0 && (
            <p className="text-xs text-muted-foreground mt-2 text-center">
              {product.leadTimeDays} day lead time
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductCard;