import Link from 'next/link';
import { LayoutDashboard, ShoppingCart, Package, Leaf, LogOut, Search, Bell } from 'lucide-react';
import { createClient } from '@/shared/lib/supabase/server';
import { redirect } from 'next/navigation';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  const handleLogout = async () => {
    'use server';
    const supabaseAction = await createClient();
    await supabaseAction.auth.signOut();
    redirect('/login');
  };

  return (
    <div className="min-h-screen flex bg-foreground/5">
      {/* Sidebar */}
      <aside className="w-64 bg-card border-r border-border flex-shrink-0 flex flex-col hidden md:flex">
        <div className="h-[72px] flex items-center px-6 border-b border-border">
          <Link href="/" className="flex items-center gap-2">
            <Leaf className="w-6 h-6 text-green-700 fill-current" />
            <span className="text-xl font-bold tracking-tight text-foreground">Vitality Powders</span>
          </Link>
        </div>
        <nav className="p-4 space-y-1 flex-1">
          <Link href="/admin" className="flex items-center gap-3 px-3 py-2.5 text-foreground bg-foreground/10 rounded-md font-medium text-sm transition-colors">
            <LayoutDashboard className="w-4 h-4" />
            Dashboard
          </Link>
          <Link href="/admin/orders" className="flex items-center gap-3 px-3 py-2.5 text-foreground/70 hover:text-foreground hover:bg-foreground/5 rounded-md font-medium text-sm transition-colors">
            <ShoppingCart className="w-4 h-4" />
            Orders
          </Link>
          <Link href="/admin/inventory" className="flex items-center gap-3 px-3 py-2.5 text-foreground/70 hover:text-foreground hover:bg-foreground/5 rounded-md font-medium text-sm transition-colors">
            <Package className="w-4 h-4" />
            Inventory
          </Link>
        </nav>
        <div className="p-4 border-t border-border">
          <form action={handleLogout}>
            <button type="submit" className="flex items-center gap-3 px-3 py-2.5 text-foreground/70 hover:text-foreground w-full font-medium text-sm transition-colors">
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </form>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0">
        <header className="h-[72px] bg-card border-b border-border flex items-center justify-between px-8 flex-shrink-0">
          <div className="flex items-center gap-3 text-sm font-medium text-foreground/60">
            <LayoutDashboard className="w-4 h-4" /> 
            <span>Dashboard</span> <span className="text-foreground/30">/</span> <span className="text-foreground">Overview</span>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="hidden lg:flex items-center bg-foreground/5 rounded-md px-3 py-2 w-64 border border-border focus-within:border-foreground/20 focus-within:bg-card transition-all">
              <Search className="w-4 h-4 text-foreground/40 mr-2" />
              <input 
                type="text" 
                placeholder="Search orders, products..." 
                className="bg-transparent border-none outline-none text-[13px] w-full text-foreground placeholder:text-foreground/40"
              />
            </div>
            <button className="text-foreground/40 hover:text-foreground relative">
              <Bell className="w-5 h-5" />
              <span className="absolute 0 top-0 right-0 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
            </button>
            <div className="flex items-center gap-3 border-l border-border pl-6">
              <div className="w-8 h-8 rounded-full bg-gray-900 flex items-center justify-center text-white text-xs font-bold uppercase">
                {profile?.username?.slice(0, 2) || 'AD'}
              </div>
              <div className="text-sm">
                <div className="font-bold text-foreground leading-tight">{profile?.email || 'Admin User'}</div>
                <div className="text-[10px] text-foreground/60 capitalize">{profile?.role || 'Admin'}</div>
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
