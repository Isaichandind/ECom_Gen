'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Search, User, ShoppingBag, Leaf } from 'lucide-react';
import { CartDrawer } from './CartDrawer';
import { useCartStore } from '@/shared/store/cart';
import { Product } from '@/domains/inventory/types';

export function Header() {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const items = useCartStore((state) => state.items);
  const itemCount = items.reduce((acc, item) => acc + item.quantity, 0);

  const [searchQuery, setSearchQuery] = useState('');
  const [products, setProducts] = useState<Product[]>([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch('/api/products');
        const data = await res.json();
        if (Array.isArray(data)) setProducts(data);
      } catch (err) {
        console.error('Failed to fetch products for search');
      }
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredProducts = products.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()));

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
              <Link href="/" className="text-green-700 hover:text-green-800 transition-colors font-bold">Superfoods</Link>
            </nav>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="hidden lg:flex relative" ref={searchRef}>
              <div className="flex items-center bg-gray-100 rounded-md px-3 py-2 w-64 border border-transparent focus-within:border-gray-300 focus-within:bg-white transition-all">
                <Search className="w-4 h-4 text-gray-400 mr-2" />
                <input 
                  type="text" 
                  placeholder="Search products..." 
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setIsDropdownOpen(true);
                  }}
                  onFocus={() => setIsDropdownOpen(true)}
                  className="bg-transparent border-none outline-none text-[13px] w-full text-gray-900 placeholder:text-gray-400"
                />
              </div>

              {isDropdownOpen && searchQuery && (
                <div className="absolute top-full left-0 w-full mt-2 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden z-50 max-h-80 overflow-y-auto">
                  {filteredProducts.length > 0 ? (
                    filteredProducts.map(p => (
                      <Link 
                        key={p.id} 
                        href={`/product/${p.id}`}
                        onClick={() => setIsDropdownOpen(false)}
                        className="flex items-center gap-3 p-3 hover:bg-gray-50 border-b border-gray-100 last:border-0 transition-colors"
                      >
                        <div className="w-10 h-10 bg-gray-100 rounded flex-shrink-0 flex items-center justify-center">
                          <Leaf className="w-4 h-4 text-green-700" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium text-gray-900 truncate">{p.name}</div>
                          <div className="text-xs text-gray-500">₹{p.price}</div>
                        </div>
                      </Link>
                    ))
                  ) : (
                    <div className="p-4 text-sm text-gray-500 text-center">No products found</div>
                  )}
                </div>
              )}
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
