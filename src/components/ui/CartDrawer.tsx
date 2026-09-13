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
      
      <div className="fixed top-0 right-0 h-full w-full max-w-md bg-card shadow-2xl z-50 flex flex-col transform transition-transform duration-300">
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-xl font-bold tracking-tight">Your Cart ({items.length})</h2>
          <button onClick={onClose} className="p-2 hover:bg-foreground/10 rounded-full transition-colors">
            <X className="w-5 h-5 text-foreground/60" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {items.length === 0 ? (
            <div className="text-center text-foreground/60 mt-20">
              Your cart is currently empty.
            </div>
          ) : (
            items.map((item) => (
              <div key={item.productId} className="flex gap-4">
                <div className="w-20 h-20 bg-foreground/10 rounded-lg flex-shrink-0" />
                <div className="flex-1 flex flex-col">
                  <div className="flex justify-between">
                    <h3 className="font-semibold text-foreground">{item.name}</h3>
                    <span className="font-medium text-foreground">₹{item.price}</span>
                  </div>
                  <div className="mt-auto flex items-center justify-between">
                    <div className="flex items-center border border-border rounded-md">
                      <button 
                        onClick={() => updateQuantity(item.productId, Math.max(1, item.quantity - 1))}
                        className="px-3 py-1 text-foreground/60 hover:text-foreground"
                      >-</button>
                      <span className="px-2 text-sm font-medium">{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                        className="px-3 py-1 text-foreground/60 hover:text-foreground"
                      >+</button>
                    </div>
                    <button 
                      onClick={() => removeItem(item.productId)}
                      className="text-foreground/40 hover:text-red-500 transition-colors"
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
          <div className="border-t border-border p-6 bg-foreground/5">
            <div className="flex justify-between text-foreground mb-2">
              <span className="font-medium">Subtotal</span>
              <span className="font-bold">₹{getTotal()}</span>
            </div>
            <p className="text-sm text-foreground/60 mb-6">Shipping calculated at checkout.</p>
            <Link 
              href="/checkout"
              onClick={onClose}
              className="block w-full bg-foreground text-background text-center py-4 rounded-xl font-medium hover:opacity-90 transition-colors"
            >
              CHECKOUT
            </Link>
          </div>
        )}
      </div>
    </>
  );
}
