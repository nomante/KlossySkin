import Link from 'next/link';
import { Suspense } from 'react';
import { ArrowLeft } from 'lucide-react';
import { getProductById } from '@/lib/db';
import { ProductDetailsClient } from '@/app/products/[id]/client';

interface Props {
  params: Promise<{ id: string }>;
}

export default async function ProductDetailsPage({ params }: Props) {
  const { id } = await params;
  const product = await getProductById(id);

  if (!product) {
    return (
      <main className="min-h-screen bg-linear-to-br from-[#f9fffe] via-white to-[#e7f7f3]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <Link href="/products" className="inline-flex items-center gap-2 text-[#1e7864] hover:text-[#008d6e] mb-8">
            <ArrowLeft className="w-5 h-5" />
            Back to Products
          </Link>
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold text-[#0b3b32] mb-4">Product Not Found</h1>
            <p className="text-[#2f5f56] mb-8">The product you&apos;re looking for doesn&apos;t exist.</p>
            <Link href="/products" className="inline-block px-6 py-2 bg-[#1e7864] text-white rounded-lg hover:bg-[#008d6e]">
              Back to Shop
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <Suspense fallback={<div className="text-center py-12">Loading...</div>}>
      <ProductDetailsClient product={product} />
    </Suspense>
  );
}
