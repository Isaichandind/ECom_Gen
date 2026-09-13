import { getAdminOrders } from '@/domains/orders/services';
import { updateOrderStatus } from '@/domains/orders/services';
import { revalidatePath } from 'next/cache';

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
    <div className="p-8 max-w-7xl mx-auto">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl border border-zinc-200 shadow-sm">
          <h3 className="text-sm font-medium text-zinc-500 mb-2">Total Revenue</h3>
          <p className="text-3xl font-bold tracking-tight text-zinc-950">₹{revenue.toLocaleString()}</p>
        </div>
        <div className="bg-white p-6 rounded-xl border border-zinc-200 shadow-sm">
          <h3 className="text-sm font-medium text-zinc-500 mb-2">Total Orders</h3>
          <p className="text-3xl font-bold tracking-tight text-zinc-950">{orders?.length || 0}</p>
        </div>
        <div className="bg-white p-6 rounded-xl border border-zinc-200 shadow-sm">
          <h3 className="text-sm font-medium text-zinc-500 mb-2">Avg Order Value</h3>
          <p className="text-3xl font-bold tracking-tight text-zinc-950">₹{orders?.length && revenue > 0 ? Math.round(revenue / orders.length).toLocaleString() : 0}</p>
        </div>
      </div>
      
      <div className="bg-white rounded-xl shadow-sm border border-zinc-200 overflow-hidden">
        <div className="p-6 border-b border-zinc-200 flex justify-between items-center">
          <h2 className="text-lg font-bold tracking-tight text-zinc-950">Recent Orders</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-zinc-50 text-zinc-500">
              <tr>
                <th className="px-6 py-3 font-medium">Order ID</th>
                <th className="px-6 py-3 font-medium">Date</th>
                <th className="px-6 py-3 font-medium">Customer</th>
                <th className="px-6 py-3 font-medium">Total</th>
                <th className="px-6 py-3 font-medium">Status</th>
                <th className="px-6 py-3 font-medium text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {orders?.map((order: any) => (
                <tr key={order.id} className="hover:bg-zinc-50 transition-colors">
                  <td className="px-6 py-4 font-mono text-zinc-500">{order.id.slice(0, 8).toUpperCase()}</td>
                  <td className="px-6 py-4 text-zinc-950 whitespace-nowrap">{new Date(order.created_at).toLocaleDateString()}</td>
                  <td className="px-6 py-4">
                    <div className="font-medium text-zinc-950">{order.profiles?.username || 'Unknown'}</div>
                    <div className="text-xs text-zinc-500">{order.profiles?.email}</div>
                  </td>
                  <td className="px-6 py-4 font-medium text-zinc-950">₹{order.total_amount}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider ${
                      order.status === 'paid' ? 'bg-green-100 text-green-700' : 
                      order.status === 'pending_verification' ? 'bg-yellow-100 text-yellow-700' : 
                      'bg-zinc-100 text-zinc-700'
                    }`}>
                      {order.status}
                    </span>
                    {order.status === 'pending_verification' && order.transaction_ref && (
                      <div className="text-xs text-zinc-500 mt-1 font-mono">Ref: {order.transaction_ref}</div>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    {order.status === 'pending_verification' ? (
                      <form action={approvePayment}>
                        <input type="hidden" name="orderId" value={order.id} />
                        <button type="submit" className="text-xs font-bold bg-zinc-950 text-white px-3 py-1.5 rounded hover:bg-zinc-800 transition-colors">
                          Approve
                        </button>
                      </form>
                    ) : (
                      <span className="text-zinc-400 text-xs">-</span>
                    )}
                  </td>
                </tr>
              ))}
              {(!orders || orders.length === 0) && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-zinc-500">No orders found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
