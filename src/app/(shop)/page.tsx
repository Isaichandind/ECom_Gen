import { getProducts } from '@/domains/inventory/services';
import { AddToCartButton } from '@/domains/inventory/components/AddToCartButton';
import Link from 'next/link';
import { Headphones, Monitor, Mouse, Zap } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function ShopHomePage() {
  const products = await getProducts();

  return (
    <div className="bg-[#f9f9f9] min-h-screen pb-24">
      {/* Hero Section */}
      <div className="max-w-[1400px] mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100">
          <div className="p-12 lg:p-20">
            <span className="inline-block px-3 py-1 bg-gray-100 text-gray-600 text-xs font-semibold tracking-wider rounded-full mb-6">PREMIUM AUDIO COLLECTION</span>
            <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 tracking-tight leading-tight mb-6">
              Immersive Sound, <br/>
              <span className="text-gray-400">Unmatched Precision.</span>
            </h1>
            <p className="text-gray-500 text-lg mb-10 max-w-md leading-relaxed">
              Experience the next generation of wireless noise-canceling technology. Engineered for clarity, comfort, and the ultimate tech enthusiast.
            </p>
            <div className="flex gap-4">
              <button className="bg-gray-900 text-white px-8 py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors flex items-center gap-2">
                Shop Now <span>→</span>
              </button>
              <button className="bg-white text-gray-900 border border-gray-200 px-8 py-3 rounded-lg font-medium hover:border-gray-900 transition-colors">
                Explore Features
              </button>
            </div>
            
            <div className="flex gap-12 mt-16 pt-8 border-t border-gray-100">
              <div>
                <div className="text-xl font-bold text-gray-900">40h+</div>
                <div className="text-[10px] font-bold text-gray-400 tracking-wider uppercase mt-1">Battery Life</div>
              </div>
              <div>
                <div className="text-xl font-bold text-gray-900">99%</div>
                <div className="text-[10px] font-bold text-gray-400 tracking-wider uppercase mt-1">Noise Cancellation</div>
              </div>
              <div>
                <div className="text-xl font-bold text-gray-900">Hi-Res</div>
                <div className="text-[10px] font-bold text-gray-400 tracking-wider uppercase mt-1">Audio Grade</div>
              </div>
            </div>
          </div>
          <div className="bg-gray-200 h-full min-h-[400px] lg:min-h-full relative">
            <div className="absolute inset-0 bg-gradient-to-tr from-gray-300 to-gray-100 flex items-center justify-center">
              {/* Hero Image Placeholder */}
              <div className="w-64 h-64 bg-gray-400 rounded-full opacity-20 blur-3xl absolute"></div>
              <Headphones className="w-48 h-48 text-gray-800 relative z-10" />
            </div>
          </div>
        </div>
      </div>

      {/* Categories */}
      <div className="max-w-[1400px] mx-auto px-6 py-12 border-b border-gray-200">
        <div className="flex justify-between items-end mb-8">
          <h2 className="text-xl font-bold text-gray-900">Shop by Category</h2>
          <button className="text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors flex items-center gap-1">
            View All Categories <span>›</span>
          </button>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { icon: Headphones, name: 'Audio', count: '24 ITEMS' },
            { icon: Monitor, name: 'Computing', count: '18 ITEMS' },
            { icon: Mouse, name: 'Accessories', count: '56 ITEMS' },
            { icon: Zap, name: 'New Arrivals', count: '12 ITEMS' }
          ].map((cat, i) => (
            <div key={i} className="bg-white p-8 rounded-xl border border-gray-200 flex flex-col items-center justify-center text-center cursor-pointer hover:border-gray-900 transition-colors">
              <cat.icon className="w-8 h-8 text-gray-700 mb-4" strokeWidth={1.5} />
              <h3 className="font-semibold text-gray-900">{cat.name}</h3>
              <p className="text-[11px] text-gray-400 font-medium tracking-wider mt-1">{cat.count}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Product Grid */}
      <div className="max-w-[1400px] mx-auto px-6 py-16">
        <div className="flex flex-col lg:flex-row justify-between lg:items-end mb-10 gap-6">
          <div>
            <div className="text-[11px] font-bold text-gray-400 tracking-wider uppercase mb-2">Our Selection</div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Curated Tech Essentials</h2>
            <p className="text-gray-500">High-performance gear selected for reliability and minimalist aesthetics.</p>
          </div>
          <div className="flex gap-2">
            <button className="px-5 py-2 rounded-full bg-gray-900 text-white text-sm font-medium">All</button>
            <button className="px-5 py-2 rounded-full bg-white text-gray-600 border border-gray-200 hover:border-gray-400 text-sm font-medium transition-colors">Computing</button>
            <button className="px-5 py-2 rounded-full bg-white text-gray-600 border border-gray-200 hover:border-gray-400 text-sm font-medium transition-colors">Audio</button>
            <button className="px-5 py-2 rounded-full bg-white text-gray-600 border border-gray-200 hover:border-gray-400 text-sm font-medium transition-colors">Accessories</button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product, i) => (
            <div key={product.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden group flex flex-col">
              <div className="relative aspect-[4/3] bg-[#f2f2f2] p-6 flex items-center justify-center">
                {/* Badges */}
                <div className="absolute top-4 left-4 z-10">
                  {i === 0 && <span className="bg-gray-900 text-white text-[10px] font-bold px-2 py-1 rounded tracking-wide">Best Seller</span>}
                  {i === 1 && <span className="bg-gray-900 text-white text-[10px] font-bold px-2 py-1 rounded tracking-wide">New Arrival</span>}
                  {i === 2 && <span className="bg-gray-900 text-white text-[10px] font-bold px-2 py-1 rounded tracking-wide">Top Rated</span>}
                </div>
                {/* Image Placeholder */}
                <div className="w-full h-full border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center text-gray-400 text-xs">
                  {product.name}
                </div>
              </div>
              <div className="p-5 flex flex-col flex-1">
                <div className="flex justify-between text-xs text-gray-500 mb-2 font-medium">
                  <span className="uppercase tracking-wider">Store</span>
                  <span className="flex items-center gap-1">☆ 4.{9 - (i % 3)}</span>
                </div>
                <h3 className="font-semibold text-gray-900 text-[15px] mb-6 line-clamp-1">{product.name}</h3>
                
                <div className="mt-auto flex items-center justify-between">
                  <div className="font-bold text-gray-900 text-lg">₹{product.price}</div>
                  <Link href={`/product/${product.id}`} className="text-xs font-semibold text-gray-900 border border-gray-200 px-3 py-1.5 rounded hover:border-gray-900 transition-colors flex items-center gap-1">
                    Details <span className="text-[10px]">↗</span>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-12 text-center">
          <button className="bg-white text-gray-700 border border-gray-200 px-6 py-2.5 rounded-full text-sm font-medium hover:border-gray-900 transition-colors flex items-center gap-2 mx-auto">
            Load More Products <span>↻</span>
          </button>
        </div>
      </div>
    </div>
  );
}
