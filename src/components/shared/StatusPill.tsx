import { Order } from '@/types';
import { Badge } from '@/components/ui/badge';

interface StatusPillProps {
  status: Order['status'] | Order['paymentStatus'];
  type?: 'order' | 'payment';
}

const StatusPill = ({ status, type = 'order' }: StatusPillProps) => {
  const getStatusConfig = () => {
    if (type === 'payment') {
      switch (status) {
        case 'paid':
          return { variant: 'default' as const, label: 'Paid' };
        case 'pending':
          return { variant: 'warning' as const, label: 'Pending' };
        case 'failed':
          return { variant: 'destructive' as const, label: 'Failed' };
        case 'refunded':
          return { variant: 'secondary' as const, label: 'Refunded' };
        default:
          return { variant: 'secondary' as const, label: status };
      }
    } else {
      switch (status) {
        case 'placed':
          return { variant: 'secondary' as const, label: 'Order Placed' };
        case 'confirmed':
          return { variant: 'warning' as const, label: 'Confirmed' };
        case 'preparing':
          return { variant: 'warning' as const, label: 'Preparing' };
        case 'ready':
          return { variant: 'default' as const, label: 'Ready' };
        case 'delivered':
          return { variant: 'default' as const, label: 'Delivered' };
        case 'cancelled':
          return { variant: 'destructive' as const, label: 'Cancelled' };
        default:
          return { variant: 'secondary' as const, label: status };
      }
    }
  };

  const { variant, label } = getStatusConfig();

  return (
    <Badge variant={variant} className="animate-fade-in">
      {label}
    </Badge>
  );
};

export default StatusPill;