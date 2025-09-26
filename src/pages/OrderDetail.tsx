import { useParams, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ArrowLeft, RotateCcw, MapPin, Calendar, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { api } from '@/lib/apiClient';
import StatusPill from '@/components/shared/StatusPill';
import EmptyState from '@/components/shared/EmptyState';

const OrderDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: order, isLoading } = useQuery({
    queryKey: ['order', id],
    queryFn: () => api.orders.get(id!),
    enabled: !!id,
    refetchInterval: 30000, // Poll every 30 seconds for status updates
  });

  const reorderMutation = useMutation({
    mutationFn: () => api.orders.reorder(id!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
      toast({
        title: 'Items added to cart',
        description: 'All items from this order have been added to your cart.',
      });
    },
  });

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-muted rounded w-1/3" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4">
              <div className="h-32 bg-muted rounded" />
              <div className="h-48 bg-muted rounded" />
            </div>
            <div className="h-64 bg-muted rounded" />
          </div>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="container mx-auto px-4 py-8">
        <EmptyState
          title="Order not found"
          description="The order you're looking for doesn't exist or you don't have access to it."
          action={{
            label: 'View All Orders',
            onClick: () => window.location.href = '/orders',
          }}
        />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Button variant="ghost" asChild>
          <Link to="/orders">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Orders
          </Link>
        </Button>
      </div>

      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Order #{order.orderNumber}</h1>
          <p className="text-muted-foreground">
            Placed on {new Date(order.createdAt).toLocaleDateString()}
          </p>
        </div>
        <div className="flex gap-2">
          <StatusPill status={order.status} type="order" />
          <StatusPill status={order.paymentStatus} type="payment" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {/* Order Items */}
          <Card>
            <CardHeader>
              <CardTitle>Order Items</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {order.items.map((item, index) => (
                  <div key={index} className="flex justify-between items-center py-3 border-b last:border-b-0">
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-muted-foreground">SKU: {item.sku}</p>
                      <p className="text-sm text-muted-foreground">
                        ${item.unitPrice.toFixed(2)} × {item.quantity}
                      </p>
                    </div>
                    <p className="font-semibold">${item.lineTotal.toFixed(2)}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Order Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MapPin className="mr-2 h-5 w-5" />
                  Delivery Address
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-1">
                  <p className="font-medium">{order.deliveryAddress.companyName}</p>
                  <p>{order.deliveryAddress.streetAddress}</p>
                  <p>{order.deliveryAddress.city}, {order.deliveryAddress.state} {order.deliveryAddress.zipCode}</p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Contact: {order.deliveryAddress.contactName}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Phone: {order.deliveryAddress.contactPhone}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileText className="mr-2 h-5 w-5" />
                  Order Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {order.requestedDate && (
                  <div>
                    <p className="text-sm text-muted-foreground">Requested Delivery</p>
                    <p className="font-medium">{new Date(order.requestedDate).toLocaleDateString()}</p>
                  </div>
                )}
                {order.deliveredDate && (
                  <div>
                    <p className="text-sm text-muted-foreground">Delivered</p>
                    <p className="font-medium">{new Date(order.deliveredDate).toLocaleDateString()}</p>
                  </div>
                )}
                {order.poNumber && (
                  <div>
                    <p className="text-sm text-muted-foreground">PO Number</p>
                    <p className="font-medium">{order.poNumber}</p>
                  </div>
                )}
                {order.notes && (
                  <div>
                    <p className="text-sm text-muted-foreground">Notes</p>
                    <p className="font-medium">{order.notes}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Summary */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>${order.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax</span>
                  <span>${order.tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>{order.shipping === 0 ? 'Free' : `$${order.shipping.toFixed(2)}`}</span>
                </div>
              </div>
              <div className="border-t pt-4">
                <div className="flex justify-between text-lg font-semibold">
                  <span>Total</span>
                  <span>${order.total.toFixed(2)}</span>
                </div>
              </div>
              <Button 
                className="w-full"
                onClick={() => reorderMutation.mutate()}
                disabled={reorderMutation.isPending}
              >
                <RotateCcw className="mr-2 h-4 w-4" />
                {reorderMutation.isPending ? 'Adding...' : 'Reorder'}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;