import { getAdminOrders } from '@/domains/orders/services';
import { updateOrderStatus } from '@/domains/orders/services';
import { revalidatePath } from 'next/cache';
import { Calendar, Download, Filter, TrendingUp, TrendingDown, DollarSign, Users, Package } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function AdminDashboardPage() {
  const { orders } = await getAdminOrders(1, 50);

  const approvePayment = async (formData: FormData) => {
    'use server';
    const orderId = formData.get('orderId') as string;
    await updateOrderStatus(orderId, 'paid');
    revalidatePath('/admin');
  };

  const revenue = orders?.filter(o => o.status === 'paid' || o.status === 'shipped').reduce((acc, o) => acc + Number(o.total_amount), 0) || 0;

  // Fetch real analytics data
  const { createAdminClient } = await import('@/shared/lib/supabase/admin');
  const supabaseAdmin = createAdminClient();
  
  // Total Customers
  const { count: customersCount } = await supabaseAdmin
    .from('profiles')
    .select('*', { count: 'exact', head: true })
    .eq('role', 'user');

  // Total Products Sold
  const { data: orderItems } = await supabaseAdmin
    .from('order_items')
    .select('quantity, orders!inner(status)')
    .in('orders.status', ['paid', 'shipped']);
  
  const totalProductsSold = orderItems?.reduce((acc, item) => acc + item.quantity, 0) || 0;

  // Low Stock Products
  const { data: lowStockProducts } = await supabaseAdmin
    .from('products')
    .select('*')
    .lt('inventory_count', 20)
    .order('inventory_count', { ascending: true })
    .limit(5);

  return (
    <div className="max-w-[1400px] mx-auto">
      {/* Header Actions */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-foreground tracking-tight">Dashboard Overview</h1>
          <p className="text-sm text-foreground/60 mt-1">Welcome back, Alex. Here&apos;s what&apos;s happening with Vitality Powders today.</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-card border border-border rounded-md text-sm font-medium text-foreground/80 hover:bg-foreground/5 transition-colors shadow-sm">
            <Calendar className="w-4 h-4" /> Last 7 Days
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-card border border-border rounded-md text-sm font-medium text-foreground/80 hover:bg-foreground/5 transition-colors shadow-sm">
            <Download className="w-4 h-4" /> Export Report
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-gray-900 border border-gray-900 rounded-md text-sm font-medium text-white hover:bg-gray-800 transition-colors shadow-sm">
            <Filter className="w-4 h-4" /> Filters
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Revenue */}
        <div className="bg-card p-6 rounded-xl border border-border shadow-sm flex flex-col">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-xs font-bold text-foreground/40 uppercase tracking-wider">Total Revenue</h3>
            <div className="w-8 h-8 rounded bg-foreground/5 flex items-center justify-center text-foreground/40 border border-border"><DollarSign className="w-4 h-4" /></div>
          </div>
          <div className="text-3xl font-bold text-foreground mb-2">₹{revenue.toLocaleString()}</div>
          <div className="flex items-center gap-1 text-xs font-medium text-green-600 mt-auto">
            <TrendingUp className="w-3 h-3" /> +20.1% <span className="text-foreground/40">vs last week</span>
          </div>
        </div>
        
        {/* Orders */}
        <div className="bg-card p-6 rounded-xl border border-border shadow-sm flex flex-col">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-xs font-bold text-foreground/40 uppercase tracking-wider">Active Orders</h3>
            <div className="w-8 h-8 rounded bg-foreground/5 flex items-center justify-center text-foreground/40 border border-border"><Package className="w-4 h-4" /></div>
          </div>
          <div className="text-3xl font-bold text-foreground mb-2">{orders?.length || 0}</div>
          <div className="flex items-center gap-1 text-xs font-medium text-green-600 mt-auto">
            <TrendingUp className="w-3 h-3" /> +12.2% <span className="text-foreground/40">vs last week</span>
          </div>
        </div>

        {/* Customers */}
        <div className="bg-card p-6 rounded-xl border border-border shadow-sm flex flex-col">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-xs font-bold text-foreground/40 uppercase tracking-wider">Total Customers</h3>
            <div className="w-8 h-8 rounded bg-foreground/5 flex items-center justify-center text-foreground/40 border border-border"><Users className="w-4 h-4" /></div>
          </div>
          <div className="text-3xl font-bold text-foreground mb-2">{customersCount || 0}</div>
          <div className="flex items-center gap-1 text-xs font-medium text-green-600 mt-auto">
            <TrendingUp className="w-3 h-3" /> Live
          </div>
        </div>

        {/* Products Sold */}
        <div className="bg-card p-6 rounded-xl border border-border shadow-sm flex flex-col">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-xs font-bold text-foreground/40 uppercase tracking-wider">Products Sold</h3>
            <div className="w-8 h-8 rounded bg-foreground/5 flex items-center justify-center text-foreground/40 border border-border"><Package className="w-4 h-4" /></div>
          </div>
          <div className="text-3xl font-bold text-foreground mb-2">{totalProductsSold}</div>
          <div className="flex items-center gap-1 text-xs font-medium text-green-600 mt-auto">
            <TrendingUp className="w-3 h-3" /> Live
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Col (Recent Orders Table) */}
        <div className="lg:col-span-2 space-y-8">
          
          <div className="bg-card rounded-xl shadow-sm border border-border overflow-hidden">
            <div className="p-6 border-b border-border flex justify-between items-center">
              <div>
                <h2 className="text-lg font-bold text-foreground tracking-tight">Recent Orders</h2>
                <p className="text-xs text-foreground/60">The last 5 orders placed on the storefront</p>
              </div>
              <button className="text-sm font-semibold text-foreground hover:underline">View All →</button>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-foreground/5 text-foreground/40 text-xs font-bold uppercase tracking-wider border-b border-border">
                  <tr>
                    <th className="px-6 py-4">Order ID</th>
                    <th className="px-6 py-4">Customer</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {orders?.slice(0, 5).map((order: { id: string; created_at: string; profiles?: { username?: string }; total_amount: string; status: string }) => (
                    <tr key={order.id} className="hover:bg-foreground/5 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-bold text-foreground">#ORD-{order.id.slice(0, 4).toUpperCase()}</div>
                        <div className="text-[10px] font-bold text-foreground/40 tracking-wider uppercase mt-1">
                          {new Date(order.created_at).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' })}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-medium text-foreground/60">Wait for the confirmation message in owner&apos;s whatsapp. They&apos;ll confirm and status will change.</div>
                        <div className="text-xs text-foreground/60">{order.profiles?.email || '-'}</div>
                      </td>
                      <td className="px-6 py-4">
                        {order.status === 'pending_verification' ? (
                          <div className="flex items-center gap-2">
                            <span className="px-2 py-1 bg-yellow-50 text-yellow-600 border border-yellow-200 rounded text-xs font-semibold">Verification</span>
                            <form action={approvePayment}>
                              <input type="hidden" name="orderId" value={order.id} />
                              <button type="submit" className="text-xs font-bold text-blue-600 hover:underline">Approve</button>
                            </form>
                          </div>
                        ) : (
                          <span className={`px-2 py-1 rounded text-xs font-semibold border ${
                            order.status === 'paid' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-foreground/5 text-foreground/70 border-border'
                          }`}>
                            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 font-bold text-foreground text-right">₹{order.total_amount}</td>
                    </tr>
                  ))}
                  {(!orders || orders.length === 0) && (
                    <tr>
                      <td colSpan={4} className="px-6 py-12 text-center text-foreground/60">No orders found.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Col */}
        <div className="space-y-8">
          <div className="bg-card p-6 rounded-xl border border-border shadow-sm">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-lg font-bold text-foreground tracking-tight">Stock Alerts</h2>
                <p className="text-xs text-foreground/60">Items reaching critical replenishment levels</p>
              </div>
              <span className="px-2 py-1 bg-red-50 text-red-600 border border-red-200 rounded text-[10px] font-bold tracking-wider uppercase">Low Stock</span>
            </div>
            
            <div className="space-y-4">
              {lowStockProducts && lowStockProducts.length > 0 ? (
                lowStockProducts.map(p => (
                  <div key={p.id} className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-foreground/10 rounded flex-shrink-0 flex items-center justify-center">
                      <Package className="w-5 h-5 text-foreground/40" />
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-semibold text-foreground">{p.name}</div>
                      <div className="text-xs text-foreground/60">{p.inventory_count} left in stock</div>
                    </div>
                    <div className="text-xs font-bold text-red-500">Critical</div>
                  </div>
                ))
              ) : (
                <div className="text-sm text-foreground/60">No low stock items. All good!</div>
              )}
            </div>
            
            <button className="w-full mt-6 flex items-center justify-center gap-2 px-4 py-2.5 bg-card border border-border rounded-md text-sm font-semibold text-foreground/80 hover:bg-foreground/5 transition-colors shadow-sm">
              Manage Inventory 
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
