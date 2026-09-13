import Link from 'next/link';
import { LayoutDashboard, ShoppingCart, Package, Hexagon, LogOut, Search, Bell } from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 flex-shrink-0 flex flex-col hidden md:flex">
        <div className="h-[72px] flex items-center px-6 border-b border-gray-200">
          <Link href="/" className="flex items-center gap-2">
            <Hexagon className="w-6 h-6 text-gray-900 fill-current" />
            <span className="text-xl font-bold tracking-tight text-gray-900">TechGear</span>
          </Link>
        </div>
        <nav className="p-4 space-y-1 flex-1">
          <Link href="/admin" className="flex items-center gap-3 px-3 py-2.5 text-gray-900 bg-gray-100 rounded-md font-medium text-sm transition-colors">
            <LayoutDashboard className="w-4 h-4" />
            Dashboard
          </Link>
          <Link href="/admin/orders" className="flex items-center gap-3 px-3 py-2.5 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-md font-medium text-sm transition-colors">
            <ShoppingCart className="w-4 h-4" />
            Orders
          </Link>
          <Link href="/admin/inventory" className="flex items-center gap-3 px-3 py-2.5 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-md font-medium text-sm transition-colors">
            <Package className="w-4 h-4" />
            Inventory
          </Link>
        </nav>
        <div className="p-4 border-t border-gray-200">
          <button className="flex items-center gap-3 px-3 py-2.5 text-gray-600 hover:text-gray-900 w-full font-medium text-sm transition-colors">
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0">
        <header className="h-[72px] bg-white border-b border-gray-200 flex items-center justify-between px-8 flex-shrink-0">
          <div className="flex items-center gap-3 text-sm font-medium text-gray-500">
            <LayoutDashboard className="w-4 h-4" /> 
            <span>Dashboard</span> <span className="text-gray-300">/</span> <span className="text-gray-900">Overview</span>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="hidden lg:flex items-center bg-gray-50 rounded-md px-3 py-2 w-64 border border-gray-200 focus-within:border-gray-300 focus-within:bg-white transition-all">
              <Search className="w-4 h-4 text-gray-400 mr-2" />
              <input 
                type="text" 
                placeholder="Search orders, products..." 
                className="bg-transparent border-none outline-none text-[13px] w-full text-gray-900 placeholder:text-gray-400"
              />
            </div>
            <button className="text-gray-400 hover:text-gray-900 relative">
              <Bell className="w-5 h-5" />
              <span className="absolute 0 top-0 right-0 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
            </button>
            <div className="flex items-center gap-3 border-l border-gray-200 pl-6">
              <div className="w-8 h-8 rounded-full bg-gray-900 flex items-center justify-center text-white text-xs font-bold">AR</div>
              <div className="text-sm">
                <div className="font-bold text-gray-900 leading-tight">Alex Rivers</div>
                <div className="text-[10px] text-gray-500">Admin</div>
              </div>
            </div>
          </div>
        </header>
        <div className="flex-1 overflow-auto p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
