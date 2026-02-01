import { NextResponse } from "next/server";
import { getDataSource } from "@/lib/data-source";
import { CategoryEntity } from "@/lib/entities/Category";
import { ProductEntity } from "@/lib/entities/Product";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    if (!body?.name) {
      return NextResponse.json({ error: "Category name is required" }, { status: 400 });
    }

    const dataSource = await getDataSource();
    const repo = dataSource.getRepository(CategoryEntity);
    const existing = await repo.findOne({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "Category not found" }, { status: 404 });
    }

    existing.name = body.name;
    const saved = await repo.save(existing);
    return NextResponse.json(saved);
  } catch (error) {
    console.error("PUT /api/categories/[id] failed:", error);
    return NextResponse.json(
      { error: "Failed to update category", details: String(error) },
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
    const repo = dataSource.getRepository(CategoryEntity);
    const productRepo = dataSource.getRepository(ProductEntity);
    const category = await repo.findOne({ where: { id } });
    if (!category) {
      return NextResponse.json({ error: "Category not found" }, { status: 404 });
    }
    const inUse = await productRepo.count({ where: { category: category.name } });
    if (inUse > 0) {
      return NextResponse.json(
        { error: "Category is in use by products" },
        { status: 409 }
      );
    }
    const result = await repo.delete({ id });
    if (!result.affected) {
      return NextResponse.json({ error: "Category not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE /api/categories/[id] failed:", error);
    return NextResponse.json(
      { error: "Failed to delete category", details: String(error) },
      { status: 500 }
    );
  }
}