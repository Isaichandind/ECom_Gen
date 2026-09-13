import { Header } from '@/components/ui/Header';
import { Leaf } from 'lucide-react';

export default function ShopLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1">
        {children}
      </main>
      
      {/* Pre-footer Features */}
      <div className="bg-card border-t border-border border-b">
        <div className="max-w-[1400px] mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
          {[
            { title: 'Free Shipping', desc: 'On all domestic orders over ₹1000.', icon: '🚚' },
            { title: 'Sustainably Sourced', desc: 'Ingredients from organic, fair-trade farms.', icon: '🌱' },
            { title: 'Lab Tested', desc: 'Third-party tested for heavy metals and purity.', icon: '🔬' },
            { title: 'Expert Support', desc: 'Nutritionists ready to answer your questions.', icon: '🤍' },
          ].map((f, i) => (
            <div key={i} className="flex gap-4">
              <div className="w-10 h-10 bg-green-50 text-green-700 rounded-lg flex items-center justify-center text-lg flex-shrink-0">
                {f.icon}
              </div>
              <div>
                <h4 className="font-semibold text-foreground text-sm mb-1">{f.title}</h4>
                <p className="text-foreground/60 text-xs leading-relaxed">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Dark Newsletter Footer Block */}
      <div className="bg-[#111111] text-white">
        <div className="max-w-[1400px] mx-auto px-6 py-24 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">Join the Vitality Club</h2>
          <p className="text-white/40 mb-8 max-w-md mx-auto">Get early access to new product drops, exclusive wellness guides, and member-only pricing.</p>
          <div className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto">
            <input 
              type="email" 
              placeholder="Enter your email address" 
              className="flex-1 bg-white/10 border border-white/20 rounded-md px-4 py-3 text-sm text-white placeholder:text-white/60 focus:outline-none focus:border-white transition-colors"
            />
            <button className="bg-white text-black px-6 py-3 rounded-md text-sm font-semibold hover:bg-white/90 transition-colors">
              Subscribe
            </button>
          </div>
          <p className="text-[10px] text-white/60 tracking-wider uppercase mt-4">NO SPAM. JUST WELLNESS. UNSUBSCRIBE AT ANY TIME.</p>
        </div>
      </div>

      {/* Bottom Footer */}
      <footer className="bg-card border-t border-border py-8">
        <div className="max-w-[1400px] mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <Leaf className="w-5 h-5 text-green-700 fill-current" />
            <div className="font-bold tracking-tight text-foreground text-sm">
              Vitality Powders Store
            </div>
          </div>
          <div className="flex gap-6 text-foreground/60 text-sm font-medium">
            <a href="#" className="hover:text-foreground transition-colors">Privacy</a>
            <a href="#" className="hover:text-foreground transition-colors">Terms</a>
            <a href="#" className="hover:text-foreground transition-colors">Refunds</a>
            <a href="/admin" className="text-foreground font-semibold hover:underline">Admin Portal</a>
          </div>
        </div>
        <div className="max-w-[1400px] mx-auto px-6 mt-2">
          <p className="text-[10px] text-foreground/40 font-medium uppercase tracking-wider">&copy; {new Date().getFullYear()} VITALITY POWDERS INC. ALL RIGHTS RESERVED.</p>
        </div>
      </footer>
    </div>
  );
}
