import { getAllProducts } from '@/lib/db';
import { ProductsClient } from '@/components/ProductsClient';

export const dynamic = 'force-dynamic';

export default async function ProductsPage() {
  const products = await getAllProducts();

  return (
    <main className="min-h-screen bg-linear-to-br from-[#f9fffe] via-white to-[#e7f7f3]">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-linear-to-br from-[#e7f7f3]/30 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-linear-to-tr from-[#d9f0ea]/20 to-transparent rounded-full blur-3xl"></div>
      </div>

      <div className="w-full">
        {/* Hero Section */}
        <div className="relative group overflow-hidden min-h-96 sm:min-h-125 md:min-h-150 lg:min-h-175" style={{backgroundImage: 'url(/hero-bg.jpg)', backgroundSize: 'cover', backgroundPosition: 'center'}}>
            {/* Gradient overlay that fades */}
            <div className="absolute inset-0 bg-linear-to-r from-[rgba(9,59,50,0.8)] via-[rgba(9,59,50,0.6)] to-[rgba(9,59,50,0.3)]"></div>
            
            {/* Content */}
            <div className="relative z-10 h-full flex items-center">
              <div className="max-w-4xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 w-full py-8 sm:py-12 md:py-20">
                <div className="flex items-center gap-2 mb-3 sm:mb-4 flex-wrap">
                  <span className="text-xs sm:text-sm uppercase tracking-[0.3em] text-white font-bold bg-white/20 backdrop-blur-sm px-3 sm:px-4 py-1.5 sm:py-2 rounded-full inline-block">✨ Shop Our Collection</span>
                  <span className="hidden sm:inline text-2xl text-white">→</span>
                </div>
                
                <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mt-3 sm:mt-4 mb-4 sm:mb-5 md:mb-6 leading-tight tracking-tight">
                  Discover your next ritual
                </h1>
                
                <p className="text-sm sm:text-base md:text-lg text-white/90 max-w-2xl leading-relaxed mb-6 sm:mb-8">
                  Explore our thoughtfully curated collection of premium skincare essentials, expertly crafted to transform your daily routine into a luxurious glow-forward ritual.
                </p>

                {/* Feature highlights */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-6 sm:mb-8">
                  <div className="flex items-center gap-2 text-sm sm:text-base text-white/95">
                    <span className="text-lg sm:text-xl">🌿</span>
                    <span className="font-medium">Clean & Natural</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm sm:text-base text-white/95">
                    <span className="text-lg sm:text-xl">✓</span>
                    <span className="font-medium">Dermatologist Tested</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm sm:text-base text-white/95">
                    <span className="text-lg sm:text-xl">💚</span>
                    <span className="font-medium">100% Cruelty-Free</span>
                  </div>
                </div>

                {/* CTA message */}
                <div className="inline-flex items-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 bg-white/20 backdrop-blur-sm border border-white/30 rounded-full text-xs sm:text-sm font-semibold text-white">
                  <span>👇 Browse {products.length} premium products below</span>
                </div>
              </div>
            </div>
        </div>

        <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-8 sm:py-12 md:py-16">
          <ProductsClient products={products} />
        </div>
      </div>
    </main>
  );
}
