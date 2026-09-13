'use client';
import { useCartStore } from '@/shared/store/cart';
import { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { useRouter } from 'next/navigation';

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
      <div className="max-w-7xl mx-auto px-4 py-24 text-center">
        <h1 className="text-3xl font-bold mb-4">Your cart is empty</h1>
      </div>
    );
  }

  if (paymentConfirmed) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 text-center">
        <h1 className="text-4xl font-black text-green-600 mb-4">Payment Pending Verification!</h1>
        <p className="text-gray-600">Your order has been placed successfully and is awaiting admin verification of the UTR.</p>
      </div>
    );
  }

  const upiLink = `upi://pay?pa=storeowner@upi&pn=Store&am=${total}&cu=INR`;

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 lg:grid-cols-2 gap-12">
      <div>
        <h1 className="text-3xl font-bold mb-8">Checkout</h1>
        <div className="space-y-4">
          {items.map((item) => (
            <div key={item.productId} className="flex justify-between items-center p-4 bg-white rounded-lg border">
              <div>
                <h3 className="font-semibold">{item.name}</h3>
                <p className="text-gray-500 text-sm">Qty: {item.quantity}</p>
              </div>
              <div className="flex items-center gap-4">
                <span className="font-bold">₹{item.price * item.quantity}</span>
                <button onClick={() => removeItem(item.productId)} className="text-red-500 text-sm font-medium">Remove</button>
              </div>
            </div>
          ))}
          <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg border border-gray-200 mt-6">
            <span className="text-lg font-bold">Total</span>
            <span className="text-2xl font-black">₹{total}</span>
          </div>
        </div>
      </div>

      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
        {!orderId ? (
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Ready to Pay?</h2>
            <p className="text-gray-600 mb-8">Generate your unique QR code to pay via any UPI app.</p>
            <button
              onClick={handleCheckout}
              disabled={loading}
              className="w-full bg-black text-white py-4 rounded-xl font-bold text-lg hover:bg-gray-800 transition-colors disabled:opacity-50"
            >
              {loading ? 'Processing...' : 'Generate UPI QR'}
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center text-center">
            <h2 className="text-2xl font-bold mb-2">Scan to Pay</h2>
            <p className="text-gray-500 mb-6">Open GPay, PhonePe, or Paytm</p>
            
            <div className="p-4 bg-white border-2 border-dashed border-gray-300 rounded-xl mb-6 inline-block">
              <QRCodeSVG value={upiLink} size={200} />
            </div>

            <form onSubmit={handleConfirmUTR} className="w-full space-y-4">
              <div>
                <label htmlFor="utr" className="block text-sm font-medium text-gray-700 text-left mb-1">
                  12-Digit UTR / Reference Number
                </label>
                <input
                  id="utr"
                  type="text"
                  required
                  value={utr}
                  onChange={(e) => setUtr(e.target.value)}
                  placeholder="e.g. 123456789012"
                  className="w-full p-3 border rounded-xl bg-gray-50 focus:ring-2 focus:ring-black outline-none transition-all"
                />
              </div>
              <button
                type="submit"
                disabled={loading || !utr}
                className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                {loading ? 'Confirming...' : 'I have paid'}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
