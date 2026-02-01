'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useCart } from '@/components/CartContext';
import { ArrowLeft, Truck, RotateCcw, Shield } from 'lucide-react';
import { getCurrencySymbol } from '@/lib/currency';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: 'USD' | 'EUR' | 'GBP' | 'NGN' | 'GHS';
  image: string;
  category: string;
  stock: number;
}

interface ProductDetailsClientProps {
  product: Product;
}

export function ProductDetailsClient({ product }: ProductDetailsClientProps) {
  const { addItem } = useCart();
  const [isAdded, setIsAdded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [quantity, setQuantity] = useState(1);

  const handleAddToCart = async () => {
    if (isLoading) return;
    
    setIsLoading(true);
    setProgress(0);
    
    // Simulate progress
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) return prev;
        return prev + Math.random() * 40;
      });
    }, 100);

    try {
      // Simulate async operation
      await new Promise((resolve) => setTimeout(resolve, 600));
      
      addItem({
        productId: product.id,
        quantity,
        price: product.price,
        currency: product.currency,
        name: product.name,
        image: product.image,
      });
      
      setProgress(100);
      setIsAdded(true);
      setTimeout(() => {
        setIsAdded(false);
        setIsLoading(false);
        setProgress(0);
      }, 1500);
    } catch (error) {
      console.error('Error adding to cart:', error);
      setIsLoading(false);
      setProgress(0);
    } finally {
      clearInterval(progressInterval);
    }
  };

  return (
    <main className="min-h-screen bg-white py-8 sm:py-10 md:py-12 lg:py-16 px-3 sm:px-4 md:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Back Button */}
        <Link href="/products" className="flex items-center gap-2 text-[#1e7864] hover:text-[#008d6e] mb-6 sm:mb-8 w-fit text-sm sm:text-base">
          <ArrowLeft className="w-3 sm:w-4 h-3 sm:h-4" />
          <span>Back to Products</span>
        </Link>

        {/* Product Details */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 md:gap-10 lg:gap-12">
          {/* Product Image */}
          <div className="flex items-center justify-center">
            <div className="relative w-full aspect-square bg-[#f0faf7] rounded-lg overflow-hidden">
              <Image
                src={product.image}
                alt={product.name}
                fill
                className="object-cover"
                priority
              />
            </div>
          </div>

          {/* Product Info */}
          <div className="flex flex-col justify-center space-y-4 sm:space-y-5 md:space-y-6 lg:space-y-8">
            {/* Category Badge */}
            <div className="flex items-center gap-2 flex-wrap">
              <Badge className="bg-[#e7f7f3] text-[#008d6e] border border-[#c9eee6] text-xs sm:text-sm">
                {product.category}
              </Badge>
              {product.stock === 0 && (
                <Badge className="bg-red-100 text-red-700 border border-red-300 text-xs sm:text-sm">
                  Out of Stock
                </Badge>
              )}
            </div>

            {/* Title */}
            <div className="space-y-2 sm:space-y-3">
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-[#0b3b32] leading-tight">
                {product.name}
              </h1>
              <p className="text-sm sm:text-base md:text-lg text-[#2f5f56] leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Price and Stock */}
            <div className="space-y-2 sm:space-y-3 md:space-y-4 border-b border-t border-[#e2f3ef] py-3 sm:py-4 md:py-5 lg:py-6">
              <div className="flex items-baseline gap-2 sm:gap-3">
                <span className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-[#1e7864]">
                  {getCurrencySymbol(product.currency)}{product.price.toFixed(2)}
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs sm:text-sm md:text-base">
                <span className={product.stock > 0 ? 'text-[#008d6e]' : 'text-red-600'}>
                  {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                </span>
              </div>
            </div>

            {/* Quantity Selector and Add to Cart */}
            <div className="space-y-3 sm:space-y-4">
              <div className="flex items-center gap-3 sm:gap-4 md:gap-6 flex-wrap">
                <span className="text-xs sm:text-sm md:text-base font-medium text-[#0b3b32] whitespace-nowrap">Quantity:</span>
                <div className="flex items-center border border-[#e2f3ef] rounded-lg">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={product.stock === 0 || isLoading}
                    className="px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 md:py-3 text-[#1e7864] hover:bg-[#f0faf7] disabled:opacity-50 text-sm sm:text-base"
                  >
                    −
                  </button>
                  <span className="px-3 sm:px-4 md:px-6 py-1.5 sm:py-2 md:py-3 font-semibold text-[#0b3b32] text-sm sm:text-base">{quantity}</span>
                  <button
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    disabled={product.stock === 0 || isLoading}
                    className="px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 md:py-3 text-[#1e7864] hover:bg-[#f0faf7] disabled:opacity-50 text-sm sm:text-base"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <Button
                  onClick={handleAddToCart}
                  disabled={product.stock === 0 || isLoading}
                  className={`w-full py-2.5 sm:py-3 md:py-4 text-sm sm:text-base md:text-lg font-semibold rounded-lg transition-all ${
                    isAdded
                      ? 'bg-[#1e7864] text-white'
                      : product.stock === 0
                        ? 'bg-[#e2f3ef] text-[#7aa59b] cursor-not-allowed'
                        : 'bg-[#1e7864] text-white hover:bg-[#008d6e]'
                  }`}
                >
                  {isLoading ? `Adding ${quantity} to Cart...` : isAdded ? '✓ Added to Cart' : product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                </Button>
                {isLoading && (
                  <Progress value={progress} max={100} />
                )}
              </div>
            </div>

            {/* Features */}
            <div className="space-y-2 sm:space-y-3 md:space-y-4 bg-[#f0faf7] p-3 sm:p-4 md:p-6 rounded-lg">
              <div className="flex items-start gap-2 sm:gap-3 md:gap-4">
                <Truck className="w-4 sm:w-5 md:w-6 h-4 sm:h-5 md:h-6 text-[#1e7864] shrink-0 mt-0.5" />
                <div className="min-w-0">
                  <h3 className="font-semibold text-[#0b3b32] text-xs sm:text-sm md:text-base">Free Shipping</h3>
                  <p className="text-xs text-[#2f5f56]">On orders over 50</p>
                </div>
              </div>
              <div className="flex items-start gap-2 sm:gap-3 md:gap-4">
                <RotateCcw className="w-4 sm:w-5 md:w-6 h-4 sm:h-5 md:h-6 text-[#1e7864] shrink-0 mt-0.5" />
                <div className="min-w-0">
                  <h3 className="font-semibold text-[#0b3b32] text-xs sm:text-sm md:text-base">Easy Returns</h3>
                  <p className="text-xs text-[#2f5f56]">30-day return policy</p>
                </div>
              </div>
              <div className="flex items-start gap-2 sm:gap-3 md:gap-4">
                <Shield className="w-4 sm:w-5 md:w-6 h-4 sm:h-5 md:h-6 text-[#1e7864] shrink-0 mt-0.5" />
                <div className="min-w-0">
                  <h3 className="font-semibold text-[#0b3b32] text-xs sm:text-sm md:text-base">Secure Checkout</h3>
                  <p className="text-xs text-[#2f5f56]">Your information is safe</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Related Products Section */}
        <div className="mt-12 sm:mt-16 md:mt-20 lg:mt-24 border-t border-[#e2f3ef] pt-8 sm:pt-12 md:pt-16">
          <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-[#0b3b32] mb-6 sm:mb-8 md:mb-10">
            Continue Shopping
          </h2>
          <Button asChild className="bg-[#1e7864] text-white hover:bg-[#008d6e] text-sm sm:text-base">
            <Link href="/products">View All Products</Link>
          </Button>
        </div>
      </div>
    </main>
  );
}
