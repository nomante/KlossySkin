'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/components/CartContext';
import { Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import { getCurrencySymbol } from '@/lib/currency';
import { useEffect, useState } from 'react';
import { CartItem } from '@/types';

interface ProductData {
  id: string;
  image: string;
  currency: string;
  [key: string]: unknown;
}

export default function CartPage() {
  const { items, removeItem, updateQuantity, clearCart, getTotal, getPrimaryCurrency } = useCart();
  const primaryCurrency = getPrimaryCurrency();
  const [productData, setProductData] = useState<Record<string, ProductData>>({});
  
  // Fetch latest product data from API
  useEffect(() => {
    async function fetchProductData() {
      if (items.length === 0) {
        return;
      }

      try {
        const uniqueIds = [...new Set(items.map(item => item.productId))];
        const fetchedData: Record<string, ProductData> = {};

        // Fetch each product to get the latest image and currency
        await Promise.all(
          uniqueIds.map(async (id) => {
            try {
              const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/products/${id}`);
              if (response.ok) {
                const product = await response.json();
                fetchedData[id] = product;
              }
            } catch (error) {
              console.error(`Failed to fetch product ${id}:`, error);
            }
          })
        );

        setProductData(fetchedData);
      } catch (error) {
        console.error('Failed to fetch product data:', error);
      }
    }

    fetchProductData();
  }, [items]);
  
  // Helper function to get currency symbol for a specific item
  const getCurrencyForItem = (currency?: string | null) => {
    const curr = currency || primaryCurrency || 'USD';
    return getCurrencySymbol(curr);
  };

  // Get latest image and currency from API data if available, otherwise use stored data
  const getItemImage = (item: CartItem) => {
    return productData[item.productId]?.image || '/placeholder.jpg';
  };

  const getItemCurrency = (item: CartItem) => {
    return productData[item.productId]?.currency || 'USD';
  };

  if (items.length === 0) {
    return (
      <main className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-12 sm:py-16 md:py-20 min-h-[70vh] flex items-center justify-center">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 sm:w-24 sm:h-24 bg-[#e7f7f3] rounded-full mb-6">
            <ShoppingBag className="w-10 h-10 sm:w-12 sm:h-12 text-[#008d6e]" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-[#0b3b32] mb-3">Your cart is empty</h1>
          <p className="text-[#2f5f56] text-base sm:text-lg mb-8">Looks like you haven&apos;t added anything yet.</p>
          <Link
            href="/products"
            className="inline-flex items-center gap-2 bg-linear-to-r from-[#1e7864] to-[#008d6e] text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-semibold hover:shadow-lg transition-all"
          >
            Continue Shopping <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-8 sm:py-12 md:py-16">
      <div className="mb-8">
        <h1 className="text-4xl sm:text-5xl font-bold text-[#0b3b32]">Shopping Cart</h1>
        <p className="text-[#2f5f56] mt-2">{items.length} item{items.length !== 1 ? 's' : ''} in your cart</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <div
              key={item.productId}
              className="bg-white rounded-2xl border border-[#e2f3ef] overflow-hidden hover:shadow-lg transition-all duration-300"
            >
              <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 p-4 sm:p-6">
                {/* Product Image - Display fetched image */}
                {getItemImage(item) ? (
                  <div className="w-full sm:w-32 md:w-40 shrink-0">
                    <div className="relative w-full aspect-square bg-[#f0faf7] rounded-xl overflow-hidden">
                      <Image
                        src={getItemImage(item)}
                        alt={item.name || 'Product'}
                        fill
                        className="object-cover"
                        onError={(e) => {
                          const img = e.target as HTMLImageElement;
                          img.src = '/images/placeholder.jpg';
                        }}
                      />
                    </div>
                  </div>
                ) : (
                  <div className="w-full sm:w-32 md:w-40 shrink-0">
                    <div className="relative w-full aspect-square bg-[#f0faf7] rounded-xl overflow-hidden flex items-center justify-center">
                      <span className="text-[#2f5f56]">No Image</span>
                    </div>
                  </div>
                )}

                {/* Product Details */}
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-lg sm:text-xl font-bold text-[#0b3b32] mb-2">
                      {item.name || 'Product'}
                    </h3>
                    <p className="text-[#2f5f56] text-sm mb-4">
                      Price per item: {getCurrencyForItem(getItemCurrency(item))}{item.price.toFixed(2)}
                    </p>
                  </div>

                  {/* Quantity & Price */}
                  <div className="flex items-end justify-between sm:items-center gap-4">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-[#2f5f56]">Qty:</span>
                      <div className="flex items-center border border-[#d9f0ea] rounded-lg">
                        <button
                          onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                          className="px-3 py-2 text-[#1e7864] hover:bg-[#e7f7f3] transition-colors font-semibold"
                        >
                          −
                        </button>
                        <span className="px-4 py-2 font-semibold text-[#0b3b32] border-l border-r border-[#d9f0ea]">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                          className="px-3 py-2 text-[#1e7864] hover:bg-[#e7f7f3] transition-colors font-semibold"
                        >
                          +
                        </button>
                      </div>
                    </div>

                    <div className="text-right">
                      <p className="text-2xl sm:text-3xl font-bold text-[#1e7864]">
                        {getCurrencyForItem(getItemCurrency(item))}{(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Remove Button */}
                <div className="flex sm:flex-col justify-end pt-4 sm:pt-0 border-t sm:border-t-0">
                  <button
                    onClick={() => removeItem(item.productId)}
                    className="inline-flex items-center gap-2 text-red-600 hover:text-red-700 hover:bg-red-50 px-3 py-2 rounded-lg transition-colors text-sm font-medium"
                  >
                    <Trash2 className="w-4 h-4" />
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary Sidebar */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 bg-linear-to-br from-[#f8fffe] to-[#e7f7f3] rounded-2xl border border-[#e2f3ef] p-6 sm:p-8">
            <h2 className="text-2xl font-bold text-[#0b3b32] mb-6">Order Summary</h2>

            <div className="space-y-4 mb-6">
              <div className="flex justify-between text-[#2f5f56]">
                <span>Subtotal</span>
                <span className="font-semibold">{getCurrencyForItem()}{getTotal().toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-[#2f5f56]">
                <span>Shipping</span>
                <span className="font-semibold">{getCurrencyForItem()}0.00</span>
              </div>
              <div className="flex justify-between text-[#2f5f56]">
                <span>Tax</span>
                <span className="font-semibold">{getCurrencyForItem()}0.00</span>
              </div>
            </div>

            <div className="border-t-2 border-[#d9f0ea] pt-6 mb-6">
              <div className="flex justify-between items-center">
                <span className="text-lg font-semibold text-[#0b3b32]">Total</span>
                <span className="text-3xl font-bold bg-linear-to-r from-[#1e7864] to-[#008d6e] bg-clip-text text-transparent">
                  {getCurrencyForItem()}{getTotal().toFixed(2)}
                </span>
              </div>
            </div>

            <Link
              href="/checkout"
              className="w-full bg-linear-to-r from-[#1e7864] to-[#008d6e] text-white py-3 rounded-xl font-semibold hover:shadow-lg transition-all flex items-center justify-center gap-2 mb-3"
            >
              Proceed to Checkout <ArrowRight className="w-5 h-5" />
            </Link>

            <button
              onClick={clearCart}
              className="w-full border-2 border-[#d9f0ea] text-[#1e7864] py-3 rounded-xl font-semibold hover:bg-[#e7f7f3] transition-colors"
            >
              Clear Cart
            </button>

            <div className="mt-6 p-4 bg-white rounded-xl">
              <p className="text-xs text-[#2f5f56] text-center">
                ✓ Free shipping on orders over 50<br/>
                ✓ Easy returns within 30 days<br/>
                ✓ Secure checkout
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Continue Shopping */}
      <div className="mt-12 text-center">
        <p className="text-[#2f5f56] mb-4">Want to add more items?</p>
        <Link
          href="/products"
          className="inline-flex items-center gap-2 text-[#1e7864] hover:text-[#008d6e] font-semibold text-lg"
        >
          Continue Shopping <ArrowRight className="w-5 h-5" />
        </Link>
      </div>
    </main>
  );
}
