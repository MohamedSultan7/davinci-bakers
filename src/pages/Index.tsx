import { Link } from 'react-router-dom';
import { ArrowRight, Clock, Shield, Truck, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import heroImage from '@/assets/hero-bakery.jpg';

const Index = () => {
  return (
    <div className="bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background with gradient overlay */}
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${heroImage})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/80 to-background/60"></div>
        </div>
        
        <div className="relative container mx-auto px-4 py-24 lg:py-32">
          <div className="max-w-3xl">
            {/* B2B Badge */}
            <Badge variant="secondary" className="mb-6 px-4 py-2 text-sm font-medium">
              B2B Wholesale Only • Licensed Partners
            </Badge>
            
            {/* Main heading */}
            <h1 className="text-5xl lg:text-6xl font-bold text-foreground leading-tight mb-6">
              Premium Artisan Breads
              <span className="block text-primary">for Your Business</span>
            </h1>
            
            {/* Description */}
            <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
              Supply your restaurant, café, or market with our handcrafted sourdough, 
              European-style baguettes, and seasonal specialties. Same-day delivery 
              across the Pacific Northwest.
            </p>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              <Button size="lg" asChild className="text-lg px-8 py-4">
                <Link to="/catalog">
                  Browse Catalog <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" asChild className="text-lg px-8 py-4">
                <Link to="/register">
                  Request Wholesale Access
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* B2B Features */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Why Businesses Choose Us
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              We understand the demands of commercial kitchens and the importance 
              of consistent, reliable supply.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Truck className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">Same-Day Delivery</h3>
                <p className="text-muted-foreground text-sm">
                  Orders placed by 10 AM delivered same business day throughout Portland and Seattle metro.
                </p>
              </CardContent>
            </Card>
            
            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Shield className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">Quality Guaranteed</h3>
                <p className="text-muted-foreground text-sm">
                  100% satisfaction guarantee on all products. HACCP certified facility with full traceability.
                </p>
              </CardContent>
            </Card>
            
            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Clock className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">Flexible Ordering</h3>
                <p className="text-muted-foreground text-sm">
                  Schedule recurring deliveries or place one-time orders. Custom lead times for special requests.
                </p>
              </CardContent>
            </Card>
            
            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">Dedicated Support</h3>
                <p className="text-muted-foreground text-sm">
                  Personal account managers and priority phone support during business hours.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Product Showcase */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Artisan Crafted Daily
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              From our 100-year-old sourdough starter to traditional French techniques, 
              every loaf is made with passion and precision.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-24 h-24 bg-gradient-to-br from-primary/20 to-accent/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🍞</span>
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">Classic Sourdough</h3>
              <p className="text-muted-foreground">
                Traditional San Francisco-style sourdough with signature tang and perfect crust.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-24 h-24 bg-gradient-to-br from-primary/20 to-accent/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🥖</span>
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">French Baguettes</h3>
              <p className="text-muted-foreground">
                Authentic French baguettes with golden crust and airy interior, baked fresh daily.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-24 h-24 bg-gradient-to-br from-primary/20 to-accent/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🥐</span>
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">Laminated Pastries</h3>
              <p className="text-muted-foreground">
                Buttery croissants and Danish pastries made with European butter and technique.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary/5">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-foreground mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join over 200 restaurants, cafés, and gourmet markets who trust us 
            for their daily bread supply.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild className="text-lg px-8 py-4">
              <Link to="/catalog">
                View Products <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button variant="outline" size="lg" asChild className="text-lg px-8 py-4">
              <Link to="/register">
                Apply for Account
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
