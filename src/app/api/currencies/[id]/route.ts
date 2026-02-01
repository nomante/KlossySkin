import { NextResponse } from "next/server";
import { getDataSource } from "@/lib/data-source";
import { CurrencyEntity } from "@/lib/entities/Currency";
import { ProductEntity } from "@/lib/entities/Product";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    if (!body?.code) {
      return NextResponse.json({ error: "Currency code is required" }, { status: 400 });
    }

    const dataSource = await getDataSource();
    const repo = dataSource.getRepository(CurrencyEntity);
    const existing = await repo.findOne({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "Currency not found" }, { status: 404 });
    }

    existing.code = String(body.code).toUpperCase();
    existing.symbol = body.symbol ? String(body.symbol) : null;
    const saved = await repo.save(existing);
    return NextResponse.json(saved);
  } catch (error) {
    console.error("PUT /api/currencies/[id] failed:", error);
    return NextResponse.json(
      { error: "Failed to update currency", details: String(error) },
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
    const dataSource = await getDataSource();
    const repo = dataSource.getRepository(CurrencyEntity);
    const productRepo = dataSource.getRepository(ProductEntity);
    const currency = await repo.findOne({ where: { id } });
    if (!currency) {
      return NextResponse.json({ error: "Currency not found" }, { status: 404 });
    }
    const inUse = await productRepo.count({ where: { currency: currency.code } });
    if (inUse > 0) {
      return NextResponse.json(
        { error: "Currency is in use by products" },
        { status: 409 }
      );
    }
    const result = await repo.delete({ id });
    if (!result.affected) {
      return NextResponse.json({ error: "Currency not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE /api/currencies/[id] failed:", error);
    return NextResponse.json(
      { error: "Failed to delete currency", details: String(error) },
      { status: 500 }
    );
  }
}