'use client';
import { Product } from '../types';
import { useCartStore } from '@/shared/store/cart';
import { Plus } from 'lucide-react';

export function AddToCartButton({ product }: { product: Product }) {
  const addItem = useCartStore((state) => state.addItem);

  return (
    <button
      onClick={() => addItem({ productId: product.id, name: product.name, price: product.price, quantity: 1 })}
      disabled={product.inventory_count <= 0}
      className="bg-black text-white p-2 rounded-full hover:bg-gray-800 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
      aria-label="Add to cart"
    >
      <Plus className="w-5 h-5" />
    </button>
  );
}
