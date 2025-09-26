const Footer = () => {
  return (
    <footer className="bg-muted/30 border-t border-border mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-12 h-12 rounded-full">
                 <img src='/favicon.png'></img>
              </div>
              <span className="font-semibold text-foreground">DaVinci Bakers</span>
            </div>
            <p className="text-muted-foreground text-sm">
              Premium wholesale bakery serving the finest artisan breads to restaurants, 
              cafes, and gourmet markets since 1995.
            </p>
          </div>

          {/* Products */}
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground">Our Products</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="/catalog?category=sourdough" className="text-muted-foreground hover:text-foreground transition-colors">Sourdough</a></li>
              <li><a href="/catalog?category=baguettes" className="text-muted-foreground hover:text-foreground transition-colors">Baguettes</a></li>
              <li><a href="/catalog?category=pastries" className="text-muted-foreground hover:text-foreground transition-colors">Pastries</a></li>
              <li><a href="/catalog?category=gluten-free" className="text-muted-foreground hover:text-foreground transition-colors">Gluten-Free</a></li>
            </ul>
          </div>

          {/* Services */}
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground">Services</h3>
            <ul className="space-y-2 text-sm">
              <li className="text-muted-foreground">Same-Day Delivery</li>
              <li className="text-muted-foreground">Custom Orders</li>
              <li className="text-muted-foreground">Weekly Subscriptions</li>
              <li className="text-muted-foreground">Bulk Pricing</li>
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground">Contact</h3>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>Mon-Fri: 5:00 AM - 2:00 PM</p>
              <p>Orders: (555) 123-BREAD</p>
              <p>orders@artisanbakery.com</p>
            </div>
          </div>
        </div>

        <div className="border-t border-border mt-8 pt-6 text-center">
          <p className="text-muted-foreground text-sm">
            © 2024 DaVinci Bakers. All rights reserved. B2B wholesale only.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;