import { getProducts } from '@/domains/inventory/services';
import { AddToCartButton } from '@/domains/inventory/components/AddToCartButton';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Heart, Share2, Shield, Globe, Clock } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const products = await getProducts();
  const product = products.find(p => p.id === id);

  if (!product) {
    notFound();
  }

  return (
    <div className="bg-[#f9f9f9] min-h-screen pb-24">
      {/* Breadcrumbs */}
      <div className="max-w-[1400px] mx-auto px-6 py-8">
        <div className="text-[13px] text-gray-500 font-medium">
          <Link href="/" className="hover:text-gray-900 transition-colors">Home</Link> <span className="mx-2">›</span>
          <Link href="#" className="hover:text-gray-900 transition-colors">Products</Link> <span className="mx-2">›</span>
          <span className="text-gray-900">{product.name}</span>
        </div>
      </div>

      {/* Product Top Section */}
      <div className="max-w-[1400px] mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 mb-16">
        {/* Left: Images */}
        <div>
          <div className="aspect-[4/3] bg-gray-200 rounded-xl mb-4 border border-gray-100 flex items-center justify-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-tr from-gray-300 to-gray-100" />
            <div className="relative z-10 text-gray-400 font-medium">{product.name}</div>
          </div>
          <div className="grid grid-cols-4 gap-4">
            {[1,2,3,4].map(i => (
              <div key={i} className={`aspect-[4/3] bg-gray-200 rounded-lg cursor-pointer transition-all border-2 ${i === 1 ? 'border-gray-900' : 'border-transparent hover:border-gray-300'}`} />
            ))}
          </div>
        </div>

        {/* Right: Details */}
        <div className="py-2">
          <div className="flex items-center gap-3 mb-3">
            <span className="px-2 py-1 bg-gray-100 text-gray-800 text-[10px] font-bold uppercase tracking-wider rounded">New Arrival</span>
            <div className="flex items-center gap-1 text-sm font-medium text-gray-600">
              <span className="text-gray-900">☆ 4.8</span>
              <span className="text-gray-400">(1240 Reviews)</span>
            </div>
          </div>

          <h1 className="text-4xl font-bold text-gray-900 tracking-tight mb-4">{product.name}</h1>
          <p className="text-gray-500 text-sm leading-relaxed mb-8">
            {product.description} Engineered for pure sonic fidelity, combining hybrid active noise cancellation with custom-tuned drivers to deliver a professional-grade experience.
          </p>

          <div className="flex items-end gap-4 mb-2">
            <span className="text-3xl font-bold text-gray-900">₹{product.price}</span>
            <span className="text-lg font-medium text-gray-400 line-through mb-1">₹{Math.round(product.price * 1.2)}</span>
            <span className="px-2 py-1 bg-red-500 text-white text-[10px] font-bold tracking-wider rounded mb-1.5">-20% OFF</span>
          </div>
          <p className="text-xs text-gray-500 mb-8">Free shipping on orders over ₹1000</p>

          <div className="mb-8">
            <h3 className="text-[11px] font-bold text-gray-400 tracking-wider uppercase mb-3">Select Color: Midnight Black</h3>
            <div className="flex gap-3">
              <button className="px-4 py-2 border-2 border-gray-900 text-sm font-medium text-gray-900 rounded-md">Midnight Black</button>
              <button className="px-4 py-2 border-2 border-transparent bg-white shadow-sm hover:border-gray-300 text-sm font-medium text-gray-600 rounded-md transition-colors">Slate Grey</button>
            </div>
          </div>

          <div className="mb-8">
            <h3 className="text-[11px] font-bold text-gray-400 tracking-wider uppercase mb-3">Quantity</h3>
            <div className="flex items-center gap-4">
              <div className="flex items-center bg-white border border-gray-200 rounded-md">
                <button className="px-4 py-2 text-gray-500 hover:text-gray-900 transition-colors">-</button>
                <span className="px-4 py-2 text-sm font-semibold text-gray-900 border-x border-gray-200">1</span>
                <button className="px-4 py-2 text-gray-500 hover:text-gray-900 transition-colors">+</button>
              </div>
              <span className="text-xs text-gray-500 flex items-center gap-1"><Clock className="w-3 h-3" /> Ships within 24 hours</span>
            </div>
          </div>

          <div className="flex gap-4 mb-8">
            <div className="flex-1">
              <AddToCartButton product={product} variant="primary" />
            </div>
            <button className="w-12 flex items-center justify-center border border-gray-200 bg-white rounded-lg hover:border-gray-900 transition-colors text-gray-600">
              <Heart className="w-5 h-5" />
            </button>
            <button className="w-12 flex items-center justify-center border border-gray-200 bg-white rounded-lg hover:border-gray-900 transition-colors text-gray-600">
              <Share2 className="w-5 h-5" />
            </button>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex items-center gap-2 text-xs font-medium text-gray-600 bg-white px-3 py-2 border border-gray-200 rounded-md">
              <Shield className="w-4 h-4 text-gray-400" /> 2 YEAR WARRANTY
            </div>
            <div className="flex items-center gap-2 text-xs font-medium text-gray-600 bg-white px-3 py-2 border border-gray-200 rounded-md">
              <Globe className="w-4 h-4 text-gray-400" /> GLOBAL DELIVERY
            </div>
          </div>
        </div>
      </div>

      {/* Tabs & Features Grid */}
      <div className="max-w-[1400px] mx-auto px-6 mb-24">
        <div className="flex gap-8 border-b border-gray-200 mb-8">
          <button className="pb-3 text-sm font-semibold text-gray-900 border-b-2 border-gray-900">Key Features</button>
          <button className="pb-3 text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors">Specifications</button>
          <button className="pb-3 text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors">Reviews (1240)</button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            { title: 'Adaptive ANC', desc: 'Industry-leading noise cancellation that adapts to your environment in real-time.', icon: '🛡️' },
            { title: 'All-Day Battery', desc: 'Up to 45 hours of continuous playback on a single charge with ANC enabled.', icon: '⏱️' },
            { title: 'Hi-Res Audio', desc: 'Support for LDAC and aptX Adaptive for high-definition wireless streaming.', icon: '🎵' },
            { title: 'Smart Controls', desc: 'Intuitive touch interface on the earcups for volume, calls, and voice assistant.', icon: '⚡' },
          ].map((f, i) => (
            <div key={i} className="bg-white p-6 rounded-xl border border-gray-200 flex gap-4">
              <div className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center text-lg flex-shrink-0 border border-gray-100">
                {f.icon}
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 text-sm mb-1">{f.title}</h4>
                <p className="text-gray-500 text-xs leading-relaxed">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* You May Also Like */}
      <div className="max-w-[1400px] mx-auto px-6">
        <div className="flex justify-between items-end mb-8">
          <h2 className="text-2xl font-bold text-gray-900">You May Also Like</h2>
          <Link href="/" className="text-sm font-medium text-gray-900 hover:underline">Browse Collection</Link>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
          {products.filter(p => p.id !== id).slice(0, 4).map(p => (
            <Link href={`/product/${p.id}`} key={p.id} className="group flex flex-col">
              <div className="aspect-[4/3] bg-white border border-gray-200 rounded-xl mb-4 overflow-hidden relative p-4 flex items-center justify-center">
                <div className="w-full h-full bg-gray-100 rounded-lg group-hover:scale-105 transition-transform" />
              </div>
              <h3 className="font-semibold text-gray-900 text-sm mb-1">{p.name}</h3>
              <p className="text-gray-500 text-xs font-medium">₹{p.price}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
