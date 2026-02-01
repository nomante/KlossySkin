'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Facebook, Instagram, Mail } from 'lucide-react';

export function FooterWrapper() {
  const pathname = usePathname();
  const isAdminRoute = pathname?.startsWith('/admin');

  if (isAdminRoute) {
    return null;
  }

  return (
    <footer className="bg-[#0b3b32] text-white mt-16 sm:mt-20 md:mt-24">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-12 sm:py-16 md:py-20 lg:py-24">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 sm:gap-8 md:gap-10 mb-8 sm:mb-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <h3 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4 text-white">KlossySkin</h3>
            <p className="text-[#a8d4cc] text-xs sm:text-sm mb-4">
              Premium skincare for your daily ritual. Clean, cruelty-free, and results-driven.
            </p>
            <div className="flex gap-4">
              <a href="#" className="hover:text-white transition-colors">
                <Facebook className="w-4 h-4 sm:w-5 sm:h-5" />
              </a>
              <a href="#" className="hover:text-white transition-colors">
                <Instagram className="w-4 h-4 sm:w-5 sm:h-5" />
              </a>
              <a href="#" className="hover:text-white transition-colors">
                <Mail className="w-4 h-4 sm:w-5 sm:h-5" />
              </a>
            </div>
          </div>

          {/* Shop */}
          <div>
            <h4 className="font-bold text-base sm:text-lg mb-3 sm:mb-4">Shop</h4>
            <ul className="space-y-2 sm:space-y-3 text-[#a8d4cc] text-xs sm:text-sm">
              <li>
                <Link href="/products" className="hover:text-white transition-colors">
                  All Products
                </Link>
              </li>
              <li>
                <Link href="/products" className="hover:text-white transition-colors">
                  Skincare
                </Link>
              </li>
              <li>
                <Link href="/products" className="hover:text-white transition-colors">
                  Best Sellers
                </Link>
              </li>
              <li>
                <Link href="/products" className="hover:text-white transition-colors">
                  New Arrivals
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h4 className="font-bold text-base sm:text-lg mb-3 sm:mb-4">Support</h4>
            <ul className="space-y-2 sm:space-y-3 text-[#a8d4cc] text-xs sm:text-sm">
              <li>
                <Link href="/contact-us" className="hover:text-white transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-white transition-colors">
                  FAQ
                </Link>
              </li>
              <li>
                <a href="mailto:support@klossyskin.com" className="hover:text-white transition-colors">
                  Email Support
                </a>
              </li>
              <li>
                <a href="tel:+1-800-5552779" className="hover:text-white transition-colors">
                  Call Us
                </a>
              </li>
            </ul>
          </div>

          {/* Information */}
          <div>
            <h4 className="font-bold text-base sm:text-lg mb-3 sm:mb-4">Information</h4>
            <ul className="space-y-2 sm:space-y-3 text-[#a8d4cc] text-xs sm:text-sm">
              <li>
                <Link href="/privacy-policy" className="hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms-of-service" className="hover:text-white transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Return Policy
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Shipping Info
                </a>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="font-bold text-lg mb-4">Newsletter</h4>
            <p className="text-[#a8d4cc] text-sm mb-4">
              Subscribe for skincare tips and exclusive offers.
            </p>
            <div className="flex gap-2 flex-col">
              <input
                type="email"
                placeholder="Your email"
                className="flex-1 px-3 py-2 rounded-lg bg-white/10 text-white placeholder-[#7aa59b] border border-white/20 focus:outline-none focus:border-white/40"
              />
              <button className="px-4 py-2 bg-[#008d6e] hover:bg-[#1e7864] rounded-lg font-semibold transition-colors">
                Join
              </button>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-white/10 my-6 sm:my-8"></div>

        {/* Trust Badges */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <div className="text-center">
            <p className="text-[#a8d4cc] text-xs sm:text-sm">✓ 100% Cruelty-Free</p>
          </div>
          <div className="text-center">
            <p className="text-[#a8d4cc] text-xs sm:text-sm">✓ Free Shipping Over 50</p>
          </div>
          <div className="text-center">
            <p className="text-[#a8d4cc] text-xs sm:text-sm">✓ 30-Day Returns</p>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="border-t border-white/10 pt-6 sm:pt-8">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-3 sm:gap-4 text-[#a8d4cc] text-xs sm:text-sm">
            <p>&copy; 2026 KlossySkin. All rights reserved.</p>
            <div className="flex gap-4 sm:gap-6">
              <a href="/privacy-policy" className="hover:text-white transition-colors">
                Privacy
              </a>
              <a href="/terms-of-service" className="hover:text-white transition-colors">
                Terms
              </a>
              <a href="/contact-us" className="hover:text-white transition-colors">
                Contact
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
