import { useQuery } from '@tanstack/react-query';
import { Package, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { api } from '@/lib/apiClient';
import StatusPill from '@/components/shared/StatusPill';
import EmptyState from '@/components/shared/EmptyState';
import { Link } from 'react-router-dom';
import { useState } from 'react';

const Orders = () => {
  const [statusFilter, setStatusFilter] = useState('all');

  const { data: ordersResponse, isLoading } = useQuery({
    queryKey: ['orders', statusFilter],
    queryFn: () => api.orders.list(statusFilter === 'all' ? undefined : statusFilter),
  });

  const orders = ordersResponse?.data || [];
  const statusOptions = [
    { value: 'all', label: 'All Orders' },
    { value: 'placed', label: 'Placed' },
    { value: 'confirmed', label: 'Confirmed' },
    { value: 'preparing', label: 'Preparing' },
    { value: 'ready', label: 'Ready' },
    { value: 'delivered', label: 'Delivered' },
    { value: 'cancelled', label: 'Cancelled' },
  ];

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-4 bg-muted rounded w-1/4 mb-2" />
                <div className="h-4 bg-muted rounded w-1/2" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Order History</h1>

      {/* Filters */}
      <div className="flex flex-wrap gap-2 mb-6">
        {statusOptions.map((option) => (
          <Button
            key={option.value}
            variant={statusFilter === option.value ? 'default' : 'outline'}
            size="sm"
            onClick={() => setStatusFilter(option.value)}
          >
            {option.label}
          </Button>
        ))}
      </div>

      {orders.length === 0 ? (
        <EmptyState
          icon={<Package className="h-16 w-16" />}
          title="No orders found"
          description="You haven't placed any orders yet, or no orders match the selected filter."
          action={{
            label: 'Start Shopping',
            onClick: () => window.location.href = '/catalog',
          }}
        />
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <Card key={order.id} className="hover:shadow-lg transition-shadow animate-fade-in">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <Link to={`/orders/${order.id}`} className="text-lg font-semibold story-link">
                      Order #{order.orderNumber}
                    </Link>
                    <p className="text-muted-foreground">
                      Placed on {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <StatusPill status={order.status} type="order" />
                    <StatusPill status={order.paymentStatus} type="payment" />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Items</p>
                    <p className="font-medium">{order.items.length} products</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total</p>
                    <p className="font-medium">${order.total.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Delivery</p>
                    <p className="font-medium">{order.deliveryAddress.companyName}</p>
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <div className="text-sm text-muted-foreground">
                    {order.requestedDate && (
                      <span>Requested: {new Date(order.requestedDate).toLocaleDateString()}</span>
                    )}
                  </div>
                  <Link to={`/orders/${order.id}`}>
                    <Button variant="outline" size="sm">
                      View Details
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;