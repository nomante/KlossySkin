import { Product } from "@/types";
import { getDataSource } from "@/lib/data-source";
import { ProductEntity } from "@/lib/entities/Product";

function toProduct(entity: ProductEntity): Product {
  return {
    id: entity.id,
    name: entity.name,
    description: entity.description,
    price: Number(entity.price),
    currency: (entity.currency as Product["currency"]) ?? "USD",
    image: entity.image,
    category: entity.category,
    stock: entity.stock,
    createdAt: entity.createdAt,
  };
}

export async function getAllProducts(): Promise<Product[]> {
  const dataSource = await getDataSource();
  const repo = dataSource.getRepository(ProductEntity);
  const products = await repo.find({ order: { createdAt: "DESC" } });
  return products.map(toProduct);
}

export async function getProductById(id: string): Promise<Product | null> {
  const dataSource = await getDataSource();
  const repo = dataSource.getRepository(ProductEntity);
  const product = await repo.findOne({ where: { id } });
  return product ? toProduct(product) : null;
}

export async function createProduct(
  product: Omit<Product, "id" | "createdAt">
): Promise<Product> {
  const dataSource = await getDataSource();
  const repo = dataSource.getRepository(ProductEntity);
  const created = repo.create({
    name: product.name,
    description: product.description,
    price: product.price,
    currency: product.currency,
    image: product.image,
    category: product.category,
    stock: product.stock,
  });
  const saved = await repo.save(created);
  return toProduct(saved);
}

export async function updateProduct(
  id: string,
  product: Partial<Omit<Product, "id" | "createdAt">>
): Promise<Product | null> {
  const dataSource = await getDataSource();
  const repo = dataSource.getRepository(ProductEntity);
  const existing = await repo.findOne({ where: { id } });
  if (!existing) {
    return null;
  }

  repo.merge(existing, {
    name: product.name ?? existing.name,
    description: product.description ?? existing.description,
    price: product.price ?? existing.price,
    currency: product.currency ?? existing.currency,
    image: product.image ?? existing.image,
    category: product.category ?? existing.category,
    stock: product.stock ?? existing.stock,
  });

  const saved = await repo.save(existing);
  return toProduct(saved);
}

export async function deleteProduct(id: string): Promise<boolean> {
  const dataSource = await getDataSource();
  const repo = dataSource.getRepository(ProductEntity);
  const result = await repo.delete({ id });
  return Boolean(result.affected && result.affected > 0);
}
