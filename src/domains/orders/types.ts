export type OrderStatus = 'pending' | 'pending_verification' | 'paid' | 'shipped' | 'delivered' | 'cancelled';

export interface Order {
  id: string;
  profile_id: string | null;
  transaction_ref: string | null;
  status: OrderStatus;
  total_amount: number;
  created_at: string;
  updated_at: string;
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  quantity: number;
  unit_price: number;
  created_at: string;
}
