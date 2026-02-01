import { NextResponse } from "next/server";
import { getDataSource } from "@/lib/data-source";
import { CurrencyEntity } from "@/lib/entities/Currency";

export async function GET() {
  try {
    const dataSource = await getDataSource();
    const repo = dataSource.getRepository(CurrencyEntity);
    const count = await repo.count();
    if (count === 0) {
      const defaults = [
        { code: "USD", symbol: "$" },
        { code: "EUR", symbol: "€" },
        { code: "GBP", symbol: "£" },
        { code: "NGN", symbol: "₦" },
        { code: "GHS", symbol: "₵" },
        { code: "ZAR", symbol: "R" },
        { code: "CAD", symbol: "$" },
        { code: "AUD", symbol: "$" },
      ];
      await repo.save(defaults.map((item) => repo.create(item)));
    }
    const currencies = await repo.find({ order: { code: "ASC" } });
    return NextResponse.json(currencies);
  } catch (error) {
    console.error("GET /api/currencies failed:", error);
    return NextResponse.json(
      { error: "Failed to fetch currencies", details: String(error) },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (!body?.code) {
      return NextResponse.json({ error: "Currency code is required" }, { status: 400 });
    }
    const code = String(body.code).toUpperCase();
    const symbol = body.symbol ? String(body.symbol) : null;

    const dataSource = await getDataSource();
    const repo = dataSource.getRepository(CurrencyEntity);
    const existing = await repo.findOne({ where: { code } });
    if (existing) {
      return NextResponse.json({ error: "Currency already exists" }, { status: 400 });
    }
    const created = repo.create({ code, symbol });
    const saved = await repo.save(created);
    return NextResponse.json(saved, { status: 201 });
  } catch (error) {
    console.error("POST /api/currencies failed:", error);
    return NextResponse.json(
      { error: "Failed to create currency", details: String(error) },
      { status: 500 }
    );
  }
}