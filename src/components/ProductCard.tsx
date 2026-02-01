'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Product } from '@/types';
import { useCart } from '@/components/CartContext';
import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { getCurrencySymbol } from '@/lib/currency';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart();
  const [isAdded, setIsAdded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);

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
        quantity: 1,
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
    <Link href={`/products/${product.id}`}>
      <Card className="overflow-hidden border-[#d9f0ea] shadow-md hover:shadow-2xl hover:border-[#1e7864] transition-all duration-300 flex flex-col h-full group bg-white cursor-pointer">
        {/* Image Container */}
        <div className="relative h-44 sm:h-52 md:h-60 lg:h-64 w-full bg-linear-to-br from-[#f0faf7] to-[#e7f7f3] overflow-hidden">
          {/* Gradient overlay on hover */}
          <div className="absolute inset-0 bg-linear-to-t from-[#1e7864]/0 via-transparent to-[#1e7864]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"></div>
          
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-500"
            onError={(e) => {
              const img = e.target as HTMLImageElement;
              img.src = '/images/placeholder.jpg';
            }}
          />
          
          {/* Stock badge overlay */}
          {product.stock === 0 && (
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center z-20">
              <span className="text-white font-bold text-lg">Out of Stock</span>
            </div>
          )}
        </div>

        <CardContent className="p-3 sm:p-4 md:p-5 space-y-2 sm:space-y-3 flex flex-col flex-1">
          {/* Category Badge */}
          <div className="flex items-center gap-2">
            <Badge className="bg-linear-to-r from-[#e7f7f3] to-[#d9f0ea] text-[#008d6e] border border-[#c9eee6] text-xs sm:text-sm font-semibold">
              {product.category}
            </Badge>
            {product.stock > 0 && product.stock < 5 && (
              <Badge className="bg-amber-100 text-amber-800 border border-amber-300 text-xs font-semibold">
                Only {product.stock} left!
              </Badge>
            )}
          </div>

          {/* Product name */}
          <h3 className="text-base sm:text-lg font-bold text-[#0b3b32] line-clamp-2 group-hover:text-[#1e7864] transition-colors">
            {product.name}
          </h3>

          <p className="text-[#2f5f56] text-xs sm:text-sm line-clamp-2 flex-1 leading-relaxed">{product.description}</p>

          {/* Price and Stock */}
          <div className="flex justify-between items-end pt-2 border-t border-[#e2f3ef]">
            <div>
              <p className="text-[#2f5f56] text-xs uppercase tracking-wider font-semibold">Price</p>
              <span className="text-lg sm:text-xl md:text-2xl font-bold bg-linear-to-r from-[#1e7864] to-[#008d6e] bg-clip-text text-transparent">
                {getCurrencySymbol(product.currency)}{product.price.toFixed(2)}
              </span>
            </div>
            <div className="text-right">
              <p className="text-[#2f5f56] text-xs uppercase tracking-wider font-semibold">Stock</p>
              <p className={`text-lg font-bold ${product.stock > 10 ? 'text-[#008d6e]' : product.stock > 0 ? 'text-amber-600' : 'text-red-600'}`}>
                {product.stock}
              </p>
            </div>
          </div>

          {/* Add to Cart Button */}
          <div onClick={(e) => e.preventDefault()}>
            <Button
              onClick={handleAddToCart}
              disabled={product.stock === 0 || isLoading}
              className={`w-full text-sm sm:text-base font-semibold mt-3 transition-all duration-300 ${
                isAdded
                  ? 'bg-[#1e7864] text-white shadow-lg'
                  : product.stock === 0
                    ? 'bg-[#e2f3ef] text-[#7aa59b] cursor-not-allowed opacity-60'
                    : 'bg-linear-to-r from-[#1e7864] to-[#008d6e] text-white hover:shadow-lg hover:to-[#1e7864] group-hover:scale-105'
              }`}
            >
              {isLoading ? 'Adding to Cart...' : isAdded ? '✓ Added' : product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
            </Button>
            {isLoading && (
              <div className="mt-2">
                <Progress value={progress} max={100} />
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
