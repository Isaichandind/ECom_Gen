'use client';
import { useCartStore } from '@/shared/store/cart';
import { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { useRouter } from 'next/navigation';
import { ShieldCheck } from 'lucide-react';

export default function CheckoutPage() {
  const { items, getTotal, clearCart, removeItem } = useCartStore();
  const [orderId, setOrderId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [utr, setUtr] = useState('');
  const [paymentConfirmed, setPaymentConfirmed] = useState(false);
  const router = useRouter();

  const total = getTotal();

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
      <div className="max-w-3xl mx-auto px-4 py-32 text-center">
        <h1 className="text-3xl font-semibold tracking-tight text-zinc-950 mb-4">Your cart is empty</h1>
        <p className="text-zinc-500 mb-8">Looks like you haven't added anything yet.</p>
        <button onClick={() => router.push('/')} className="px-8 py-3 bg-zinc-950 text-white rounded-lg font-medium hover:bg-zinc-800 transition-colors">
          Continue Shopping
        </button>
      </div>
    );
  }

  if (paymentConfirmed) {
    return (
      <div className="max-w-xl mx-auto px-4 py-32 text-center">
        <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
          <ShieldCheck className="w-8 h-8" />
        </div>
        <h1 className="text-3xl font-semibold tracking-tight text-zinc-950 mb-4">Order Received</h1>
        <p className="text-zinc-500 mb-8 leading-relaxed">
          Your order has been placed successfully. Our team will verify your payment reference shortly and you will receive a confirmation email.
        </p>
        <button onClick={() => router.push('/')} className="px-8 py-3 border border-zinc-200 text-zinc-950 rounded-lg font-medium hover:border-zinc-950 transition-colors">
          Return to Store
        </button>
      </div>
    );
  }

  const upiLink = `upi://pay?pa=storeowner@upi&pn=Store&am=${total}&cu=INR`;

  return (
    <div className="max-w-5xl mx-auto px-4 py-12 lg:py-24 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24">
      {/* Left Column: Order Summary */}
      <div className="lg:col-span-5 order-2 lg:order-1">
        <h2 className="text-xl font-semibold tracking-tight text-zinc-950 mb-8">Order Summary</h2>
        <div className="space-y-6">
          {items.map((item) => (
            <div key={item.productId} className="flex gap-4">
              <div className="w-16 h-16 bg-zinc-100 rounded-lg flex-shrink-0" />
              <div className="flex-1">
                <h3 className="font-medium text-zinc-950">{item.name}</h3>
                <p className="text-sm text-zinc-500">Qty: {item.quantity}</p>
              </div>
              <div className="font-medium text-zinc-950">
                ₹{item.price * item.quantity}
              </div>
            </div>
          ))}
          
          <div className="pt-6 border-t border-zinc-200 space-y-4">
            <div className="flex justify-between text-sm text-zinc-500">
              <span>Subtotal</span>
              <span>₹{total}</span>
            </div>
            <div className="flex justify-between text-sm text-zinc-500">
              <span>Shipping</span>
              <span>Calculated at next step</span>
            </div>
            <div className="flex justify-between text-lg font-semibold text-zinc-950 pt-4 border-t border-zinc-200">
              <span>Total</span>
              <span>₹{total}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Column: Checkout Action */}
      <div className="lg:col-span-7 order-1 lg:order-2">
        <div className="bg-zinc-50 rounded-2xl p-8 lg:p-12 border border-zinc-200">
          {!orderId ? (
            <div>
              <h1 className="text-3xl font-semibold tracking-tight text-zinc-950 mb-4">Secure Checkout</h1>
              <p className="text-zinc-500 mb-8 leading-relaxed">
                Review your order details. We use a direct payment flow to ensure zero additional fees.
              </p>
              <button
                onClick={handleCheckout}
                disabled={loading}
                className="w-full bg-zinc-950 text-white py-4 rounded-xl font-medium hover:bg-zinc-800 transition-colors disabled:opacity-50"
              >
                {loading ? 'Processing...' : 'Place Order & Pay'}
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center text-center">
              <h2 className="text-2xl font-semibold tracking-tight text-zinc-950 mb-2">Scan & Pay</h2>
              <p className="text-zinc-500 mb-8">Use Google Pay, PhonePe, or Paytm to complete your purchase of <strong>₹{total}</strong>.</p>
              
              <div className="p-6 bg-white border border-zinc-200 shadow-sm rounded-2xl mb-8 inline-block">
                <QRCodeSVG value={upiLink} size={220} />
              </div>

              <form onSubmit={handleConfirmUTR} className="w-full max-w-sm mx-auto text-left">
                <label htmlFor="utr" className="block text-sm font-medium text-zinc-950 mb-2">
                  Transaction Reference (UTR)
                </label>
                <input
                  id="utr"
                  type="text"
                  required
                  value={utr}
                  onChange={(e) => setUtr(e.target.value)}
                  placeholder="12-digit reference number"
                  className="w-full px-4 py-3 rounded-lg border border-zinc-300 bg-white focus:ring-2 focus:ring-zinc-950 focus:border-zinc-950 outline-none transition-all mb-4"
                />
                <button
                  type="submit"
                  disabled={loading || !utr}
                  className="w-full bg-blue-600 text-white py-3.5 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  {loading ? 'Verifying...' : 'Submit Payment'}
                </button>
                <p className="text-xs text-center text-zinc-500 mt-4">
                  Your order will be processed as soon as we verify the payment.
                </p>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
