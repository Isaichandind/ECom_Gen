'use client';
import { Product } from '../types';
import { useCartStore } from '@/shared/store/cart';
import Link from 'next/link';

export function ProductCard({ product, index }: { product: Product, index: number }) {
  const addItem = useCartStore((state) => state.addItem);

  const handleCardClick = (e: React.MouseEvent) => {
    // If the click is on a link, don't trigger the card click (e.g., details link)
    if ((e.target as HTMLElement).closest('a')) {
      return;
    }
    
    e.preventDefault();
    addItem({ productId: product.id, name: product.name, price: product.price, quantity: 1 });
  };

  return (
    <div 
      onClick={handleCardClick}
      className="bg-card rounded-xl border border-border overflow-hidden group flex flex-col hover:shadow-sm transition-shadow cursor-pointer relative"
    >
      <div className="absolute inset-0 bg-foreground/5 opacity-0 group-hover:opacity-100 transition-opacity z-10 pointer-events-none rounded-xl" />
      <div className="relative aspect-[4/3] bg-[#f9faf9] p-6 flex items-center justify-center border-b border-border">
        {/* Badges */}
        <div className="absolute top-4 left-4 z-10 flex flex-col gap-1">
          {index === 0 && <span className="bg-green-700 text-white text-[10px] font-bold px-2 py-1 rounded tracking-wide">Best Seller</span>}
          {product.name.includes('250g') && <span className="bg-foreground/10 text-foreground/70 border border-border text-[10px] font-bold px-2 py-1 rounded tracking-wide">Starter Size</span>}
          {product.name.includes('1kg') && <span className="bg-foreground/10 text-foreground/70 border border-border text-[10px] font-bold px-2 py-1 rounded tracking-wide">Value Pack</span>}
        </div>
        {/* Image Placeholder */}
        <div className="w-2/3 h-full border-2 border-dashed border-foreground/20 rounded-lg flex items-center justify-center text-foreground/40 text-xs bg-card shadow-sm group-hover:scale-105 transition-transform duration-300">
          Pouch
        </div>
      </div>
      <div className="p-5 flex flex-col flex-1">
        <div className="flex justify-between text-xs text-foreground/60 mb-2 font-medium">
          <span className="uppercase tracking-wider text-green-700">Vitality</span>
          <span className="flex items-center gap-1">☆ 4.{9 - (index % 3)}</span>
        </div>
        <h3 className="font-semibold text-foreground text-[15px] mb-6 line-clamp-2 group-hover:text-green-700 transition-colors">{product.name}</h3>
        
        <div className="mt-auto flex items-center justify-between relative z-20">
          <div className="font-bold text-foreground text-lg">₹{product.price}</div>
          <Link href={`/product/${product.id}`} className="text-xs font-semibold text-foreground border border-border px-3 py-1.5 rounded hover:border-foreground transition-colors flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
            Details <span className="text-[10px]">↗</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
