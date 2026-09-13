'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Search, User, ShoppingBag } from 'lucide-react';
import { CartDrawer } from './CartDrawer';
import { useCartStore } from '@/shared/store/cart';

export function Header() {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const items = useCartStore((state) => state.items);

  const itemCount = items.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <>
      <header className="bg-white/80 backdrop-blur-md border-b border-zinc-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="text-2xl font-black text-zinc-950 tracking-tight">
            ECOM<span className="text-zinc-400">.</span>
          </Link>
          
          <nav className="flex items-center gap-6">
            <button className="text-zinc-600 hover:text-zinc-950 transition-colors">
              <Search className="w-5 h-5" />
            </button>
            <Link href="/login" className="text-zinc-600 hover:text-zinc-950 transition-colors">
              <User className="w-5 h-5" />
            </Link>
            <button 
              onClick={() => setIsCartOpen(true)} 
              className="text-zinc-600 hover:text-zinc-950 transition-colors relative"
            >
              <ShoppingBag className="w-5 h-5" />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-zinc-950 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </button>
          </nav>
        </div>
      </header>

      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
}
