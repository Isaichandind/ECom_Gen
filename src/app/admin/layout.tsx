import Link from 'next/link';
import { Home, Package, Users, Settings } from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex bg-zinc-50">
      {/* Sidebar */}
      <aside className="w-64 bg-zinc-950 text-white flex-shrink-0 border-r border-zinc-800 hidden md:block">
        <div className="p-6 border-b border-zinc-800">
          <h1 className="text-xl font-bold tracking-tight">Admin</h1>
        </div>
        <nav className="p-4 space-y-2">
          <Link href="/admin" className="flex items-center gap-3 px-3 py-2 text-zinc-300 hover:bg-zinc-900 hover:text-white rounded-md transition-colors">
            <Home className="w-5 h-5" />
            <span className="font-medium">Overview</span>
          </Link>
          <Link href="/admin/inventory" className="flex items-center gap-3 px-3 py-2 text-zinc-300 hover:bg-zinc-900 hover:text-white rounded-md transition-colors">
            <Package className="w-5 h-5" />
            <span className="font-medium">Inventory</span>
          </Link>
          <div className="flex items-center gap-3 px-3 py-2 text-zinc-500 rounded-md">
            <Users className="w-5 h-5" />
            <span className="font-medium">Customers</span>
          </div>
          <div className="flex items-center gap-3 px-3 py-2 text-zinc-500 rounded-md">
            <Settings className="w-5 h-5" />
            <span className="font-medium">Settings</span>
          </div>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0">
        <header className="h-16 bg-white border-b border-zinc-200 flex items-center justify-between px-8 flex-shrink-0">
          <div className="flex items-center gap-4">
            <Link href="/" className="md:hidden text-zinc-950 font-bold">ECOM.</Link>
            <h2 className="font-semibold text-zinc-950 tracking-tight hidden md:block">Dashboard</h2>
          </div>
          <div className="text-sm font-medium text-zinc-500">Store Owner</div>
        </header>
        <div className="flex-1 overflow-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
