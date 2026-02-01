'use client';

import { useMemo, useState } from 'react';
import { Product } from '@/types';
import { ProductCard } from '@/components/ProductCard';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface ProductsClientProps {
  products: Product[];
}

export function ProductsClient({ products }: ProductsClientProps) {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('all');
  const [sort, setSort] = useState('featured');

  const categories = useMemo(() => {
    const unique = new Set(products.map((product) => product.category).filter(Boolean));
    return ['all', ...Array.from(unique)];
  }, [products]);

  const filteredProducts = useMemo(() => {
    const q = query.trim().toLowerCase();

    let filtered = products.filter((product) => {
      const matchesQuery =
        !q ||
        product.name.toLowerCase().includes(q) ||
        product.description.toLowerCase().includes(q) ||
        product.category.toLowerCase().includes(q);

      const matchesCategory = category === 'all' || product.category === category;

      return matchesQuery && matchesCategory;
    });

    if (sort === 'price-low') {
      filtered = filtered.sort((a, b) => a.price - b.price);
    }

    if (sort === 'price-high') {
      filtered = filtered.sort((a, b) => b.price - a.price);
    }

    if (sort === 'name') {
      filtered = filtered.sort((a, b) => a.name.localeCompare(b.name));
    }

    return filtered;
  }, [products, query, category, sort]);

  const clearFilters = () => {
    setQuery('');
    setCategory('all');
    setSort('featured');
  };

  return (
    <div>
      {/* Enhanced Filter Section */}
      <div className="mb-10 sm:mb-12 md:mb-16 rounded-2xl sm:rounded-3xl border border-[#d9f0ea] bg-linear-to-br from-white/95 via-[#f9fffe] to-white backdrop-blur-sm p-5 sm:p-6 md:p-8 shadow-lg hover:shadow-xl transition-all duration-300">
        <div className="space-y-4 sm:space-y-5">
          <div>
            <p className="text-xs sm:text-sm font-semibold text-[#1e7864] uppercase tracking-wider mb-3">🔍 Find Your Perfect Match</p>
            <Input
              placeholder="Search products, categories, ingredients..."
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              className="border-[#d9f0ea] focus-visible:ring-[#1e7864] text-sm h-11 sm:h-12 bg-white/50 hover:bg-white transition-colors"
            />
          </div>
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full">
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="w-full sm:w-40 md:w-45 border-[#d9f0ea] focus:ring-[#1e7864] text-sm h-10 sm:h-11">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat === 'all' ? 'All Categories' : cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={sort} onValueChange={setSort}>
              <SelectTrigger className="w-full sm:w-40 md:w-45 border-[#d9f0ea] focus:ring-[#1e7864] text-sm h-10 sm:h-11">
                <SelectValue placeholder="Sort" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="featured">Featured</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
                <SelectItem value="name">Name: A-Z</SelectItem>
              </SelectContent>
            </Select>

            <Button
              variant="outline"
              onClick={clearFilters}
              className="border-[#d9f0ea] text-[#1e7864] hover:bg-[#e7f7f3] text-sm h-10 sm:h-11 w-full sm:w-auto"
            >
              Clear
            </Button>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-2">
          <Badge className="bg-[#e7f7f3] text-[#008d6e] border border-[#c9eee6]">
            {filteredProducts.length} Results
          </Badge>
          {query && (
            <Badge className="bg-white text-[#2f5f56] border border-[#d9f0ea]">
              Search: “{query}”
            </Badge>
          )}
          {category !== 'all' && (
            <Badge className="bg-white text-[#2f5f56] border border-[#d9f0ea]">
              Category: {category}
            </Badge>
          )}
          {sort !== 'featured' && (
            <Badge className="bg-white text-[#2f5f56] border border-[#d9f0ea]">
              Sort: {sort.replace('-', ' ')}
            </Badge>
          )}
        </div>
      </div>

      {filteredProducts.length === 0 ? (
        <div className="rounded-3xl border-2 border-dashed border-[#d9f0ea] bg-linear-to-br from-white to-[#f9fffe] p-8 sm:p-12 md:p-16 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-[#e7f7f3] rounded-full mb-4">
            <span className="text-3xl sm:text-4xl">🔍</span>
          </div>
          <p className="text-[#2f5f56] text-base sm:text-lg font-semibold mb-2">No products found</p>
          <p className="text-[#999] text-sm sm:text-base mb-6">Try adjusting your filters or search terms</p>
          <Button
            onClick={clearFilters}
            className="bg-linear-to-r from-[#1e7864] to-[#008d6e] text-white hover:shadow-lg transition-all font-semibold"
          >
            ↺ Reset All Filters
          </Button>
        </div>
      ) : (
        <div className="space-y-8 sm:space-y-10">
          {/* Grid header with count */}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm uppercase tracking-wider text-[#1e7864] font-bold">Showing Products</p>
              <p className="text-2xl sm:text-3xl font-bold text-[#0b3b32] mt-1">{filteredProducts.length} item{filteredProducts.length !== 1 ? 's' : ''}</p>
            </div>
            <div className="hidden md:flex items-center gap-2 text-[#2f5f56] text-sm">
              <div className="w-8 h-8 rounded-full bg-[#e7f7f3] flex items-center justify-center font-bold">✓</div>
              <span>All verified</span>
            </div>
          </div>

          {/* Product Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5 md:gap-6 lg:gap-7">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
