import { createClient } from '@/shared/lib/supabase/server';
import { Product } from './types';

export async function getProducts(): Promise<Product[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data as Product[];
}

export async function getProductById(id: string): Promise<Product> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;
  return data as Product;
}

export async function reserveInventory(productId: string, quantity: number): Promise<boolean> {
  const supabase = await createClient();
  const { data, error } = await supabase.rpc('reserve_inventory', {
    p_product_id: productId,
    p_quantity: quantity,
  });

  if (error) throw error;
  return data;
}
