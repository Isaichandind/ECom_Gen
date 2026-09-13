import { getAdminOrders } from '@/domains/orders/services';
import { Order } from '@/domains/orders/types';
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

  return (
    <main className="min-h-screen p-8 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-black mb-8">Admin Dashboard</h1>
        
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-xl font-bold">Recent Orders</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50 text-gray-600 text-sm border-b">
                <tr>
                  <th className="p-4 font-medium">Order ID</th>
                  <th className="p-4 font-medium">Customer</th>
                  <th className="p-4 font-medium">Amount</th>
                  <th className="p-4 font-medium">Status</th>
                  <th className="p-4 font-medium">UTR Ref</th>
                  <th className="p-4 font-medium">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {orders?.map((order: any) => (
                  <tr key={order.id} className="hover:bg-gray-50/50">
                    <td className="p-4 font-mono text-sm">{order.id.slice(0, 8)}</td>
                    <td className="p-4">
                      <div className="font-medium">{order.profiles?.username || 'Unknown'}</div>
                      <div className="text-sm text-gray-500">{order.profiles?.email}</div>
                    </td>
                    <td className="p-4 font-bold">₹{order.total_amount}</td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                        order.status === 'paid' ? 'bg-green-100 text-green-700' : 
                        order.status === 'pending_verification' ? 'bg-yellow-100 text-yellow-700' : 
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {order.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="p-4 font-mono text-sm">{order.transaction_ref || '-'}</td>
                    <td className="p-4">
                      {order.status === 'pending_verification' && (
                        <form action={approvePayment}>
                          <input type="hidden" name="orderId" value={order.id} />
                          <button type="submit" className="text-sm font-bold text-blue-600 hover:text-blue-800">
                            Approve
                          </button>
                        </form>
                      )}
                    </td>
                  </tr>
                ))}
                {(!orders || orders.length === 0) && (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-gray-500">No orders found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </main>
  );
}
