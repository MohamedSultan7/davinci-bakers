import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CreditCard, Truck, FileText, Calendar } from 'lucide-react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { api } from '@/lib/apiClient';
import { deliveryAddresses } from '@/mocks/seed';

const checkoutSchema = z.object({
  deliveryAddressId: z.string().min(1, 'Please select a delivery address'),
  requestedDate: z.string().optional(),
  poNumber: z.string().optional(),
  notes: z.string().max(280, 'Notes must be 280 characters or less').optional(),
});

type CheckoutForm = z.infer<typeof checkoutSchema>;

const Checkout = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);

  const { data: cart } = useQuery({
    queryKey: ['cart'],
    queryFn: () => api.cart.get(),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CheckoutForm>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      deliveryAddressId: deliveryAddresses[0]?.id,
    },
  });

  const createOrderMutation = useMutation({
    mutationFn: async (data: CheckoutForm) => {
      // Mock payment flow
      const paymentIntent = await api.payments.createIntent(cart?.total || 0);
      await api.payments.confirm(paymentIntent.clientSecret);
      
      return api.orders.create({
        ...data,
        paymentIntentId: paymentIntent.clientSecret,
      });
    },
    onSuccess: (order) => {
      toast({
        title: 'Order placed successfully!',
        description: `Order #${order.orderNumber} has been created.`,
      });
      navigate(`/orders/${order.id}`);
    },
    onError: (error: any) => {
      toast({
        title: 'Order failed',
        description: error.message,
        variant: 'destructive',
      });
      setIsProcessing(false);
    },
  });

  const onSubmit = async (data: CheckoutForm) => {
    setIsProcessing(true);
    createOrderMutation.mutate(data);
  };

  if (!cart || cart.items.length === 0) {
    navigate('/cart');
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Checkout</h1>
      
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {/* Delivery Address */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Truck className="mr-2 h-5 w-5" />
                  Delivery Address
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {deliveryAddresses.map((address) => (
                    <label key={address.id} className="flex items-start space-x-3 cursor-pointer">
                      <input
                        type="radio"
                        value={address.id}
                        {...register('deliveryAddressId')}
                        className="mt-1"
                      />
                      <div className="flex-1">
                        <p className="font-medium">{address.companyName}</p>
                        <p className="text-sm text-muted-foreground">
                          {address.streetAddress}, {address.city}, {address.state} {address.zipCode}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {address.contactName} • {address.contactPhone}
                        </p>
                      </div>
                    </label>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Order Details */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileText className="mr-2 h-5 w-5" />
                  Order Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="requestedDate">Preferred Delivery Date</Label>
                  <Input
                    id="requestedDate"
                    type="date"
                    {...register('requestedDate')}
                  />
                </div>
                <div>
                  <Label htmlFor="poNumber">PO Number (Optional)</Label>
                  <Input
                    id="poNumber"
                    placeholder="Enter your PO number"
                    {...register('poNumber')}
                  />
                </div>
                <div>
                  <Label htmlFor="notes">Special Instructions (Optional)</Label>
                  <Textarea
                    id="notes"
                    placeholder="Delivery instructions, special requests..."
                    {...register('notes')}
                    className="min-h-[80px]"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Payment */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CreditCard className="mr-2 h-5 w-5" />
                  Payment Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="p-4 bg-muted/50 rounded-lg text-center">
                  <p className="text-muted-foreground mb-2">Mock Payment Processing</p>
                  <p className="text-sm">Payment will be processed securely</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <Card className="h-fit">
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                {cart.items.map((item) => (
                  <div key={item.productId} className="flex justify-between text-sm">
                    <span>{item.name} × {item.quantity}</span>
                    <span>${item.lineTotal.toFixed(2)}</span>
                  </div>
                ))}
              </div>
              
              <div className="border-t pt-4 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Subtotal</span>
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
                <div className="flex justify-between font-semibold text-lg border-t pt-2">
                  <span>Total</span>
                  <span>${cart.total.toFixed(2)}</span>
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full" 
                disabled={isProcessing}
              >
                {isProcessing ? 'Processing...' : 'Place Order'}
              </Button>
            </CardContent>
          </Card>
        </div>
      </form>
    </div>
  );
};

export default Checkout;