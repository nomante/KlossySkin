import { NextResponse } from 'next/server';
import { createProduct, getAllProducts } from '@/lib/db';

export async function GET() {
  try {
    const products = await getAllProducts();
    return NextResponse.json(products);
  } catch (error) {
    console.error('GET /api/products failed:', error);
    return NextResponse.json(
      { error: 'Failed to fetch products', details: String(error) },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (!body?.name || !body?.description || !body?.image || !body?.category) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    if (Number.isNaN(Number(body.price)) || Number(body.price) <= 0) {
      return NextResponse.json({ error: 'Invalid price' }, { status: 400 });
    }
    if (Number.isNaN(Number(body.stock)) || Number(body.stock) < 0) {
      return NextResponse.json({ error: 'Invalid stock' }, { status: 400 });
    }
    const product = await createProduct({
      name: body.name,
      description: body.description,
      price: Number(body.price),
      currency: body.currency || 'USD',
      image: body.image,
      category: body.category,
      stock: Number(body.stock),
    });
    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    console.error('POST /api/products failed:', error);
    return NextResponse.json(
      { error: 'Failed to create product', details: String(error) },
      { status: 500 }
    );
  }
}
