'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/components/CartContext';
import { useSession, signIn, signOut } from 'next-auth/react';
import { ShoppingBag, LogIn, LogOut, Menu, X } from 'lucide-react';
import { useState } from 'react';

export function Header() {
  const { items } = useCart();
  const cartCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const { data: session } = useSession();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="bg-white/95 backdrop-blur-md border-b border-[#e2f3ef] sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Header */}
        <div className="py-3 sm:py-4 flex justify-between items-center gap-8">
          {/* Logo - Left */}
          <Link href="/" className="flex items-center gap-2 shrink-0 group">
            <div className="relative h-10 w-10 sm:h-12 sm:w-12 flex items-center justify-center overflow-hidden rounded-lg group-hover:opacity-80 transition-opacity duration-300">
              <Image
                src="/logo.png"
                alt="KlossySkin Logo"
                width={48}
                height={48}
                className="h-full w-full object-contain"
              />
            </div>
            <span className="text-xl sm:text-2xl font-bold text-[#0b3b32]" style={{ fontFamily: 'var(--font-bodoni)' }}>
              Klossy Skin Care
            </span>
          </Link>

          {/* Desktop Navigation - Center */}
          <nav className="hidden lg:flex gap-8 items-center flex-1 justify-center" style={{ fontFamily: 'var(--font-outfit)' }}>
            <Link 
              href="/products" 
              className="text-sm font-medium text-[#2f5f56] hover:text-[#1e7864] transition-colors duration-200 pb-1 border-b-2 border-transparent hover:border-[#1e7864]"
            >
              Shop
            </Link>
            {/* Admin link will be added by session check below */}
            <Link 
              href="/contact-us" 
              className="text-sm font-medium text-[#2f5f56] hover:text-[#1e7864] transition-colors duration-200 pb-1 border-b-2 border-transparent hover:border-[#1e7864]"
            >
              Contact
            </Link>
          </nav>

          {/* Right Actions - Right */}
          <div className="flex gap-2 sm:gap-3 items-center ml-auto" style={{ fontFamily: 'var(--font-outfit)' }}>
            {/* Cart Icon */}
            <Link 
              href="/cart" 
              className="relative p-2 text-[#2f5f56] hover:text-[#1e7864] transition-colors duration-200"
              title="Shopping Cart"
            >
              <ShoppingBag className="w-5 h-5 sm:w-6 sm:h-6" />
              {cartCount > 0 && (
                <span className="absolute top-0 right-0 inline-flex items-center justify-center w-4 h-4 text-xs font-bold text-white bg-[#1e7864] rounded-full">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* Auth Button */}
            {session?.user ? (
              <button
                onClick={() => signOut()}
                className="hidden sm:inline-flex px-4 py-2 text-sm font-medium text-white bg-[#1e7864] hover:bg-[#008d6e] rounded-lg transition-colors duration-200 items-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            ) : (
              <button
                onClick={() => signIn()}
                className="hidden sm:inline-flex px-4 py-2 text-sm font-medium text-white bg-[#1e7864] hover:bg-[#008d6e] rounded-lg transition-colors duration-200 items-center gap-2"
              >
                <LogIn className="w-4 h-4" />
                Login
              </button>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-[#2f5f56] hover:text-[#1e7864] transition-colors"
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <nav className="lg:hidden pb-4 border-t border-[#e2f3ef] pt-3" style={{ fontFamily: 'var(--font-outfit)' }}>
            <div className="flex flex-col gap-1">
              <Link 
                href="/products"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2.5 text-sm font-medium text-[#2f5f56] hover:text-[#1e7864] hover:bg-[#f0faf7] rounded transition-colors"
              >
                Shop
              </Link>
              {session?.user && (session.user as { role?: string }).role === "admin" && (
                <Link 
                  href="/admin"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2.5 text-sm font-medium text-[#2f5f56] hover:text-[#1e7864] hover:bg-[#f0faf7] rounded transition-colors"
                >
                  Admin
                </Link>
              )}
              <Link 
                href="/contact-us"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2.5 text-sm font-medium text-[#2f5f56] hover:text-[#1e7864] hover:bg-[#f0faf7] rounded transition-colors"
              >
                Contact
              </Link>
              {session?.user ? (
                <button
                  onClick={() => {
                    signOut();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full mt-3 px-4 py-2.5 text-sm font-medium text-white bg-[#1e7864] hover:bg-[#008d6e] rounded transition-colors flex items-center gap-2 justify-center"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              ) : (
                <button
                  onClick={() => {
                    signIn();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full mt-3 px-4 py-2.5 text-sm font-medium text-white bg-[#1e7864] hover:bg-[#008d6e] rounded transition-colors flex items-center gap-2 justify-center"
                >
                  <LogIn className="w-4 h-4" />
                  Login
                </button>
              )}
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}
