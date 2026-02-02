import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ShieldCheck, Truck, Sparkles } from "lucide-react";
import { ProductCard } from "@/components/ProductCard";
import { Product } from "@/types";

// Mark this route as dynamic since it fetches fresh data on each request
export const dynamic = 'force-dynamic';

interface Hero {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  cta_text: string;
  cta_link: string;
  badge_text: string;
  image_url: string | null;
  active: boolean;
}

async function getHero(): Promise<Hero | null> {
  try {
    const apiUrl = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/hero`;
    console.log('Fetching hero from:', apiUrl);
    const response = await fetch(apiUrl, {
      cache: 'no-store'
    });
    if (!response.ok) {
      console.error('Hero fetch failed with status:', response.status);
      return null;
    }
    const heroes = await response.json();
    console.log('Heroes fetched:', heroes);
    const activeHero = Array.isArray(heroes) ? heroes.find((h: Hero) => h.active) : null;
    return activeHero || null;
  } catch (error) {
    console.error('Failed to fetch hero:', error);
    return null;
  }
}

async function getFeaturedProducts(): Promise<Product[]> {
  try {
    const apiUrl = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/products?limit=4`;
    console.log('Fetching products from:', apiUrl);
    const response = await fetch(apiUrl, {
      cache: 'no-store'
    });
    if (!response.ok) {
      console.error('Products fetch failed with status:', response.status);
      return [];
    }
    const products = await response.json();
    console.log('Products fetched:', products);
    return Array.isArray(products) ? products.slice(0, 4) : [];
  } catch (error) {
    console.error('Failed to fetch products:', error);
    return [];
  }
}

