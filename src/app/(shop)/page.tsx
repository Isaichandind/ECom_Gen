import { getProducts } from '@/domains/inventory/services';
import { AddToCartButton } from '@/domains/inventory/components/AddToCartButton';
import Link from 'next/link';
import { Leaf, Droplets, Activity, HeartPulse } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function ShopHomePage() {
  const products = await getProducts();

  return (
    <div className="bg-background min-h-screen pb-24">
      {/* Hero Section */}
      <div className="max-w-[1400px] mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center bg-card rounded-2xl overflow-hidden shadow-sm border border-border">
          <div className="p-12 lg:p-20">
            <span className="inline-block px-3 py-1 bg-green-50 text-green-700 border border-green-100 text-xs font-semibold tracking-wider rounded-full mb-6 uppercase">New: Organic Greens</span>
            <h1 className="text-5xl lg:text-6xl font-bold text-foreground tracking-tight leading-tight mb-6">
              Pure Nutrition, <br/>
              <span className="text-foreground/40">Uncompromised Quality.</span>
            </h1>
            <p className="text-foreground/60 text-lg mb-10 max-w-md leading-relaxed">
              Elevate your daily routine with our sustainably sourced, lab-tested, and great-tasting nutritional powders.
            </p>
            <div className="flex gap-4">
              <button className="bg-foreground text-background px-8 py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors flex items-center gap-2">
                Shop Collection <span>→</span>
              </button>
              <button className="bg-card text-foreground border border-border px-8 py-3 rounded-lg font-medium hover:border-foreground transition-colors">
                Our Standards
              </button>
            </div>
            
            <div className="flex gap-12 mt-16 pt-8 border-t border-border">
              <div>
                <div className="text-xl font-bold text-foreground">100%</div>
                <div className="text-[10px] font-bold text-foreground/40 tracking-wider uppercase mt-1">Organic</div>
              </div>
              <div>
                <div className="text-xl font-bold text-foreground">0g</div>
                <div className="text-[10px] font-bold text-foreground/40 tracking-wider uppercase mt-1">Added Sugar</div>
              </div>
              <div>
                <div className="text-xl font-bold text-foreground">Vegan</div>
                <div className="text-[10px] font-bold text-foreground/40 tracking-wider uppercase mt-1">Plant Based</div>
              </div>
            </div>
          </div>
          <div className="bg-foreground/10 h-full min-h-[400px] lg:min-h-full relative">
            <div className="absolute inset-0 bg-gradient-to-tr from-[#f4f7f5] to-[#e8f0ea] flex items-center justify-center">
              {/* Hero Image Placeholder */}
              <div className="w-64 h-64 bg-green-200 rounded-full opacity-20 blur-3xl absolute"></div>
              <Leaf className="w-48 h-48 text-green-700 relative z-10" />
            </div>
          </div>
        </div>
      </div>

      {/* Categories */}
      <div className="max-w-[1400px] mx-auto px-6 py-12 border-b border-border">
        <div className="flex justify-between items-end mb-8">
          <h2 className="text-xl font-bold text-foreground">Shop by Category</h2>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { icon: Leaf, name: 'Superfoods', count: '10 ITEMS', comingSoon: false }
          ].map((cat, i) => (
            <div key={i} className={`bg-card p-8 rounded-xl border border-border flex flex-col items-center justify-center text-center transition-all ${cat.comingSoon ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer hover:border-green-600'}`}>
              <cat.icon className={`w-8 h-8 mb-4 ${cat.comingSoon ? 'text-foreground/40' : 'text-green-700'}`} strokeWidth={1.5} />
              <h3 className="font-semibold text-foreground flex items-center gap-2">
                {cat.name} 
              </h3>
              <p className={`text-[11px] font-medium tracking-wider mt-1 ${cat.comingSoon ? 'text-orange-500 font-bold' : 'text-foreground/40'}`}>
                {cat.count}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Product Grid */}
      <div className="max-w-[1400px] mx-auto px-6 py-16">
        <div className="flex flex-col lg:flex-row justify-between lg:items-end mb-10 gap-6">
          <div>
            <div className="text-[11px] font-bold text-foreground/40 tracking-wider uppercase mb-2">Our Selection</div>
            <h2 className="text-3xl font-bold text-foreground mb-2">Daily Essentials</h2>
            <p className="text-foreground/60">Premium health powders designed to fuel your active lifestyle.</p>
          </div>
          <div className="flex gap-2">
            <button className="px-5 py-2 rounded-full bg-foreground text-background text-sm font-medium">All</button>
            <button className="px-5 py-2 rounded-full bg-card text-foreground/70 border border-border hover:border-foreground/30 text-sm font-medium transition-colors">Superfoods</button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product, i) => (
            <div key={product.id} className="bg-card rounded-xl border border-border overflow-hidden group flex flex-col hover:shadow-sm transition-shadow">
              <div className="relative aspect-[4/3] bg-[#f9faf9] p-6 flex items-center justify-center border-b border-border">
                {/* Badges */}
                <div className="absolute top-4 left-4 z-10 flex flex-col gap-1">
                  {i === 0 && <span className="bg-green-700 text-white text-[10px] font-bold px-2 py-1 rounded tracking-wide">Best Seller</span>}
                  {product.name.includes('250g') && <span className="bg-foreground/10 text-foreground/70 border border-border text-[10px] font-bold px-2 py-1 rounded tracking-wide">Starter Size</span>}
                  {product.name.includes('1kg') && <span className="bg-foreground/10 text-foreground/70 border border-border text-[10px] font-bold px-2 py-1 rounded tracking-wide">Value Pack</span>}
                </div>
                {/* Image Placeholder */}
                <div className="w-2/3 h-full border-2 border-dashed border-foreground/20 rounded-lg flex items-center justify-center text-foreground/40 text-xs bg-card shadow-sm">
                  Pouch
                </div>
              </div>
              <div className="p-5 flex flex-col flex-1">
                <div className="flex justify-between text-xs text-foreground/60 mb-2 font-medium">
                  <span className="uppercase tracking-wider text-green-700">Vitality</span>
                  <span className="flex items-center gap-1">☆ 4.{9 - (i % 3)}</span>
                </div>
                <h3 className="font-semibold text-foreground text-[15px] mb-6 line-clamp-2">{product.name}</h3>
                
                <div className="mt-auto flex items-center justify-between">
                  <div className="font-bold text-foreground text-lg">₹{product.price}</div>
                  <Link href={`/product/${product.id}`} className="text-xs font-semibold text-foreground border border-border px-3 py-1.5 rounded hover:border-foreground transition-colors flex items-center gap-1">
                    Details <span className="text-[10px]">↗</span>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
