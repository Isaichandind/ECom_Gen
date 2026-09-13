import { Header } from '@/components/ui/Header';
import { Hexagon } from 'lucide-react';

export default function ShopLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-[#f9f9f9]">
      <Header />
      <main className="flex-1">
        {children}
      </main>
      
      {/* Pre-footer Features */}
      <div className="bg-white border-t border-gray-200 border-b">
        <div className="max-w-[1400px] mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
          {[
            { title: 'Worldwide Shipping', desc: 'Fast delivery to over 50 countries with real-time tracking.', icon: '🚚' },
            { title: '2-Year Warranty', desc: 'Comprehensive coverage on all electronic hardware.', icon: '🛡️' },
            { title: 'Easy Returns', desc: '30-day hassle-free return policy for complete peace of mind.', icon: '↺' },
            { title: 'Expert Support', desc: '24/7 technical assistance from our specialized team.', icon: '🎧' },
          ].map((f, i) => (
            <div key={i} className="flex gap-4">
              <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center text-lg flex-shrink-0">
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

      {/* Dark Newsletter Footer Block */}
      <div className="bg-[#111111] text-white">
        <div className="max-w-[1400px] mx-auto px-6 py-24 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">Stay Ahead of the Curve</h2>
          <p className="text-gray-400 mb-8 max-w-md mx-auto">Get early access to new tech drops, exclusive minimalist gear guides, and member-only pricing.</p>
          <div className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto">
            <input 
              type="email" 
              placeholder="Enter your email address" 
              className="flex-1 bg-white/10 border border-white/20 rounded-md px-4 py-3 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:border-white transition-colors"
            />
            <button className="bg-white text-black px-6 py-3 rounded-md text-sm font-semibold hover:bg-gray-200 transition-colors">
              Subscribe
            </button>
          </div>
          <p className="text-[10px] text-gray-500 tracking-wider uppercase mt-4">NO SPAM. JUST GEAR. UNSUBSCRIBE AT ANY TIME.</p>
        </div>
      </div>

      {/* Bottom Footer */}
      <footer className="bg-white border-t border-gray-200 py-8">
        <div className="max-w-[1400px] mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <Hexagon className="w-5 h-5 text-gray-900 fill-current" />
            <div className="font-bold tracking-tight text-gray-900 text-sm">
              TechGear Storefront
            </div>
          </div>
          <div className="flex gap-6 text-gray-500 text-sm font-medium">
            <a href="#" className="hover:text-gray-900 transition-colors">Privacy</a>
            <a href="#" className="hover:text-gray-900 transition-colors">Terms</a>
            <a href="#" className="hover:text-gray-900 transition-colors">Cookies</a>
            <a href="/admin" className="text-gray-900 font-semibold hover:underline">Admin Portal</a>
          </div>
        </div>
        <div className="max-w-[1400px] mx-auto px-6 mt-2">
          <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wider">&copy; {new Date().getFullYear()} TECHGEAR INC. ALL RIGHTS RESERVED.</p>
        </div>
      </footer>
    </div>
  );
}
