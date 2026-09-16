import { createClient } from '@supabase/supabase-js';
import { Product } from './types';

// Use service role key to bypass RLS for public product catalog
const getAdminSupabase = () => createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function getProducts(): Promise<Product[]> {
  const supabase = getAdminSupabase();
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data as Product[];
}

export async function getProductById(id: string): Promise<Product> {
  const supabase = getAdminSupabase();
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;
  return data as Product;
}

export async function reserveInventory(productId: string, quantity: number): Promise<boolean> {
  const supabase = getAdminSupabase();
  
  // Try to use RPC first, if it fails fallback to standard update
  const { data: rpcData, error: rpcError } = await supabase.rpc('reserve_inventory', {
    p_product_id: productId,
    p_quantity: quantity,
  });

  if (!rpcError) {
    return rpcData;
  }

  // Fallback if RPC doesn't exist
  const { data: product, error: fetchError } = await supabase
    .from('products')
    .select('inventory_count')
    .eq('id', productId)
    .single();

  if (fetchError) throw fetchError;
  if (product.inventory_count < quantity) return false;

  const { error: updateError } = await supabase
    .from('products')
    .update({ inventory_count: product.inventory_count - quantity })
    .eq('id', productId);

  if (updateError) throw updateError;
  return true;
}

export async function updateProductInventory(productId: string, newQuantity: number) {
  const supabase = getAdminSupabase();
  const { error } = await supabase
    .from('products')
    .update({ inventory_count: newQuantity })
    .eq('id', productId);
  if (error) throw error;
}
