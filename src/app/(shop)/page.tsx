import { getProducts } from '@/domains/inventory/services';
import { AddToCartButton } from '@/domains/inventory/components/AddToCartButton';

export const dynamic = 'force-dynamic';

export default async function ShopHomePage() {
  const products = await getProducts();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-12 text-center">
        <h1 className="text-5xl font-black text-gray-900 mb-4 tracking-tight">Latest Arrivals</h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">Discover our premium collection of minimal essentials.</p>
      </div>

      {products.length === 0 ? (
        <div className="text-center py-24 bg-white rounded-2xl border border-dashed border-gray-300">
          <p className="text-gray-500 text-lg">No products found. Add some from the admin dashboard.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.map((product) => (
            <div key={product.id} className="group flex flex-col bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow border border-gray-100">
              <div className="aspect-square bg-gray-100 relative overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center text-gray-400 font-medium">
                  Product Image
                </div>
              </div>
              <div className="p-6 flex flex-col flex-1">
                <h3 className="font-semibold text-gray-900 text-lg mb-1">{product.name}</h3>
                <p className="text-gray-500 text-sm line-clamp-2 mb-4 flex-1">{product.description}</p>
                <div className="flex items-center justify-between mt-auto">
                  <span className="font-bold text-gray-900 text-xl">₹{product.price}</span>
                  <AddToCartButton product={product} />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
