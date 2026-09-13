import Link from 'next/link';
import { ShoppingCart, User } from 'lucide-react';

export default function ShopLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <header className="bg-white border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="text-2xl font-black text-gray-900 tracking-tight">
            ECOM<span className="text-blue-600">.</span>
          </Link>
          <nav className="flex items-center gap-6">
            <Link href="/checkout" className="text-gray-600 hover:text-gray-900 flex items-center gap-2 font-medium transition-colors">
              <ShoppingCart className="w-5 h-5" />
              <span>Cart</span>
            </Link>
            <Link href="/login" className="text-gray-600 hover:text-gray-900 flex items-center gap-2 font-medium transition-colors">
              <User className="w-5 h-5" />
              <span>Account</span>
            </Link>
          </nav>
        </div>
      </header>
      <main className="flex-1">
        {children}
      </main>
      <footer className="bg-white border-t py-12 mt-auto">
        <div className="max-w-7xl mx-auto px-4 text-center text-gray-500">
          <p>&copy; {new Date().getFullYear()} ECOM. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
