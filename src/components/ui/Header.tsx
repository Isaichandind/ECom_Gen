'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Search, User, ShoppingBag, Leaf, Moon, Sun, Monitor, LogOut, Settings } from 'lucide-react';
import { CartDrawer } from './CartDrawer';
import { useCartStore } from '@/shared/store/cart';
import { Product } from '@/domains/inventory/types';
import { createClient } from '@/shared/lib/supabase/client';
import { useTheme } from 'next-themes';

export function Header() {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const items = useCartStore((state) => state.items);
  const itemCount = items.reduce((acc, item) => acc + item.quantity, 0);

  const [searchQuery, setSearchQuery] = useState('');
  const [products, setProducts] = useState<Product[]>([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  // User Auth State
  const supabase = createClient();
  const router = useRouter();
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  // Theme State
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isThemeMenuOpen, setIsThemeMenuOpen] = useState(false);
  const themeMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
    
    // Fetch initial auth session
    const fetchSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUserEmail(session?.user?.email || null);
    };
    fetchSession();

    // Listen for auth changes
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      setUserEmail(session?.user?.email || null);
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch('/api/products');
        const data = await res.json();
        if (Array.isArray(data)) setProducts(data);
      } catch (err) {
        console.error('Failed to fetch products for search', err);
      }
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
      if (themeMenuRef.current && !themeMenuRef.current.contains(event.target as Node)) {
        setIsThemeMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setIsUserMenuOpen(false);
    router.push('/');
    router.refresh();
  };

  const filteredProducts = products.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <>
      <header className="bg-background border-b border-border sticky top-0 z-40 transition-colors duration-300">
        <div className="max-w-[1400px] mx-auto px-6 h-[72px] flex items-center justify-between">
          <div className="flex items-center gap-12">
            <Link href="/" className="flex items-center gap-2">
              <Leaf className="w-6 h-6 text-green-700 fill-current" />
              <span className="text-xl font-bold tracking-tight text-foreground">Vitality Powders</span>
            </Link>
            
            <nav className="hidden md:flex items-center gap-6 text-[13px] font-medium text-foreground/60">
              <Link href="/" className="text-green-700 hover:text-green-800 transition-colors font-bold">Superfoods</Link>
            </nav>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="hidden lg:flex relative" ref={searchRef}>
              <div className="flex items-center bg-card border border-border rounded-md px-3 py-2 w-64 focus-within:border-foreground transition-all">
                <Search className="w-4 h-4 text-foreground/40 mr-2" />
                <input 
                  type="text" 
                  placeholder="Search products..." 
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setIsDropdownOpen(true);
                  }}
                  onFocus={() => setIsDropdownOpen(true)}
                  className="bg-transparent border-none outline-none text-[13px] w-full text-foreground placeholder:text-foreground/40"
                />
              </div>

              {isDropdownOpen && searchQuery && (
                <div className="absolute top-full left-0 w-full mt-2 bg-card border border-border rounded-lg shadow-lg overflow-hidden z-50 max-h-80 overflow-y-auto">
                  {filteredProducts.length > 0 ? (
                    filteredProducts.map(p => (
                      <Link 
                        key={p.id} 
                        href={`/product/${p.id}`}
                        onClick={() => setIsDropdownOpen(false)}
                        className="flex items-center gap-3 p-3 hover:bg-foreground/5 border-b border-border last:border-0 transition-colors"
                      >
                        <div className="w-10 h-10 bg-background rounded flex-shrink-0 flex items-center justify-center">
                          <Leaf className="w-4 h-4 text-green-700" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium text-foreground truncate">{p.name}</div>
                          <div className="text-xs text-foreground/60">₹{p.price}</div>
                        </div>
                      </Link>
                    ))
                  ) : (
                    <div className="p-4 text-sm text-foreground/60 text-center">No products found</div>
                  )}
                </div>
              )}
            </div>

            {/* Theme Switcher */}
            {mounted && (
              <div className="relative" ref={themeMenuRef}>
                <button 
                  onClick={() => setIsThemeMenuOpen(!isThemeMenuOpen)}
                  className="text-foreground/70 hover:text-foreground transition-colors p-2 rounded-full hover:bg-foreground/5"
                  aria-label="Toggle theme"
                >
                  {theme === 'light' ? <Sun className="w-5 h-5" /> : theme === 'dark' ? <Moon className="w-5 h-5" /> : <Monitor className="w-5 h-5" />}
                </button>

                {isThemeMenuOpen && (
                  <div className="absolute top-full right-0 mt-2 w-36 bg-card border border-border rounded-lg shadow-lg overflow-hidden z-50">
                    <button onClick={() => { setTheme('light'); setIsThemeMenuOpen(false); }} className="w-full text-left px-4 py-2 text-sm text-foreground hover:bg-foreground/5 transition-colors">Light</button>
                    <button onClick={() => { setTheme('dark'); setIsThemeMenuOpen(false); }} className="w-full text-left px-4 py-2 text-sm text-foreground hover:bg-foreground/5 transition-colors">Dark</button>
                    <button onClick={() => { setTheme('oled'); setIsThemeMenuOpen(false); }} className="w-full text-left px-4 py-2 text-sm text-foreground hover:bg-foreground/5 transition-colors">OLED</button>
                    <button onClick={() => { setTheme('ocean'); setIsThemeMenuOpen(false); }} className="w-full text-left px-4 py-2 text-sm text-foreground hover:bg-foreground/5 transition-colors">Ocean</button>
                  </div>
                )}
              </div>
            )}

            {/* User Profile */}
            <div className="relative" ref={userMenuRef}>
              {userEmail ? (
                <button 
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="w-8 h-8 rounded-full bg-foreground text-background font-bold flex items-center justify-center text-sm shadow-sm"
                >
                  {userEmail[0].toUpperCase()}
                </button>
              ) : (
                <Link href="/login" className="text-foreground/70 hover:text-foreground transition-colors p-2 rounded-full hover:bg-foreground/5">
                  <User className="w-5 h-5" />
                </Link>
              )}

              {isUserMenuOpen && userEmail && (
                <div className="absolute top-full right-0 mt-2 w-56 bg-card border border-border rounded-lg shadow-lg overflow-hidden z-50">
                  <div className="px-4 py-3 border-b border-border">
                    <p className="text-sm text-foreground truncate font-medium">{userEmail}</p>
                  </div>
                  {userEmail.startsWith('admin') && (
                    <Link href="/admin" onClick={() => setIsUserMenuOpen(false)} className="flex items-center px-4 py-2 text-sm text-foreground hover:bg-foreground/5 transition-colors">
                      <Settings className="w-4 h-4 mr-2" /> Dashboard
                    </Link>
                  )}
                  <button 
                    onClick={handleLogout}
                    className="w-full flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-950 transition-colors"
                  >
                    <LogOut className="w-4 h-4 mr-2" /> Log out
                  </button>
                </div>
              )}
            </div>
            
            <button 
              onClick={() => setIsCartOpen(true)} 
              className="text-foreground/70 hover:text-foreground transition-colors relative flex items-center gap-1 p-2 rounded-full hover:bg-foreground/5"
            >
              <ShoppingBag className="w-5 h-5" />
              <span className="bg-green-600 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center absolute top-1 right-0">
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
