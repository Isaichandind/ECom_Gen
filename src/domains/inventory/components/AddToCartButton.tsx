'use client';
import { Product } from '../types';
import { useCartStore } from '@/shared/store/cart';

export function AddToCartButton({ product, variant = 'ghost' }: { product: Product, variant?: 'ghost' | 'primary' }) {
  const addItem = useCartStore((state) => state.addItem);
  const isSoldOut = product.inventory_count <= 0;

  const baseClasses = "w-full py-3 rounded-lg font-medium transition-all duration-200 flex items-center justify-center";
  
  const variantClasses = {
    ghost: "bg-card text-foreground border border-border hover:border-foreground lg:opacity-0 lg:group-hover:opacity-100 focus:opacity-100",
    primary: "bg-foreground text-background hover:opacity-90"
  };

  const disabledClasses = "bg-foreground/10 text-foreground/40 border-none opacity-100 cursor-not-allowed";

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
