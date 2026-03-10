import { prisma } from "../../config/db";

export class CategoryService {
  static async createCategory(data: {
    name: string;
    slug: string;
    imageUrl?: string;
  }) {
    const existing = await prisma.category.findUnique({
      where: { slug: data.slug },
    });

    if (existing) {
      throw new Error("Category with this slug already exists");
    }

    return prisma.category.create({
      data: {
        name: data.name,
        slug: data.slug,
        imageUrl: data.imageUrl ?? null,
      },
    });
  }

  static async getAllCategories() {
    return prisma.category.findMany({
      orderBy: { createdAt: "desc" },
    });
  }

  static async getCategoryByIdOrSlug(identifier: string) {
    return prisma.category.findFirst({
      where: {
        OR: [{ id: identifier }, { slug: identifier }],
      },
      include: {
        products: true,
      },
    });
  }

  static async updateCategory(
    id: string,
    data: { name?: string; slug?: string; imageUrl?: string },
  ) {
    const category = await prisma.category.findUnique({ where: { id } });
    if (!category) {
      throw new Error("Category not found");
    }

    if (data.slug && data.slug !== category.slug) {
      const existingSlug = await prisma.category.findUnique({
        where: { slug: data.slug },
      });
      if (existingSlug) {
        throw new Error("Category with this slug already exists");
      }
    }

    return prisma.category.update({
      where: { id },
      data,
    });
  }

  static async deleteCategory(id: string) {
    const category = await prisma.category.findUnique({ where: { id } });
    if (!category) {
      throw new Error("Category not found");
    }

    return prisma.category.delete({
      where: { id },
    });
  }
}
