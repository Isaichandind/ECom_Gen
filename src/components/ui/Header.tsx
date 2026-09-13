'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Search, User, ShoppingBag, Leaf } from 'lucide-react';
import { CartDrawer } from './CartDrawer';
import { useCartStore } from '@/shared/store/cart';

export function Header() {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const items = useCartStore((state) => state.items);

  const itemCount = items.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <>
      <header className="bg-[#f9f9f9] border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-[1400px] mx-auto px-6 h-[72px] flex items-center justify-between">
          <div className="flex items-center gap-12">
            <Link href="/" className="flex items-center gap-2">
              <Leaf className="w-6 h-6 text-green-700 fill-current" />
              <span className="text-xl font-bold tracking-tight text-gray-900">Vitality Powders</span>
            </Link>
            
            <nav className="hidden md:flex items-center gap-6 text-[13px] font-medium text-gray-500">
              <Link href="#" className="text-green-700 hover:text-green-800 transition-colors font-bold">Superfoods</Link>
            </nav>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="hidden lg:flex items-center bg-gray-100 rounded-md px-3 py-2 w-64 border border-transparent focus-within:border-gray-300 focus-within:bg-white transition-all">
              <Search className="w-4 h-4 text-gray-400 mr-2" />
              <input 
                type="text" 
                placeholder="Search products..." 
                className="bg-transparent border-none outline-none text-[13px] w-full text-gray-900 placeholder:text-gray-400"
              />
            </div>

            <Link href="/login" className="text-gray-600 hover:text-gray-900 transition-colors">
              <User className="w-5 h-5" />
            </Link>
            
            <button 
              onClick={() => setIsCartOpen(true)} 
              className="text-gray-600 hover:text-gray-900 transition-colors relative flex items-center gap-1"
            >
              <ShoppingBag className="w-5 h-5" />
              <span className="bg-gray-900 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center absolute -top-1 -right-2">
                {itemCount}
              </span>
            </button>
          </div>
        </div>
      </header>

      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
}
