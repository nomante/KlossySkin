import { NextResponse } from "next/server";
import { getDataSource } from "@/lib/data-source";
import { CategoryEntity } from "@/lib/entities/Category";

export async function GET() {
  try {
    const dataSource = await getDataSource();
    const repo = dataSource.getRepository(CategoryEntity);
    const count = await repo.count();
    if (count === 0) {
      const defaults = [
        "Cleansers",
        "Toners",
        "Serums",
        "Moisturizers",
        "Sunscreen",
        "Exfoliants",
        "Masks",
        "Eye Care",
        "Body Care",
        "Tools",
      ];
      await repo.save(defaults.map((name) => repo.create({ name })));
    }
    const categories = await repo.find({ order: { name: "ASC" } });
    return NextResponse.json(categories);
  } catch (error) {
    console.error("GET /api/categories failed:", error);
    return NextResponse.json(
      { error: "Failed to fetch categories", details: String(error) },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (!body?.name) {
      return NextResponse.json({ error: "Category name is required" }, { status: 400 });
    }

    const dataSource = await getDataSource();
    const repo = dataSource.getRepository(CategoryEntity);
    const existing = await repo.findOne({ where: { name: body.name } });
    if (existing) {
      return NextResponse.json({ error: "Category already exists" }, { status: 400 });
    }
    const created = repo.create({ name: body.name });
    const saved = await repo.save(created);
    return NextResponse.json({ name: saved.name }, { status: 201 });
  } catch (error) {
    console.error("POST /api/categories failed:", error);
    return NextResponse.json(
      { error: "Failed to create category", details: String(error) },
      { status: 500 }
    );
  }
}