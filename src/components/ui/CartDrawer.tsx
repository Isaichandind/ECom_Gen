'use client';

import { useCartStore } from '@/shared/store/cart';
import { X, Trash2 } from 'lucide-react';
import Link from 'next/link';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const { items, getTotal, removeItem, updateQuantity } = useCartStore();

  if (!isOpen) return null;

  return (
    <>
      <div 
        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 transition-opacity"
        onClick={onClose}
      />
      
      <div className="fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-2xl z-50 flex flex-col transform transition-transform duration-300">
        <div className="flex items-center justify-between p-6 border-b border-zinc-200">
          <h2 className="text-xl font-bold tracking-tight">Your Cart ({items.length})</h2>
          <button onClick={onClose} className="p-2 hover:bg-zinc-100 rounded-full transition-colors">
            <X className="w-5 h-5 text-zinc-500" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {items.length === 0 ? (
            <div className="text-center text-zinc-500 mt-20">
              Your cart is currently empty.
            </div>
          ) : (
            items.map((item) => (
              <div key={item.productId} className="flex gap-4">
                <div className="w-20 h-20 bg-zinc-100 rounded-lg flex-shrink-0" />
                <div className="flex-1 flex flex-col">
                  <div className="flex justify-between">
                    <h3 className="font-semibold text-zinc-900">{item.name}</h3>
                    <span className="font-medium text-zinc-900">₹{item.price}</span>
                  </div>
                  <div className="mt-auto flex items-center justify-between">
                    <div className="flex items-center border border-zinc-200 rounded-md">
                      <button 
                        onClick={() => updateQuantity(item.productId, Math.max(1, item.quantity - 1))}
                        className="px-3 py-1 text-zinc-500 hover:text-zinc-900"
                      >-</button>
                      <span className="px-2 text-sm font-medium">{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                        className="px-3 py-1 text-zinc-500 hover:text-zinc-900"
                      >+</button>
                    </div>
                    <button 
                      onClick={() => removeItem(item.productId)}
                      className="text-zinc-400 hover:text-red-500 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {items.length > 0 && (
          <div className="border-t border-zinc-200 p-6 bg-zinc-50">
            <div className="flex justify-between text-zinc-900 mb-2">
              <span className="font-medium">Subtotal</span>
              <span className="font-bold">₹{getTotal()}</span>
            </div>
            <p className="text-sm text-zinc-500 mb-6">Shipping calculated at checkout.</p>
            <Link 
              href="/checkout"
              onClick={onClose}
              className="block w-full bg-zinc-950 text-white text-center py-4 rounded-xl font-medium hover:bg-zinc-800 transition-colors"
            >
              CHECKOUT
            </Link>
          </div>
        )}
      </div>
    </>
  );
}
