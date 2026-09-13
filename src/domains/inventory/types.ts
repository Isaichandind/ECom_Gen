export interface Product {
  id: string;
  name: string;
  description: string | null;
  price: number;
  inventory_count: number;
  created_at: string;
  updated_at: string;
}
