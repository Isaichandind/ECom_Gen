import { Header } from '@/components/ui/Header';

export default function ShopLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      <main className="flex-1">
        {children}
      </main>
      <footer className="bg-zinc-50 border-t border-zinc-200 py-12 mt-auto">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center text-sm">
          <div className="font-bold tracking-tight text-zinc-950 text-lg mb-4 md:mb-0">
            ECOM.
          </div>
          <div className="flex gap-8 text-zinc-500 font-medium">
            <a href="#" className="hover:text-zinc-950 transition-colors">Shop</a>
            <a href="#" className="hover:text-zinc-950 transition-colors">Support</a>
            <a href="#" className="hover:text-zinc-950 transition-colors">Legal</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
