'use client';
import { useState } from 'react';
import { Product } from '../types';
import { useCartStore } from '@/shared/store/cart';
import { toast } from 'sonner';
import { Clock } from 'lucide-react';

export function ProductActions({ product }: { product: Product }) {
  const [quantity, setQuantity] = useState(1);
  const addItem = useCartStore((state) => state.addItem);
  const isSoldOut = product.inventory_count <= 0;

  const handleDecrease = () => {
    if (quantity > 1) setQuantity(quantity - 1);
  };

  const handleIncrease = () => {
    if (quantity < product.inventory_count) setQuantity(quantity + 1);
  };

  const handleAddToCart = () => {
    addItem({ productId: product.id, name: product.name, price: product.price, quantity });
    toast.success(`${quantity}x ${product.name} added to cart`);
  };

  return (
    <>
      <div className="mb-8">
        <h3 className="text-[11px] font-bold text-gray-400 tracking-wider uppercase mb-3">Quantity</h3>
        <div className="flex items-center gap-4">
          <div className="flex items-center bg-white border border-gray-200 rounded-md">
            <button 
              onClick={handleDecrease}
              className="px-4 py-2 text-gray-500 hover:text-gray-900 transition-colors disabled:opacity-50"
              disabled={quantity <= 1}
            >
              -
            </button>
            <span className="px-4 py-2 text-sm font-semibold text-gray-900 border-x border-gray-200 w-12 text-center">
              {quantity}
            </span>
            <button 
              onClick={handleIncrease}
              className="px-4 py-2 text-gray-500 hover:text-gray-900 transition-colors disabled:opacity-50"
              disabled={quantity >= product.inventory_count}
            >
              +
            </button>
          </div>
          <span className="text-xs text-green-600 font-medium flex items-center gap-1">
            <Clock className="w-3 h-3" /> In Stock & Ready to Ship
          </span>
        </div>
      </div>

      <button
        onClick={handleAddToCart}
        disabled={isSoldOut}
        className={`w-full py-3 rounded-lg font-medium transition-all duration-200 flex items-center justify-center ${
          isSoldOut 
            ? 'bg-zinc-100 text-zinc-400 cursor-not-allowed' 
            : 'bg-zinc-950 text-white hover:bg-zinc-800'
        }`}
      >
        {isSoldOut ? 'Sold Out' : 'Add to Cart'}
      </button>
    </>
  );
}
