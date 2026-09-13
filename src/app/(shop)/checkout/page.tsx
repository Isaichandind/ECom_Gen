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
    } catch (error: any) {
      alert(error.message);
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
    } catch (error: any) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0 && !paymentConfirmed) {
    return (
      <div className="bg-[#f9f9f9] min-h-[70vh] flex flex-col items-center justify-center p-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Your cart is empty</h1>
        <button onClick={() => router.push('/')} className="px-8 py-3 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 transition-colors">
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
      <div className="bg-[#f9f9f9] min-h-screen pt-12 pb-24">
        <div className="max-w-3xl mx-auto px-6 bg-white rounded-xl border border-gray-200 p-12 text-center shadow-sm">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-green-50 text-green-700 border border-green-200 rounded-full text-xs font-bold uppercase tracking-wider mb-8">
            <ShieldCheck className="w-4 h-4" /> Order Successfully Placed
          </div>
          
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 mb-4">Thank you for your order!</h1>
          <p className="text-gray-500 mb-10 max-w-lg mx-auto">
            We've received your order and are getting it ready for shipment. To finalize processing, please send the order details to the store owner via WhatsApp.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
            <a href={waLink} target="_blank" rel="noopener noreferrer" className="w-full sm:w-auto px-8 py-3.5 bg-[#25D366] text-white rounded-lg font-bold hover:bg-[#128C7E] transition-colors flex items-center justify-center gap-2 shadow-sm">
               Confirm via WhatsApp
            </a>
            <button onClick={() => router.push('/')} className="w-full sm:w-auto px-8 py-3.5 bg-white text-gray-700 border border-gray-200 rounded-lg font-medium hover:border-gray-900 transition-colors">
              Continue Shopping
            </button>
          </div>

          <div className="bg-gray-50 rounded-xl p-8 text-left border border-gray-100">
            <div className="flex justify-between items-center mb-6 pb-6 border-b border-gray-200">
              <div>
                <div className="text-xl font-bold text-gray-900">Order #{orderId?.slice(0,8).toUpperCase()}</div>
                <div className="text-xs text-gray-500 mt-1">October 24, 2026</div>
              </div>
              <div className="px-3 py-1 bg-gray-200 text-gray-700 text-[10px] font-bold uppercase tracking-wider rounded">
                Processing
              </div>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-gray-500">Subtotal</span><span className="font-medium">₹{subtotal.toFixed(2)}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Shipping</span><span className="font-medium">₹{shipping.toFixed(2)}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Estimated Tax</span><span className="font-medium">₹{tax.toFixed(2)}</span></div>
              <div className="flex justify-between text-base font-bold text-gray-900 pt-4 border-t border-gray-200 mt-4"><span className="text-gray-900">Total</span><span>₹{total.toFixed(2)}</span></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const upiLink = `upi://pay?pa=storeowner@upi&pn=Store&am=${total.toFixed(2)}&cu=INR`;

  return (
    <div className="bg-[#f9f9f9] min-h-screen pb-24">
      <div className="max-w-[1400px] mx-auto px-6 py-8">
        <Link href="/" className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors">
          <ChevronLeft className="w-4 h-4" /> Back to Store
        </Link>
        <span className="mx-2 text-gray-300">|</span>
        <span className="text-sm font-bold text-gray-900">Checkout</span>
      </div>

      <div className="max-w-[1400px] mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
        
        {/* Left Column: Flow */}
        <div className="lg:col-span-7 space-y-6">
          {/* Step 1 */}
          <div className="bg-white rounded-xl p-8 border border-gray-200 opacity-50">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-8 h-8 rounded-full bg-gray-900 text-white flex items-center justify-center font-bold text-sm">1</div>
              <h2 className="text-xl font-bold text-gray-900">Contact Information</h2>
            </div>
            <div className="ml-12 text-sm text-gray-500">Completed (Assumed via Login)</div>
          </div>

          {/* Step 2 */}
          <div className="bg-white rounded-xl p-8 border border-gray-200 opacity-50">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-8 h-8 rounded-full bg-gray-900 text-white flex items-center justify-center font-bold text-sm">2</div>
              <h2 className="text-xl font-bold text-gray-900">Shipping Address</h2>
            </div>
            <div className="ml-12 text-sm text-gray-500">Using default profile address</div>
          </div>

          {/* Step 3 */}
          <div className="bg-white rounded-xl p-8 border border-gray-200">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-8 h-8 rounded-full bg-gray-900 text-white flex items-center justify-center font-bold text-sm">3</div>
              <h2 className="text-xl font-bold text-gray-900">Payment Details</h2>
            </div>
            
            <div className="ml-12">
              {!orderId ? (
                <div className="border border-gray-200 rounded-xl p-6">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-2 font-bold text-gray-900">
                      <Lock className="w-4 h-4 text-gray-400" /> UPI Secure Payment
                    </div>
                    <div className="flex gap-2">
                      <span className="text-[10px] font-bold bg-gray-100 text-gray-500 px-2 py-1 rounded">GPay</span>
                      <span className="text-[10px] font-bold bg-gray-100 text-gray-500 px-2 py-1 rounded">PhonePe</span>
                    </div>
                  </div>
                  
                  <p className="text-sm text-gray-500 mb-6">
                    We use a direct UPI transfer flow. Click below to generate your unique payment order.
                  </p>
                  
                  <button
                    onClick={handleCheckout}
                    disabled={loading}
                    className="w-full bg-gray-900 text-white py-4 rounded-lg font-bold hover:bg-gray-800 transition-colors disabled:opacity-50"
                  >
                    {loading ? 'Processing...' : `Place Order — ₹${total.toFixed(2)}`}
                  </button>
                  <p className="text-xs text-center text-gray-400 mt-4 flex items-center justify-center gap-1">
                    <ShieldCheck className="w-3 h-3 text-green-500" /> Secure SSL Encrypted
                  </p>
                </div>
              ) : (
                <div className="border border-gray-200 rounded-xl p-6 flex flex-col items-center">
                  <h3 className="text-lg font-bold text-gray-900 mb-2">Scan & Pay</h3>
                  <p className="text-sm text-gray-500 mb-6">Open your UPI app and scan this code to pay <strong>₹{total.toFixed(2)}</strong></p>
                  
                  <div className="p-4 bg-white border border-gray-200 shadow-sm rounded-xl mb-8">
                    <QRCodeSVG value={upiLink} size={200} />
                  </div>

                  <form onSubmit={handleConfirmUTR} className="w-full max-w-sm">
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Transaction Reference (UTR)</label>
                    <input
                      type="text"
                      required
                      value={utr}
                      onChange={(e) => setUtr(e.target.value)}
                      placeholder="12-digit reference number"
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-gray-900 focus:border-gray-900 outline-none transition-all mb-4 text-sm font-mono"
                    />
                    <button
                      type="submit"
                      disabled={loading || !utr}
                      className="w-full bg-gray-900 text-white py-3.5 rounded-lg font-bold hover:bg-gray-800 transition-colors disabled:opacity-50"
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
          <div className="bg-white rounded-xl p-8 border border-gray-200 sticky top-32">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h2>
            
            <div className="space-y-6 mb-8">
              {items.map((item) => (
                <div key={item.productId} className="flex gap-4">
                  <div className="w-16 h-16 bg-gray-100 rounded-lg border border-gray-200 flex-shrink-0" />
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 text-sm leading-tight mb-1">{item.name}</h3>
                    <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                  </div>
                  <div className="font-bold text-gray-900 text-sm">
                    ₹{(item.price * item.quantity).toFixed(2)}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex gap-2 mb-8">
              <input type="text" placeholder="Promo code" className="flex-1 bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-gray-400" />
              <button className="bg-gray-100 text-gray-900 border border-gray-200 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-gray-200">Apply</button>
            </div>
            
            <div className="pt-6 border-t border-gray-200 space-y-3">
              <div className="flex justify-between text-sm text-gray-500">
                <span>Subtotal</span>
                <span>₹{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-500">
                <span>Shipping</span>
                <span>{shipping === 0 ? 'Free' : `₹${shipping.toFixed(2)}`}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-500">
                <span>Taxes (Estimated)</span>
                <span>₹{tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-end pt-6 border-t border-gray-200 mt-2">
                <span className="text-xl font-bold text-gray-900">Total</span>
                <div className="text-right">
                  <span className="text-xs text-gray-400 font-bold tracking-widest uppercase block mb-1">INR</span>
                  <span className="text-2xl font-bold text-gray-900">₹{total.toFixed(2)}</span>
                </div>
              </div>
            </div>
            
            <div className="mt-8 flex items-center justify-center gap-6 pt-6 border-t border-gray-100">
              <div className="flex items-center gap-1.5 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                <ShieldCheck className="w-3.5 h-3.5" /> Verified Merchant
              </div>
              <div className="flex items-center gap-1.5 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                <Lock className="w-3.5 h-3.5" /> PCI Compliant
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
