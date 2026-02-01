import "reflect-metadata";
import { DataSource } from "typeorm";
import { ProductEntity } from "@/lib/entities/Product";
import { CategoryEntity } from "@/lib/entities/Category";
import { CurrencyEntity } from "@/lib/entities/Currency";
import { Hero } from "@/lib/entities/Hero";

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error("DATABASE_URL is not defined in environment variables.");
}

export const AppDataSource = new DataSource({
  type: "postgres",
  url: databaseUrl,
  entities: [ProductEntity, CategoryEntity, CurrencyEntity, Hero],
  synchronize: true,
  ssl: { rejectUnauthorized: false },
  logging: ["error"],
});

export async function getDataSource() {
  if (!AppDataSource.isInitialized) {
    try {
      await AppDataSource.initialize();
    } catch (error) {
      console.error("TypeORM initialization failed:", error);
      throw error;
    }
  }
  return AppDataSource;
}