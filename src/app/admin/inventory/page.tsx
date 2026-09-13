import { getProducts } from '@/domains/inventory/services';
import { updateProductInventory } from '@/domains/inventory/services';
import { revalidatePath } from 'next/cache';
import { Download, Plus, Search, Filter, AlertTriangle, Clock } from 'lucide-react';

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

  const totalSkus = products.length;
  const lowStock = products.filter(p => p.inventory_count < 20).length;
  const outOfStock = products.filter(p => p.inventory_count === 0).length;
  const inventoryValue = products.reduce((acc, p) => acc + (p.price * p.inventory_count), 0);

  return (
    <div className="max-w-[1400px] mx-auto">
      {/* Header Actions */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-foreground tracking-tight">Inventory Management</h1>
          <p className="text-sm text-foreground/60 mt-1">Track stock levels, update pricing, and manage product listings.</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-card border border-border rounded-md text-sm font-medium text-foreground/80 hover:bg-foreground/5 transition-colors shadow-sm">
            <Download className="w-4 h-4" /> Export CSV
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-gray-900 border border-gray-900 rounded-md text-sm font-medium text-white hover:bg-gray-800 transition-colors shadow-sm">
            <Plus className="w-4 h-4" /> Add Product
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-card p-6 rounded-xl border border-border shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-xs font-bold text-foreground/40 uppercase tracking-wider">Total SKUs</h3>
            <div className="w-6 h-6 flex items-center justify-center text-foreground/40"><Filter className="w-4 h-4" /></div>
          </div>
          <div className="text-3xl font-bold text-foreground mb-2">{totalSkus}</div>
          <div className="text-xs font-medium text-green-600">+12 <span className="text-foreground/40">Items in catalog</span></div>
        </div>
        
        <div className="bg-card p-6 rounded-xl border border-border shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-xs font-bold text-foreground/40 uppercase tracking-wider">Low Stock</h3>
            <div className="w-6 h-6 flex items-center justify-center text-foreground/40"><AlertTriangle className="w-4 h-4" /></div>
          </div>
          <div className="text-3xl font-bold text-foreground mb-2">{lowStock}</div>
          <div className="text-xs font-medium text-foreground/60">Items needing restock</div>
        </div>

        <div className="bg-card p-6 rounded-xl border border-border shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-xs font-bold text-foreground/40 uppercase tracking-wider">Out of Stock</h3>
            <div className="w-6 h-6 flex items-center justify-center text-foreground/40"><Clock className="w-4 h-4" /></div>
          </div>
          <div className="text-3xl font-bold text-foreground mb-2">{outOfStock}</div>
          <div className="text-xs font-medium text-foreground/60">Immediate action required</div>
        </div>

        <div className="bg-card p-6 rounded-xl border border-border shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-xs font-bold text-foreground/40 uppercase tracking-wider">Inventory Value</h3>
            <div className="w-6 h-6 flex items-center justify-center text-foreground/40"></div>
          </div>
          <div className="text-3xl font-bold text-foreground mb-2">₹{inventoryValue.toLocaleString()}</div>
          <div className="text-xs font-medium text-green-600">+4.2% <span className="text-foreground/40">Estimated total value</span></div>
        </div>
      </div>

      {/* Main Table Area */}
      <div className="bg-card rounded-xl shadow-sm border border-border overflow-hidden mb-8">
        <div className="p-4 border-b border-border flex justify-between items-center bg-foreground/5">
          <div className="flex items-center bg-card rounded-md px-3 py-2 w-72 border border-border shadow-sm">
            <Search className="w-4 h-4 text-foreground/40 mr-2" />
            <input 
              type="text" 
              placeholder="Search by product name or SKU..." 
              className="bg-transparent border-none outline-none text-xs w-full text-foreground"
            />
          </div>
          <button className="flex items-center gap-2 px-3 py-2 bg-card border border-border rounded-md text-xs font-semibold text-foreground/80 shadow-sm">
            <Filter className="w-3 h-3" /> All Categories 
          </button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-card text-foreground/40 text-xs font-bold uppercase tracking-wider border-b border-border">
              <tr>
                <th className="px-6 py-4">Product Details</th>
                <th className="px-6 py-4">Stock Level</th>
                <th className="px-6 py-4">Price</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {products.map((product) => (
                <tr key={product.id} className="hover:bg-foreground/5 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-foreground/10 rounded-md border border-border flex-shrink-0"></div>
                      <div>
                        <div className="font-bold text-foreground">{product.name}</div>
                        <div className="text-[10px] font-bold text-foreground/40 tracking-wider uppercase mt-1">SKU: PRD-{product.id.slice(0,4)}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <form action={updateStock} className="flex flex-col gap-1 w-32">
                      <div className="flex justify-between text-xs text-foreground/60 mb-1">
                        <span>{product.inventory_count} / 100</span>
                      </div>
                      <div className="h-1.5 w-full bg-foreground/10 rounded-full overflow-hidden mb-2">
                        <div className="h-full bg-gray-900 rounded-full" style={{ width: `${Math.min(100, product.inventory_count)}%` }}></div>
                      </div>
                      <div className="flex items-center justify-between border border-border rounded-md bg-card">
                        <button type="button" className="px-2 py-1 text-foreground/60">-</button>
                        <input 
                          type="number" 
                          name="stock" 
                          defaultValue={product.inventory_count} 
                          className="w-10 text-center text-xs font-bold text-foreground bg-transparent outline-none"
                        />
                        <button type="submit" className="px-2 py-1 text-foreground font-bold hover:bg-foreground/10">+</button>
                        <input type="hidden" name="productId" value={product.id} />
                      </div>
                    </form>
                  </td>
                  <td className="px-6 py-4 font-bold text-foreground">₹{product.price}</td>
                  <td className="px-6 py-4">
                    <span className={`flex items-center gap-1.5 text-xs font-bold ${
                      product.inventory_count > 20 ? 'text-green-600' :
                      product.inventory_count > 0 ? 'text-yellow-600' : 'text-red-500'
                    }`}>
                      {product.inventory_count > 20 ? '○ In Stock' :
                       product.inventory_count > 0 ? '△ Low Stock' : '⊗ Out of Stock'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-foreground/40 hover:text-foreground transition-colors">⋮</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
