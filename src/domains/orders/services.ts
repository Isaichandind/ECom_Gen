import { createClient } from '@/shared/lib/supabase/server';
import { createAdminClient } from '@/shared/lib/supabase/admin';
import { Order, OrderItem } from './types';

export async function createOrder(
  profileId: string,
  totalAmount: number,
  items: { productId: string; quantity: number; unitPrice: number }[]
): Promise<Order> {
  const supabaseAdmin = createAdminClient();
  
  const { data: order, error: orderError } = await supabaseAdmin
    .from('orders')
    .insert({
      profile_id: profileId,
      total_amount: totalAmount,
      status: 'pending'
    })
    .select()
    .single();

  if (orderError) throw orderError;

  const orderItems = items.map(item => ({
    order_id: order.id,
    product_id: item.productId,
    quantity: item.quantity,
    unit_price: item.unitPrice,
  }));

  const { error: itemsError } = await supabaseAdmin
    .from('order_items')
    .insert(orderItems);

  if (itemsError) throw itemsError;

  return order as Order;
}

export async function submitOrderUTR(orderId: string, utr: string): Promise<Order> {
  const supabaseAdmin = createAdminClient();
  
  const { data, error } = await supabaseAdmin
    .from('orders')
    .update({ 
      transaction_ref: utr,
      status: 'pending_verification',
      updated_at: new Date().toISOString()
    })
    .eq('id', orderId)
    .select()
    .single();

  if (error) throw error;
  return data as Order;
}

export async function updateOrderStatus(orderId: string, status: Order['status']) {
  const supabaseAdmin = createAdminClient();
  
  const { data, error } = await supabaseAdmin
    .from('orders')
    .update({ 
      status, 
      updated_at: new Date().toISOString()
    })
    .eq('id', orderId)
    .select()
    .single();

  if (error) throw error;
  return data as Order;
}

export async function getUserOrders(profileId: string): Promise<Order[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .eq('profile_id', profileId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data as Order[];
}

export async function getAdminOrders(page: number, limit: number, status?: Order['status']) {
  const supabase = createAdminClient();
  
  let query = supabase
    .from('orders')
    .select('*, profiles(username, email)', { count: 'exact' });
    
  if (status) {
    query = query.eq('status', status);
  }

  const from = (page - 1) * limit;
  const to = from + limit - 1;

  const { data, error, count } = await query
    .order('created_at', { ascending: false })
    .range(from, to);

  if (error) throw error;
  return { orders: data, count };
}
