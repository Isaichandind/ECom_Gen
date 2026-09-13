import { getProducts } from '@/domains/inventory/services';
import { updateProductInventory } from '@/domains/inventory/services';
import { revalidatePath } from 'next/cache';

export const dynamic = 'force-dynamic';

export default async function AdminInventoryPage() {
  const products = await getProducts();

  const updateStock = async (formData: FormData) => {
    'use server';
    const productId = formData.get('productId') as string;
    const stock = parseInt(formData.get('stock') as string, 10);
    await updateProductInventory(productId, stock);
    revalidatePath('/admin/inventory');
  };

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-zinc-950">Inventory</h1>
        <button className="bg-zinc-950 text-white px-4 py-2 rounded-lg font-medium text-sm hover:bg-zinc-800 transition-colors">
          + Add Product
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-zinc-200 overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-zinc-50 text-zinc-500">
            <tr>
              <th className="px-6 py-3 font-medium">Product</th>
              <th className="px-6 py-3 font-medium">Price</th>
              <th className="px-6 py-3 font-medium">Stock Level</th>
              <th className="px-6 py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100">
            {products.map((product) => (
              <tr key={product.id} className="hover:bg-zinc-50 transition-colors group">
                <td className="px-6 py-4">
                  <div className="font-medium text-zinc-950">{product.name}</div>
                  <div className="text-xs text-zinc-500 font-mono mt-1">ID: {product.id.slice(0,8)}</div>
                </td>
                <td className="px-6 py-4 font-medium text-zinc-950">₹{product.price}</td>
                <td className="px-6 py-4">
                  <form action={updateStock} className="flex items-center gap-2">
                    <input type="hidden" name="productId" value={product.id} />
                    <input 
                      type="number" 
                      name="stock" 
                      defaultValue={product.inventory_count} 
                      className="w-20 px-2 py-1.5 border border-zinc-200 rounded-md text-zinc-950 focus:border-zinc-950 focus:ring-1 focus:ring-zinc-950 outline-none"
                    />
                    <button type="submit" className="text-xs font-medium text-blue-600 hover:text-blue-800 px-2 py-1 rounded hover:bg-blue-50 transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100">
                      Save
                    </button>
                  </form>
                </td>
                <td className="px-6 py-4 text-right">
                  <button className="text-zinc-400 hover:text-zinc-950 transition-colors text-xs font-medium">Edit</button>
                </td>
              </tr>
            ))}
            {products.length === 0 && (
              <tr>
                <td colSpan={4} className="px-6 py-12 text-center text-zinc-500">No inventory found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
