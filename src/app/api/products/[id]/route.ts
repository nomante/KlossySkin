import { NextResponse } from 'next/server';
import { deleteProduct, getProductById, updateProduct } from '@/lib/db';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const product = await getProductById(id);
    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }
    return NextResponse.json(product);
  } catch (error) {
    console.error('GET /api/products/[id] failed:', error);
    return NextResponse.json(
      { error: 'Failed to fetch product', details: String(error) },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    if (body.price !== undefined && (Number.isNaN(Number(body.price)) || Number(body.price) <= 0)) {
      return NextResponse.json({ error: 'Invalid price' }, { status: 400 });
    }
    if (body.stock !== undefined && (Number.isNaN(Number(body.stock)) || Number(body.stock) < 0)) {
      return NextResponse.json({ error: 'Invalid stock' }, { status: 400 });
    }
    const updated = await updateProduct(id, {
      name: body.name,
      description: body.description,
      price: body.price !== undefined ? Number(body.price) : undefined,
      currency: body.currency,
      image: body.image,
      category: body.category,
      stock: body.stock !== undefined ? Number(body.stock) : undefined,
    });

    if (!updated) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json(updated);
  } catch (error) {
    console.error('PUT /api/products/[id] failed:', error);
    return NextResponse.json(
      { error: 'Failed to update product', details: String(error) },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const deleted = await deleteProduct(id);
    if (!deleted) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('DELETE /api/products/[id] failed:', error);
    return NextResponse.json(
      { error: 'Failed to delete product', details: String(error) },
      { status: 500 }
    );
  }
}
