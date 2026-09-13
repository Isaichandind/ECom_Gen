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

  return (
    <div className="max-w-[1400px] mx-auto">
      {/* Header Actions */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Dashboard Overview</h1>
          <p className="text-sm text-gray-500 mt-1">Welcome back, Alex. Here's what's happening with TechGear today.</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors shadow-sm">
            <Calendar className="w-4 h-4" /> Last 7 Days
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors shadow-sm">
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
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Total Revenue</h3>
            <div className="w-8 h-8 rounded bg-gray-50 flex items-center justify-center text-gray-400 border border-gray-100"><DollarSign className="w-4 h-4" /></div>
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-2">₹{revenue.toLocaleString()}</div>
          <div className="flex items-center gap-1 text-xs font-medium text-green-600 mt-auto">
            <TrendingUp className="w-3 h-3" /> +20.1% <span className="text-gray-400">vs last week</span>
          </div>
        </div>
        
        {/* Orders */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Active Orders</h3>
            <div className="w-8 h-8 rounded bg-gray-50 flex items-center justify-center text-gray-400 border border-gray-100"><Package className="w-4 h-4" /></div>
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-2">{orders?.length || 0}</div>
          <div className="flex items-center gap-1 text-xs font-medium text-green-600 mt-auto">
            <TrendingUp className="w-3 h-3" /> +12.2% <span className="text-gray-400">vs last week</span>
          </div>
        </div>

        {/* Customers */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Total Customers</h3>
            <div className="w-8 h-8 rounded bg-gray-50 flex items-center justify-center text-gray-400 border border-gray-100"><Users className="w-4 h-4" /></div>
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-2">1,234</div>
          <div className="flex items-center gap-1 text-xs font-medium text-red-500 mt-auto">
            <TrendingDown className="w-3 h-3" /> -3.1% <span className="text-gray-400">vs last week</span>
          </div>
        </div>

        {/* Stock Alerts */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Stock Alerts</h3>
            <div className="w-8 h-8 rounded bg-gray-50 flex items-center justify-center text-gray-400 border border-gray-100">!</div>
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-2">4</div>
          <div className="flex items-center gap-1 text-xs font-medium text-green-600 mt-auto">
            ~ +2 new <span className="text-gray-400">vs last week</span>
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Col (Recent Orders Table) */}
        <div className="lg:col-span-2 space-y-8">
          
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-6 border-b border-gray-200 flex justify-between items-center">
              <div>
                <h2 className="text-lg font-bold text-gray-900 tracking-tight">Recent Orders</h2>
                <p className="text-xs text-gray-500">The last 5 orders placed on the storefront</p>
              </div>
              <button className="text-sm font-semibold text-gray-900 hover:underline">View All →</button>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-gray-50 text-gray-400 text-xs font-bold uppercase tracking-wider border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4">Order ID</th>
                    <th className="px-6 py-4">Customer</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {orders?.slice(0, 5).map((order: any) => (
                    <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-bold text-gray-900">#ORD-{order.id.slice(0, 4).toUpperCase()}</div>
                        <div className="text-[10px] font-bold text-gray-400 tracking-wider uppercase mt-1">Just Now</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-medium text-gray-900">{order.profiles?.username || 'Guest Customer'}</div>
                        <div className="text-xs text-gray-500">{order.profiles?.email || '-'}</div>
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
                            order.status === 'paid' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-gray-50 text-gray-600 border-gray-200'
                          }`}>
                            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 font-bold text-gray-900 text-right">₹{order.total_amount}</td>
                    </tr>
                  ))}
                  {(!orders || orders.length === 0) && (
                    <tr>
                      <td colSpan={4} className="px-6 py-12 text-center text-gray-500">No orders found.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Col */}
        <div className="space-y-8">
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-lg font-bold text-gray-900 tracking-tight">Stock Alerts</h2>
                <p className="text-xs text-gray-500">Items reaching critical replenishment levels</p>
              </div>
              <span className="px-2 py-1 bg-red-50 text-red-600 border border-red-200 rounded text-[10px] font-bold tracking-wider uppercase">Low Stock</span>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-gray-100 rounded flex-shrink-0"></div>
                <div className="flex-1">
                  <div className="text-sm font-semibold text-gray-900">Product A - 250g Packet</div>
                  <div className="text-xs text-gray-500">3 left • SKU: PA-250</div>
                </div>
                <div className="text-xs font-bold text-red-500">6%</div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-gray-100 rounded flex-shrink-0"></div>
                <div className="flex-1">
                  <div className="text-sm font-semibold text-gray-900">Product C - 2kg Packet</div>
                  <div className="text-xs text-gray-500">1 left • SKU: PC-2K</div>
                </div>
                <div className="text-xs font-bold text-red-500">3%</div>
              </div>
            </div>
            
            <button className="w-full mt-6 flex items-center justify-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-md text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors shadow-sm">
              Manage Inventory 
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
