import { getProducts } from '@/domains/inventory/services';
import { AddToCartButton } from '@/domains/inventory/components/AddToCartButton';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function ShopHomePage() {
  const products = await getProducts();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-sm text-zinc-500 mb-8 font-medium tracking-tight">Home / All Products</div>

      <div className="mb-16">
        <h1 className="text-4xl font-semibold tracking-tight text-zinc-950 mb-2">Essential Collection</h1>
        <p className="text-zinc-500 text-lg">Minimalist goods for everyday carry.</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-12">
        <aside className="w-full lg:w-48 flex-shrink-0">
          <div className="sticky top-24 space-y-8">
            <div>
              <h3 className="font-semibold text-zinc-950 mb-4 tracking-tight">Categories</h3>
              <ul className="space-y-3 text-sm text-zinc-500">
                <li className="flex items-center gap-2 text-zinc-950 font-medium">
                  <div className="w-4 h-4 border border-zinc-950 rounded-[2px] bg-zinc-950" />
                  All
                </li>
                <li className="flex items-center gap-2 cursor-pointer hover:text-zinc-950 transition-colors">
                  <div className="w-4 h-4 border border-zinc-300 rounded-[2px]" />
                  Bags
                </li>
                <li className="flex items-center gap-2 cursor-pointer hover:text-zinc-950 transition-colors">
                  <div className="w-4 h-4 border border-zinc-300 rounded-[2px]" />
                  Tech
                </li>
                <li className="flex items-center gap-2 cursor-pointer hover:text-zinc-950 transition-colors">
                  <div className="w-4 h-4 border border-zinc-300 rounded-[2px]" />
                  Apparel
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-zinc-950 mb-4 tracking-tight">Price</h3>
              <ul className="space-y-3 text-sm text-zinc-500">
                <li className="hover:text-zinc-950 cursor-pointer transition-colors">₹0 - ₹1000</li>
                <li className="hover:text-zinc-950 cursor-pointer transition-colors">₹1000 - ₹5000</li>
                <li className="hover:text-zinc-950 cursor-pointer transition-colors">₹5000+</li>
              </ul>
            </div>
          </div>
        </aside>

        <div className="flex-1">
          <div className="flex justify-end mb-6 text-sm">
            <button className="text-zinc-500 font-medium flex items-center gap-2 hover:text-zinc-950 transition-colors">
              Sort By: Newest <span className="text-[10px]">▼</span>
            </button>
          </div>
          
          {products.length === 0 ? (
            <div className="py-24 text-center text-zinc-500">No products found.</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
              {products.map((product) => (
                <Link href={`/product/${product.id}`} key={product.id} className="group flex flex-col">
                  <div className="aspect-[4/5] bg-zinc-100 relative overflow-hidden mb-4 rounded-md">
                    <div className="absolute inset-0 transition-transform duration-500 group-hover:scale-105" />
                  </div>
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-medium text-zinc-950">{product.name}</h3>
                      <p className="text-zinc-500 text-sm mt-1">₹{product.price}</p>
                    </div>
                  </div>
                  <div className="mt-auto">
                    <AddToCartButton product={product} variant="ghost" />
                  </div>
                </Link>
              ))}
            </div>
          )}

          {products.length > 0 && (
            <div className="mt-16 text-center">
              <button className="px-8 py-3 border border-zinc-200 text-zinc-950 font-medium rounded-lg hover:border-zinc-950 transition-colors tracking-tight">
                Load More
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
