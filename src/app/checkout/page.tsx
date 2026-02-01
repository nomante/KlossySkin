'use client';

import Link from 'next/link';
import { useCart } from '@/components/CartContext';
import { useState } from 'react';
import { getCurrencySymbol } from '@/lib/currency';
import { Progress } from '@/components/ui/progress';

export default function CheckoutPage() {
  const { items, getTotal, clearCart, getPrimaryCurrency } = useCart();
  const primaryCurrency = getPrimaryCurrency();
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
  });

  const [isProcessing, setIsProcessing] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsProcessing(true);
    setProgress(0);

    // Simulate progress
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) return prev;
        return prev + Math.random() * 40;
      });
    }, 100);

    // Simulate order processing
    setTimeout(() => {
      setProgress(100);
      clearInterval(progressInterval);
      setIsProcessing(false);
      setIsComplete(true);
      clearCart();
    }, 2000);
  };

  if (items.length === 0 && !isComplete) {
    return (
      <main className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-8 sm:py-10 md:py-12">
        <h1 className="text-3xl sm:text-4xl font-semibold text-[#0b3b32] mb-6 sm:mb-8">Checkout</h1>
        <div className="text-center py-12 sm:py-16">
          <p className="text-[#2f5f56] text-base sm:text-lg mb-4">Your cart is empty</p>
          <Link
            href="/products"
            className="inline-block bg-[#1e7864] text-white px-4 sm:px-6 py-2 sm:py-3 rounded text-sm sm:text-base hover:bg-[#008d6e] transition-colors font-semibold"
          >
            Continue Shopping
          </Link>
        </div>
      </main>
    );
  }

  if (isComplete) {
    return (
      <main className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-8 sm:py-10 md:py-12">
        <div className="text-center py-12 sm:py-16">
          <div className="mb-6">
            <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-[#e7f7f3] rounded-full">
              <span className="text-3xl sm:text-4xl">✓</span>
            </div>
          </div>
          <h1 className="text-3xl sm:text-4xl font-semibold text-[#0b3b32] mb-3 sm:mb-4">Order Confirmed!</h1>
          <p className="text-[#2f5f56] text-base sm:text-lg mb-2">Thank you for your purchase.</p>
          <p className="text-[#2f5f56] text-sm sm:text-base mb-8">A confirmation email has been sent to your inbox.</p>
          <Link
            href="/products"
            className="inline-block bg-[#1e7864] text-white px-6 sm:px-8 py-3 sm:py-4 rounded text-sm sm:text-base hover:bg-[#008d6e] transition-colors font-semibold"
          >
            Continue Shopping
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-8 sm:py-10 md:py-12">
      <h1 className="text-3xl sm:text-4xl md:text-5xl font-semibold text-[#0b3b32] mb-6 sm:mb-8">Checkout</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-sm border border-[#e2f3ef] p-4 sm:p-6 md:p-8">
            <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-[#0b3b32] mb-5 sm:mb-6">Shipping Information</h2>
            <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4 md:space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <input
                  type="text"
                  name="firstName"
                  placeholder="First Name"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                  className="px-3 sm:px-4 py-2.5 sm:py-3 border border-[#d9f0ea] rounded focus:outline-none focus:ring-2 focus:ring-[#1e7864] text-sm sm:text-base"
                />
                <input
                  type="text"
                  name="lastName"
                  placeholder="Last Name"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                  className="px-3 sm:px-4 py-2.5 sm:py-3 border border-[#d9f0ea] rounded focus:outline-none focus:ring-2 focus:ring-[#1e7864] text-sm sm:text-base"
                />
              </div>
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                required
                className="px-3 sm:px-4 py-2.5 sm:py-3 border border-[#d9f0ea] rounded focus:outline-none focus:ring-2 focus:ring-[#1e7864] text-sm sm:text-base w-full"
              />
              <input
                type="text"
                name="address"
                placeholder="Address"
                value={formData.address}
                onChange={handleChange}
                required
                className="px-3 sm:px-4 py-2.5 sm:py-3 border border-[#d9f0ea] rounded focus:outline-none focus:ring-2 focus:ring-[#1e7864] text-sm sm:text-base w-full"
              />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <input
                  type="text"
                  name="city"
                  placeholder="City"
                  value={formData.city}
                  onChange={handleChange}
                  required
                  className="px-3 sm:px-4 py-2.5 sm:py-3 border border-[#d9f0ea] rounded focus:outline-none focus:ring-2 focus:ring-[#1e7864] text-sm sm:text-base"
                />
                <input
                  type="text"
                  name="state"
                  placeholder="State"
                  value={formData.state}
                  onChange={handleChange}
                  required
                  className="px-3 sm:px-4 py-2.5 sm:py-3 border border-[#d9f0ea] rounded focus:outline-none focus:ring-2 focus:ring-[#1e7864] text-sm sm:text-base"
                />
              </div>
              <input
                type="text"
                name="zipCode"
                placeholder="ZIP Code"
                value={formData.zipCode}
                onChange={handleChange}
                required
                className="px-3 sm:px-4 py-2.5 sm:py-3 border border-[#d9f0ea] rounded focus:outline-none focus:ring-2 focus:ring-[#1e7864] text-sm sm:text-base w-full"
              />
              <div className="space-y-2">
                <button
                  type="submit"
                  disabled={isProcessing}
                  className="w-full bg-[#1e7864] text-white py-2.5 sm:py-3 rounded text-sm sm:text-base hover:bg-[#008d6e] disabled:bg-gray-400 transition-colors font-semibold mt-6 sm:mt-8"
                >
                  {isProcessing ? 'Processing Order...' : 'Place Order'}
                </button>
                {isProcessing && (
                  <Progress value={progress} max={100} />
                )}
              </div>
            </form>
          </div>
        </div>

        {/* Order Summary Sidebar */}
        <div className="bg-white rounded-lg shadow-sm border border-[#e2f3ef] p-4 sm:p-6 h-fit sticky top-20">
          <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-[#0b3b32] mb-4">Order Summary</h2>
          <div className="space-y-2 sm:space-y-3 mb-4 max-h-48 overflow-y-auto">
            {items.map((item) => (
              <div key={item.productId} className="flex justify-between text-xs sm:text-sm md:text-base gap-2">
                <span className="text-[#2f5f56] flex-1 truncate">{item.name || `Product`} x {item.quantity}</span>
                <span className="font-semibold text-[#0b3b32] shrink-0">${(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>
          <div className="border-t border-[#edf6f4] pt-3 sm:pt-4 mt-3 sm:mt-4">
            <div className="flex justify-between text-sm sm:text-base md:text-lg font-semibold text-[#0b3b32]">
              <span>Total</span>
              <span>{getCurrencySymbol(primaryCurrency || 'USD')}{getTotal().toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
