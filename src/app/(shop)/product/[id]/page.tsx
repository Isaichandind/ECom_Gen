import { getProducts } from '@/domains/inventory/services';
import { ProductActions } from '@/domains/inventory/components/ProductActions';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Heart, Share2, Shield, Globe, Clock, Leaf } from 'lucide-react';

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
          <Link href="/" className="hover:text-green-700 transition-colors">Home</Link> <span className="mx-2">›</span>
          <Link href="#" className="hover:text-green-700 transition-colors">Proteins & Powders</Link> <span className="mx-2">›</span>
          <span className="text-gray-900">{product.name}</span>
        </div>
      </div>

      {/* Product Top Section */}
      <div className="max-w-[1400px] mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 mb-16">
        {/* Left: Images */}
        <div>
          <div className="aspect-[4/3] bg-white rounded-xl mb-4 border border-gray-100 flex items-center justify-center relative overflow-hidden shadow-sm">
            <div className="absolute inset-0 bg-gradient-to-tr from-[#f4f7f5] to-[#e8f0ea]" />
            <div className="relative z-10 text-green-800 font-medium font-serif italic text-xl">Vitality Pouch</div>
          </div>
          <div className="grid grid-cols-4 gap-4">
            {[1,2,3,4].map(i => (
              <div key={i} className={`aspect-[4/3] bg-white rounded-lg cursor-pointer transition-all border-2 ${i === 1 ? 'border-green-700' : 'border-transparent hover:border-gray-300'}`} />
            ))}
          </div>
        </div>

        {/* Right: Details */}
        <div className="py-2">
          <div className="flex items-center gap-3 mb-3">
            <span className="px-2 py-1 bg-green-50 text-green-700 text-[10px] font-bold uppercase tracking-wider rounded border border-green-100">Best Seller</span>
            <div className="flex items-center gap-1 text-sm font-medium text-gray-600">
              <span className="text-gray-900">☆ 4.9</span>
              <span className="text-gray-400">(2,140 Reviews)</span>
            </div>
          </div>

          <h1 className="text-4xl font-bold text-gray-900 tracking-tight mb-4">{product.name}</h1>
          <p className="text-gray-500 text-sm leading-relaxed mb-8">
            {product.description} Crafted with premium, sustainably sourced ingredients to deliver maximum bioavailability. No fillers, no artificial sweeteners—just pure wellness in every scoop.
          </p>

          <div className="flex items-end gap-4 mb-2">
            <span className="text-3xl font-bold text-gray-900">₹{product.price}</span>
            <span className="text-lg font-medium text-gray-400 line-through mb-1">₹{Math.round(product.price * 1.2)}</span>
            <span className="px-2 py-1 bg-green-700 text-white text-[10px] font-bold tracking-wider rounded mb-1.5">-20% OFF</span>
          </div>
          <p className="text-xs text-gray-500 mb-8">Free shipping on orders over ₹1000</p>

          <div className="mb-8">
            <h3 className="text-[11px] font-bold text-gray-400 tracking-wider uppercase mb-3">Select Flavor</h3>
            <div className="flex gap-3">
              <button className="px-4 py-2 border-2 border-green-700 text-sm font-medium text-gray-900 rounded-md bg-green-50">Unflavored</button>
              <button className="px-4 py-2 border-2 border-transparent bg-white shadow-sm hover:border-gray-300 text-sm font-medium text-gray-600 rounded-md transition-colors">Rich Cacao</button>
              <button className="px-4 py-2 border-2 border-transparent bg-white shadow-sm hover:border-gray-300 text-sm font-medium text-gray-600 rounded-md transition-colors">Vanilla Bean</button>
            </div>
          </div>

          <ProductActions product={product} />

          <div className="flex gap-4 mb-8 mt-4">
            <button className="flex-1 flex items-center justify-center border border-gray-200 bg-white rounded-lg hover:border-green-600 hover:text-green-600 transition-colors text-gray-400 py-3">
              <Heart className="w-5 h-5 mr-2" /> Wishlist
            </button>
            <button className="flex-1 flex items-center justify-center border border-gray-200 bg-white rounded-lg hover:border-gray-900 transition-colors text-gray-400 py-3">
              <Share2 className="w-5 h-5 mr-2" /> Share
            </button>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex items-center gap-2 text-xs font-medium text-gray-600 bg-white px-3 py-2 border border-gray-200 rounded-md">
              <Shield className="w-4 h-4 text-green-600" /> 30-DAY FRESHNESS GUARANTEE
            </div>
            <div className="flex items-center gap-2 text-xs font-medium text-gray-600 bg-white px-3 py-2 border border-gray-200 rounded-md">
              <Globe className="w-4 h-4 text-green-600" /> NATIONWIDE DELIVERY
            </div>
          </div>
        </div>
      </div>

      {/* Tabs & Features Grid */}
      <div className="max-w-[1400px] mx-auto px-6 mb-24">
        <div className="flex gap-8 border-b border-gray-200 mb-8">
          <button className="pb-3 text-sm font-semibold text-green-700 border-b-2 border-green-700">Health Benefits</button>
          <button className="pb-3 text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors">Ingredients & Macros</button>
          <button className="pb-3 text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors">Reviews (2,140)</button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            { title: 'Non-GMO Verified', desc: 'Crafted without genetically modified organisms for pure, natural nourishment.', icon: '🌱' },
            { title: 'Sustainably Sourced', desc: 'We partner with organic farms that practice regenerative agriculture.', icon: '🌍' },
            { title: '3rd-Party Lab Tested', desc: 'Every batch is rigorously tested for heavy metals, microbes, and purity.', icon: '🔬' },
            { title: 'Easily Digestible', desc: 'Formulated with digestive enzymes to prevent bloating and maximize absorption.', icon: '✨' },
          ].map((f, i) => (
            <div key={i} className="bg-white p-6 rounded-xl border border-gray-200 flex gap-4">
              <div className="w-10 h-10 bg-green-50 text-green-700 rounded-full flex items-center justify-center text-lg flex-shrink-0 border border-green-100">
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
          <h2 className="text-2xl font-bold text-gray-900">Explore the Collection</h2>
          <Link href="/" className="text-sm font-medium text-green-700 hover:underline">View All Powders</Link>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
          {products.filter(p => p.id !== id).slice(0, 4).map(p => (
            <Link href={`/product/${p.id}`} key={p.id} className="group flex flex-col">
              <div className="aspect-[4/3] bg-white border border-gray-200 rounded-xl mb-4 overflow-hidden relative p-4 flex items-center justify-center">
                <div className="w-2/3 h-full bg-gradient-to-tr from-[#f4f7f5] to-[#e8f0ea] border border-gray-100 rounded-lg group-hover:scale-105 transition-transform" />
              </div>
              <h3 className="font-semibold text-gray-900 text-sm mb-1 truncate">{p.name}</h3>
              <p className="text-gray-500 text-xs font-medium">₹{p.price}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