export default async function Home() {
  const hero = await getHero();
  const featuredProducts = await getFeaturedProducts();
  
  // Use default values if fields are null
  const displayHero = hero ? {
    ...hero,
    cta_text: hero.cta_text || 'Shop Now',
    cta_link: hero.cta_link || '/products',
    badge_text: hero.badge_text || 'Klassy Skincare',
    description: hero.description || 'Thoughtfully curated skincare essentials made to elevate your daily ritual.',
  } : null;

  return (
    <main className="flex flex-col items-center justify-start min-h-screen">
      {/* Dynamic Hero Section */}
      {displayHero ? (
        <section className="w-full relative overflow-hidden py-12 sm:py-16 md:py-20 lg:py-24 px-3 sm:px-4 md:px-6 lg:px-8">
          {/* Background image with overlay */}
          {displayHero.image_url && (
            <>
              <Image
                src={displayHero.image_url}
                alt="Hero background"
                fill
                className="absolute inset-0 object-cover"
                priority
              />
              {/* Deep left fade to light right for dramatic effect */}
              <div className="absolute inset-0 bg-linear-to-r from-[#1e7864]/85 via-[#1e7864]/50 to-transparent"></div>
              <div className="absolute inset-0 bg-linear-to-b from-[#1e7864]/30 via-transparent to-[#0d5a47]/40"></div>
            </>
          )}

          {!displayHero.image_url && (
            <>
              <div className="absolute inset-0 bg-linear-to-br from-[#1e7864] via-[#0d5a47] to-[#008d6e]"></div>
              <div className="absolute inset-0 opacity-20">
                <div className="absolute top-0 right-0 w-64 sm:w-80 md:w-96 h-64 sm:h-80 md:h-96 bg-white rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 left-0 w-64 sm:w-80 md:w-96 h-64 sm:h-80 md:h-96 bg-white rounded-full blur-3xl"></div>
              </div>
            </>
          )}

          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 md:gap-16 items-center relative z-10">
            <div className="space-y-6 sm:space-y-8 text-white">
              {displayHero.badge_text && (
                <div className="inline-block">
                  <Badge className="bg-white/20 text-white border border-white/50 px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium backdrop-blur-sm hover:bg-white/30 transition-all">
                    ✨ {displayHero.badge_text}
                  </Badge>
                </div>
              )}
              
              <div className="space-y-3 sm:space-y-4">
                <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight tracking-tight drop-shadow-lg">
                  {displayHero.title}
                </h1>
                {displayHero.subtitle && (
                  <p className="text-base sm:text-lg md:text-xl lg:text-2xl font-medium drop-shadow-md">
                    {displayHero.subtitle}
                  </p>
                )}
              </div>

              {displayHero.description && (
                <p className="text-sm sm:text-base md:text-lg leading-relaxed max-w-md drop-shadow-md">
                  {displayHero.description}
                </p>
              )}

              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4">
                <Button asChild className="bg-white text-[#1e7864] hover:bg-white/90 shadow-lg hover:shadow-xl transition-all h-11 sm:h-12 px-6 sm:px-8 text-sm sm:text-base font-semibold rounded-lg w-full sm:w-auto">
                  <Link href={displayHero.cta_link}>{displayHero.cta_text}</Link>
                </Button>
                <Button
                  asChild
                  className="bg-white/15 border border-white/40 text-white hover:bg-white/25 backdrop-blur-sm h-11 sm:h-12 px-6 sm:px-8 text-sm sm:text-base font-semibold rounded-lg transition-all w-full sm:w-auto"
                >
                  <Link href="/products">View Collection</Link>
                </Button>
              </div>
            </div>

            {displayHero.image_url && (
              <div className="flex items-center justify-center lg:justify-end lg:flex">
                <style>{`
                  @keyframes float {
                    0%, 100% { transform: translateY(0px) rotate(0deg); }
                    50% { transform: translateY(-25px) rotate(2deg); }
                  }
                  @keyframes glow-pulse {
                    0%, 100% { 
                      box-shadow: 0 0 30px rgba(255, 255, 255, 0.3), 0 0 60px rgba(255, 255, 255, 0.1); 
                    }
                    50% { 
                      box-shadow: 0 0 50px rgba(255, 255, 255, 0.5), 0 0 80px rgba(255, 255, 255, 0.2); 
                    }
                  }
                  @keyframes rotate-subtle {
                    0%, 100% { transform: rotate(0deg); }
                    50% { transform: rotate(1deg); }
                  }
                  .hero-image-circle {
                    animation: float 4s ease-in-out infinite, glow-pulse 3s ease-in-out infinite;
                  }
                  .hero-ring {
                    animation: rotate-subtle 20s linear infinite;
                  }
                `}</style>
                <div className="relative w-80 h-80 lg:w-96 lg:h-96">
                  {/* Outer decorative ring */}
                  <div className="hero-ring absolute inset-0 rounded-full border-2 border-white/30 blur-sm"></div>
                  
                  {/* Main circular image */}
                  <div className="hero-image-circle absolute inset-0 rounded-full overflow-hidden border-4 border-white/40 shadow-2xl">
                    <Image
                      src={displayHero.image_url}
                      alt={displayHero.title}
                      fill
                      className="object-cover"
                      priority
                    />
                  </div>

                  {/* Inner glow effect */}
                  <div className="absolute inset-0 rounded-full bg-linear-to-br from-white/15 to-transparent pointer-events-none"></div>
                </div>
              </div>
            )}
          </div>
        </section>
      ) : (
        <section className="w-full bg-linear-to-br from-[#1e7864] via-[#008d6e] to-[#1e7864] text-white py-20 px-4">
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div className="space-y-6">
              <Badge className="bg-white/15 text-white border border-white/30">
                Clean, modern skincare
              </Badge>
              <h1 className="text-5xl md:text-6xl font-semibold leading-tight">
                KlossySkin —
                <span className="block text-[#e8fff8]">Radiance in every routine.</span>
              </h1>
              <p className="text-lg md:text-xl text-[#e8fff8]/90">
                Thoughtfully curated skincare essentials made to elevate your daily ritual.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Button asChild className="bg-white text-[#1e7864] hover:bg-[#f4fbf9]">
                  <Link href="/products">Shop the Collection</Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  className="border-white/70 text-white hover:bg-white/10"
                >
                  <Link href="/products">Explore Bestsellers</Link>
                </Button>
              </div>
              <div className="flex items-center gap-6 text-sm text-[#e8fff8]/80">
                <span>100+ curated products</span>
                <span>Free shipping over 50</span>
                <span>Clean ingredients</span>
              </div>
            </div>
            <Card className="bg-white/90 border-white/40 shadow-xl">
              <CardContent className="p-8">
                <div className="space-y-4">
                  <Badge className="bg-[#e7f7f3] text-[#008d6e] border border-[#c9eee6]">
                    Signature Collection
                  </Badge>
                  <h2 className="text-3xl font-semibold text-[#0b3b32]">Glow Starter Set</h2>
                  <p className="text-[#2f5f56]">
                    A refined trio designed to hydrate, brighten, and restore — perfect for daily use.
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-semibold text-[#0b3b32]">79.00</span>
                    <Button className="bg-[#1e7864] text-white hover:bg-[#008d6e]">
                      Add to Cart
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      )}

      {/* Featured Products Section */}
      {featuredProducts.length > 0 && (
        <section className="w-full py-20 sm:py-28 md:py-32 px-3 sm:px-4 md:px-6 lg:px-8 bg-linear-to-b from-white via-[#f8fffe] to-[#e7f7f3]">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16 sm:mb-20">
              <div className="inline-block mb-4 sm:mb-6">
                <span className="text-xs sm:text-sm font-semibold text-[#008d6e] uppercase tracking-widest bg-[#e7f7f3] px-4 py-2 rounded-full">
                  ✨ Bestsellers
                </span>
              </div>
              <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold text-[#0b3b32] mb-3 sm:mb-4 leading-tight">
                Featured Essentials
              </h2>
              <p className="text-base sm:text-lg md:text-xl text-[#2f5f56] max-w-2xl mx-auto">
                Discover our most-loved skincare products trusted by thousands of customers worldwide
              </p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-14 sm:mb-16">
              {featuredProducts.map((product, idx) => (
                <div key={product.id} className="transform transition-all duration-300 hover:scale-105 hover:-translate-y-2">
                  <div className="absolute inset-0 bg-linear-to-br from-[#008d6e]/10 to-[#1e7864]/10 rounded-xl blur-2xl opacity-0 group-hover:opacity-100 transition-opacity -z-10 group-hover:scale-110"></div>
                  <ProductCard product={product} />
                </div>
              ))}
            </div>

            <div className="flex justify-center">
              <Button asChild className="bg-linear-to-r from-[#1e7864] to-[#008d6e] text-white hover:shadow-2xl hover:shadow-[#008d6e]/30 transition-all duration-300 h-12 sm:h-14 px-10 sm:px-14 text-base sm:text-lg font-semibold rounded-xl">
                <Link href="/products">Browse All Products → </Link>
              </Button>
            </div>
          </div>
        </section>
      )}

      {/* Trust & Quality Section */}
      <section className="w-full py-20 sm:py-28 px-3 sm:px-4 md:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-10">
            {[
              {
                icon: ShieldCheck,
                title: "Premium Quality",
                text: "Carefully sourced formulas with clean, skin-loving ingredients backed by science.",
                color: "from-[#1e7864] to-[#008d6e]"
              },
              {
                icon: Truck,
                title: "Fast & Secure Shipping",
                text: "Swift delivery with premium packaging, eco-friendly materials, and easy tracking.",
                color: "from-[#008d6e] to-[#0d5a47]"
              },
              {
                icon: Sparkles,
                title: "Visible Results",
                text: "Glow-forward routines designed with dermatologists to deliver real improvements.",
                color: "from-[#0d5a47] to-[#1e7864]"
              },
            ].map((feature, idx) => (
              <div key={feature.title} className="group">
                <div className="bg-white rounded-2xl p-8 sm:p-10 border border-[#e2f3ef] hover:border-[#008d6e] transition-all duration-300 h-full relative overflow-hidden">
                  {/* Background accent */}
                  <div className={`absolute -right-20 -top-20 w-40 h-40 bg-linear-to-br ${feature.color} opacity-5 rounded-full group-hover:opacity-10 transition-opacity duration-300`}></div>
                  
                  {/* Icon */}
                  <div className={`inline-flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-2xl bg-linear-to-br ${feature.color} text-white mb-5 group-hover:scale-110 transition-transform duration-300`}>
                    <feature.icon className="h-7 w-7 sm:h-8 sm:w-8" />
                  </div>
                  
                  {/* Content */}
                  <h3 className="text-xl sm:text-2xl font-bold text-[#0b3b32] mb-3">{feature.title}</h3>
                  <p className="text-[#2f5f56] text-base leading-relaxed">{feature.text}</p>
                  
                  {/* Bottom accent line */}
                  <div className={`h-1 w-0 bg-linear-to-r ${feature.color} mt-6 group-hover:w-full transition-all duration-500`}></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Social Proof Section */}
      <section className="w-full py-20 sm:py-28 px-3 sm:px-4 md:px-6 lg:px-8 bg-linear-to-r from-[#e7f7f3] via-white to-[#e7f7f3]">
        <div className="max-w-7xl mx-auto text-center">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 sm:gap-12 mb-16">
            {[
              { number: "50K+", label: "Happy Customers" },
              { number: "4.9★", label: "Average Rating" },
              { number: "100%", label: "Cruelty-Free" }
            ].map((stat) => (
              <div key={stat.label}>
                <div className="text-3xl sm:text-4xl md:text-5xl font-bold bg-linear-to-r from-[#1e7864] to-[#008d6e] bg-clip-text text-transparent mb-2">
                  {stat.number}
                </div>
                <p className="text-[#2f5f56] text-base sm:text-lg">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section - Final Call to Action */}
      <section className="w-full py-20 sm:py-28 px-3 sm:px-4 md:px-6 lg:px-8 bg-linear-to-br from-[#1e7864] via-[#008d6e] to-[#0d5a47] relative overflow-hidden">
        {/* Decorative background elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -mr-48 -mt-48"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-white/5 rounded-full -ml-40 -mb-40"></div>
        
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-4 sm:mb-6 leading-tight">
            Ready to elevate your skincare routine?
          </h2>
          <p className="text-lg sm:text-xl text-white/90 mb-10 sm:mb-12 max-w-2xl mx-auto leading-relaxed">
            Join thousands of customers who've transformed their skin with our thoughtfully curated collection of premium skincare essentials.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center">
            <Button asChild className="bg-white text-[#1e7864] hover:bg-white/95 h-12 sm:h-14 px-8 sm:px-12 text-base sm:text-lg font-semibold rounded-xl transition-all duration-300 shadow-lg hover:shadow-2xl">
              <Link href="/products">Shop Now</Link>
            </Button>
            <Button asChild variant="outline" className="border-white text-white hover:bg-white/10 h-12 sm:h-14 px-8 sm:px-12 text-base sm:text-lg font-semibold rounded-xl transition-all duration-300">
              <Link href="#featured">Explore Collection</Link>
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}
