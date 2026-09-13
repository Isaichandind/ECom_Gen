import { getProducts } from '@/domains/inventory/services';
import { AddToCartButton } from '@/domains/inventory/components/AddToCartButton';
import { notFound } from 'next/navigation';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const products = await getProducts();
  const product = products.find(p => p.id === id);

  if (!product) {
    notFound();
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-sm text-zinc-500 mb-8 font-medium tracking-tight">
        <Link href="/" className="hover:text-zinc-950 transition-colors">Home</Link> / All Products / <span className="text-zinc-950">{product.name}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
        {/* Left Side: Sticky Visuals */}
        <div className="lg:sticky lg:top-24 self-start">
          <div className="aspect-square bg-zinc-100 rounded-xl mb-4" />
          <div className="grid grid-cols-3 gap-4">
            <div className="aspect-square bg-zinc-100 rounded-lg cursor-pointer hover:opacity-80 transition-opacity" />
            <div className="aspect-square bg-zinc-100 rounded-lg cursor-pointer hover:opacity-80 transition-opacity" />
            <div className="aspect-square bg-zinc-100 rounded-lg cursor-pointer hover:opacity-80 transition-opacity" />
          </div>
        </div>

        {/* Right Side: Transaction & Details */}
        <div className="py-4">
          <h1 className="text-3xl font-bold tracking-tight text-zinc-950 mb-2">{product.name}</h1>
          <div className="flex items-center gap-4 mb-6">
            <span className="text-xl font-medium text-zinc-950">₹{product.price}</span>
            {product.inventory_count > 0 ? (
              <span className="text-sm font-medium text-green-600 bg-green-50 px-2 py-1 rounded flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-green-600"></span> In Stock
              </span>
            ) : (
              <span className="text-sm font-medium text-red-600 bg-red-50 px-2 py-1 rounded">Out of Stock</span>
            )}
          </div>

          <div className="border-t border-b border-zinc-200 py-6 mb-8">
            <p className="text-zinc-500 leading-relaxed">
              {product.description || 'A minimal everyday essential designed with extreme attention to detail and high-quality materials. Fits perfectly into any modern workflow.'}
            </p>
          </div>

          <div className="mb-8">
            <h3 className="text-sm font-medium text-zinc-950 mb-3">COLOR</h3>
            <div className="flex gap-3">
              <button className="w-8 h-8 rounded-full bg-zinc-950 ring-2 ring-offset-2 ring-zinc-950" aria-label="Matte Black" />
              <button className="w-8 h-8 rounded-full bg-zinc-400 hover:ring-2 hover:ring-offset-2 hover:ring-zinc-400 transition-all" aria-label="Ash Gray" />
            </div>
          </div>

          <div className="mb-8">
            <AddToCartButton product={product} variant="primary" />
          </div>

          <div className="space-y-4">
            <details className="group border-b border-zinc-200 pb-4 cursor-pointer">
              <summary className="font-medium text-zinc-950 flex justify-between items-center list-none">
                Features
                <span className="text-zinc-400 group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <div className="mt-4 text-zinc-500 text-sm leading-relaxed">
                <ul className="list-disc pl-4 space-y-2">
                  <li>Premium materials</li>
                  <li>Minimalist design</li>
                  <li>Durable construction</li>
                </ul>
              </div>
            </details>
            <details className="group border-b border-zinc-200 pb-4 cursor-pointer">
              <summary className="font-medium text-zinc-950 flex justify-between items-center list-none">
                Shipping & Returns
                <span className="text-zinc-400 group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <div className="mt-4 text-zinc-500 text-sm leading-relaxed">
                Free standard shipping on all orders over ₹5000. Returns are accepted within 30 days of purchase in original condition.
              </div>
            </details>
          </div>
        </div>
      </div>
    </div>
  );
}
