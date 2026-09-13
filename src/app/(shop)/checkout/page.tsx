'use client';
import { useCartStore } from '@/shared/store/cart';
import { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { useRouter } from 'next/navigation';
import { ShieldCheck, ChevronLeft, Lock } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export default function CheckoutPage() {
  const { items, getTotal, clearCart } = useCartStore();
  const [orderId, setOrderId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [utr, setUtr] = useState('');
  const [paymentConfirmed, setPaymentConfirmed] = useState(false);
  const router = useRouter();

  const subtotal = getTotal();
  const shipping = subtotal > 1000 ? 0 : 50;
  const tax = subtotal * 0.18; // 18% GST estimate
  const total = subtotal + shipping + tax;

  const handleCheckout = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/payments/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items }),
      });
      const data = await res.json();
      if (res.status === 401) {
        alert("Please login first!");
        router.push('/login');
        return;
      }
      if (data.error) throw new Error(data.error);
      setOrderId(data.orderId);
    } catch (error: unknown) {
      if (error instanceof Error) {
        alert(error.message);
      } else {
        alert(String(error));
      }
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmUTR = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!utr || !orderId) return;
    setLoading(true);
    try {
      const res = await fetch('/api/payments/confirm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId, utr }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      
      setPaymentConfirmed(true);
      clearCart();
    } catch (error: unknown) {
      if (error instanceof Error) {
        alert(error.message);
      } else {
        alert(String(error));
      }
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0 && !paymentConfirmed) {
    return (
      <div className="bg-background min-h-[70vh] flex flex-col items-center justify-center p-6">
        <h1 className="text-3xl font-bold text-foreground mb-4">Your cart is empty</h1>
        <button onClick={() => router.push('/')} className="px-8 py-3 bg-foreground text-background rounded-lg font-medium hover:bg-gray-800 transition-colors">
          Continue Shopping
        </button>
      </div>
    );
  }

  if (paymentConfirmed) {
    const adminPhone = "919876543210"; // REPLACE WITH ACTUAL PHONE NUMBER
    const whatsappMessage = encodeURIComponent(`Hello, I just placed an order on Vitality Powders!\n\nOrder ID: ${orderId}\nAmount: ₹${total.toFixed(2)}\nUTR Reference: ${utr}\n\nPlease confirm my order. Thank you!`);
    const waLink = `https://wa.me/${adminPhone}?text=${whatsappMessage}`;

    return (
      <div className="bg-background min-h-screen pt-12 pb-24">
        <div className="max-w-3xl mx-auto px-6 bg-card rounded-xl border border-border p-12 text-center shadow-sm">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-green-50 text-green-700 border border-green-200 rounded-full text-xs font-bold uppercase tracking-wider mb-8">
            <ShieldCheck className="w-4 h-4" /> Order Successfully Placed
          </div>
          
          <h1 className="text-4xl font-bold tracking-tight text-foreground mb-4">Thank you for your order!</h1>
          <p className="text-foreground/60 mb-10 max-w-lg mx-auto">
            We&apos;ve received your order and are getting it ready for shipment. To finalize processing, please send the order details to the store owner via WhatsApp.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
            <a href={waLink} target="_blank" rel="noopener noreferrer" className="w-full sm:w-auto px-8 py-3.5 bg-[#25D366] text-white rounded-lg font-bold hover:bg-[#128C7E] transition-colors flex items-center justify-center gap-2 shadow-sm">
               Confirm via WhatsApp
            </a>
            <button onClick={() => router.push('/')} className="w-full sm:w-auto px-8 py-3.5 bg-card text-foreground/80 border border-border rounded-lg font-medium hover:border-foreground transition-colors">
              Continue Shopping
            </button>
          </div>

          <div className="bg-foreground/5 rounded-xl p-8 text-left border border-border">
            <div className="flex justify-between items-center mb-6 pb-6 border-b border-border">
              <div>
                <div className="text-xl font-bold text-foreground">Order #{orderId?.slice(0,8).toUpperCase()}</div>
                <div className="text-xs text-foreground/60 mt-1">October 24, 2026</div>
              </div>
              <div className="px-3 py-1 bg-gray-200 text-foreground/80 text-[10px] font-bold uppercase tracking-wider rounded">
                Processing
              </div>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-foreground/60">Subtotal</span><span className="font-medium">₹{subtotal.toFixed(2)}</span></div>
              <div className="flex justify-between"><span className="text-foreground/60">Shipping</span><span className="font-medium">₹{shipping.toFixed(2)}</span></div>
              <div className="flex justify-between"><span className="text-foreground/60">Estimated Tax</span><span className="font-medium">₹{tax.toFixed(2)}</span></div>
              <div className="flex justify-between text-base font-bold text-foreground pt-4 border-t border-border mt-4"><span className="text-foreground">Total</span><span>₹{total.toFixed(2)}</span></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const upiLink = `upi://pay?pa=storeowner@upi&pn=Store&am=${total.toFixed(2)}&cu=INR`;

  return (
    <div className="bg-background min-h-screen pb-24">
      <div className="max-w-[1400px] mx-auto px-6 py-8">
        <Link href="/" className="inline-flex items-center gap-2 text-sm font-medium text-foreground/60 hover:text-foreground transition-colors">
          <ChevronLeft className="w-4 h-4" /> Back to Store
        </Link>
        <span className="mx-2 text-foreground/30">|</span>
        <span className="text-sm font-bold text-foreground">Checkout</span>
      </div>

      <div className="max-w-[1400px] mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
        
        {/* Left Column: Flow */}
        <div className="lg:col-span-7 space-y-6">
          {/* Step 1 */}
          <div className="bg-card rounded-xl p-8 border border-border opacity-50">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-8 h-8 rounded-full bg-foreground text-background flex items-center justify-center font-bold text-sm">1</div>
              <h2 className="text-xl font-bold text-foreground">Contact Information</h2>
            </div>
            <div className="ml-12 text-sm text-foreground/60">Completed (Assumed via Login)</div>
          </div>

          {/* Step 2 */}
          <div className="bg-card rounded-xl p-8 border border-border opacity-50">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-8 h-8 rounded-full bg-foreground text-background flex items-center justify-center font-bold text-sm">2</div>
              <h2 className="text-xl font-bold text-foreground">Shipping Address</h2>
            </div>
            <div className="ml-12 text-sm text-foreground/60">Using default profile address</div>
          </div>

          {/* Step 3 */}
          <div className="bg-card rounded-xl p-8 border border-border">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-8 h-8 rounded-full bg-foreground text-background flex items-center justify-center font-bold text-sm">3</div>
              <h2 className="text-xl font-bold text-foreground">Payment Details</h2>
            </div>
            
            <div className="ml-12">
              {!orderId ? (
                <div className="border border-border rounded-xl p-6">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-2 font-bold text-foreground">
                      <Lock className="w-4 h-4 text-foreground/40" /> UPI Secure Payment
                    </div>
                    <div className="flex gap-2">
                      <span className="text-[10px] font-bold bg-foreground/10 text-foreground/60 px-2 py-1 rounded">GPay</span>
                      <span className="text-[10px] font-bold bg-foreground/10 text-foreground/60 px-2 py-1 rounded">PhonePe</span>
                    </div>
                  </div>
                  
                  <p className="text-sm text-foreground/60 mb-6">
                    We use a direct UPI transfer flow. Click below to generate your unique payment order.
                  </p>
                  
                  <button
                    onClick={handleCheckout}
                    disabled={loading}
                    className="w-full bg-foreground text-background py-4 rounded-lg font-bold hover:bg-gray-800 transition-colors disabled:opacity-50"
                  >
                    {loading ? 'Processing...' : `Place Order — ₹${total.toFixed(2)}`}
                  </button>
                  <p className="text-xs text-center text-foreground/40 mt-4 flex items-center justify-center gap-1">
                    <ShieldCheck className="w-3 h-3 text-green-500" /> Secure SSL Encrypted
                  </p>
                </div>
              ) : (
                <div className="border border-border rounded-xl p-6 flex flex-col items-center">
                  <h3 className="text-lg font-bold text-foreground mb-2">Scan &amp; Pay</h3>
                  <p className="text-sm text-foreground/60 mb-6">Open your UPI app and scan this code to pay <strong>₹{total.toFixed(2)}</strong></p>
                  
                  <div className="p-4 bg-card border border-border shadow-sm rounded-xl mb-8">
                    <QRCodeSVG value={upiLink} size={200} />
                  </div>

                  <form onSubmit={handleConfirmUTR} className="w-full max-w-sm">
                    <label className="block text-xs font-bold text-foreground/80 uppercase tracking-wider mb-2">Transaction Reference (UTR)</label>
                    <input
                      type="text"
                      required
                      value={utr}
                      onChange={(e) => setUtr(e.target.value)}
                      placeholder="12-digit reference number"
                      className="w-full px-4 py-3 rounded-lg border border-foreground/20 bg-foreground/5 focus:bg-card focus:ring-2 focus:ring-gray-900 focus:border-gray-900 outline-none transition-all mb-4 text-sm font-mono"
                    />
                    <button
                      type="submit"
                      disabled={loading || !utr}
                      className="w-full bg-foreground text-background py-3.5 rounded-lg font-bold hover:bg-gray-800 transition-colors disabled:opacity-50"
                    >
                      {loading ? 'Verifying...' : 'Confirm Payment'}
                    </button>
                  </form>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Summary */}
        <div className="lg:col-span-5">
          <div className="bg-card rounded-xl p-8 border border-border sticky top-32">
            <h2 className="text-xl font-bold text-foreground mb-6">Order Summary</h2>
            
            <div className="space-y-6 mb-8">
              {items.map((item) => (
                <div key={item.productId} className="flex gap-4">
                  <div className="w-16 h-16 bg-foreground/10 rounded-lg border border-border flex-shrink-0" />
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground text-sm leading-tight mb-1">{item.name}</h3>
                    <p className="text-xs text-foreground/60">Qty: {item.quantity}</p>
                  </div>
                  <div className="font-bold text-foreground text-sm">
                    ₹{(item.price * item.quantity).toFixed(2)}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex gap-2 mb-8">
              <input type="text" placeholder="Promo code" className="flex-1 bg-foreground/5 border border-border rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-foreground/30" />
              <button className="bg-foreground/10 text-foreground border border-border px-4 py-2 rounded-lg text-sm font-semibold hover:bg-foreground/20">Apply</button>
            </div>
            
            <div className="pt-6 border-t border-border space-y-3">
              <div className="flex justify-between text-sm text-foreground/60">
                <span>Subtotal</span>
                <span>₹{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm text-foreground/60">
                <span>Shipping</span>
                <span>{shipping === 0 ? 'Free' : `₹${shipping.toFixed(2)}`}</span>
              </div>
              <div className="flex justify-between text-sm text-foreground/60">
                <span>Taxes (Estimated)</span>
                <span>₹{tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-end pt-6 border-t border-border mt-2">
                <span className="text-xl font-bold text-foreground">Total</span>
                <div className="text-right">
                  <span className="text-xs text-foreground/40 font-bold tracking-widest uppercase block mb-1">INR</span>
                  <span className="text-2xl font-bold text-foreground">₹{total.toFixed(2)}</span>
                </div>
              </div>
            </div>
            
            <div className="mt-8 flex items-center justify-center gap-6 pt-6 border-t border-border">
              <div className="flex items-center gap-1.5 text-[10px] font-bold text-foreground/40 uppercase tracking-wider">
                <ShieldCheck className="w-3.5 h-3.5" /> Verified Merchant
              </div>
              <div className="flex items-center gap-1.5 text-[10px] font-bold text-foreground/40 uppercase tracking-wider">
                <Lock className="w-3.5 h-3.5" /> PCI Compliant
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
