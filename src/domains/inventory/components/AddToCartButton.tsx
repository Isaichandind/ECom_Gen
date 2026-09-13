'use client';
import { Product } from '../types';
import { useCartStore } from '@/shared/store/cart';

export function AddToCartButton({ product, variant = 'ghost' }: { product: Product, variant?: 'ghost' | 'primary' }) {
  const addItem = useCartStore((state) => state.addItem);
  const isSoldOut = product.inventory_count <= 0;

  const baseClasses = "w-full py-3 rounded-lg font-medium transition-all duration-200 flex items-center justify-center";
  
  const variantClasses = {
    ghost: "bg-white text-zinc-950 border border-zinc-200 hover:border-zinc-950 lg:opacity-0 lg:group-hover:opacity-100 focus:opacity-100",
    primary: "bg-zinc-950 text-white hover:bg-zinc-800"
  };

  const disabledClasses = "bg-zinc-100 text-zinc-400 border-none opacity-100 cursor-not-allowed";

  return (
    <button
      onClick={(e) => {
        e.preventDefault(); 
        addItem({ productId: product.id, name: product.name, price: product.price, quantity: 1 });
      }}
      disabled={isSoldOut}
      className={`${baseClasses} ${isSoldOut ? disabledClasses : variantClasses[variant]}`}
    >
      {isSoldOut ? 'Sold Out' : 'Add to Cart'}
    </button>
  );
}
