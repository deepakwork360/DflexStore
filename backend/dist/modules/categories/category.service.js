"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoryService = void 0;
const db_1 = require("../../config/db");
class CategoryService {
    static async createCategory(data) {
        const existing = await db_1.prisma.category.findUnique({
            where: { slug: data.slug },
        });
        if (existing) {
            throw new Error("Category with this slug already exists");
        }
        return db_1.prisma.category.create({
            data: {
                name: data.name,
                slug: data.slug,
                imageUrl: data.imageUrl ?? null,
            },
        });
    }
    static async getAllCategories() {
        return db_1.prisma.category.findMany({
            orderBy: { createdAt: "desc" },
        });
    }
    static async getCategoryByIdOrSlug(identifier) {
        return db_1.prisma.category.findFirst({
            where: {
                OR: [{ id: identifier }, { slug: identifier }],
            },
            include: {
                products: true,
            },
        });
    }
    static async updateCategory(id, data) {
        const category = await db_1.prisma.category.findUnique({ where: { id } });
        if (!category) {
            throw new Error("Category not found");
        }
        if (data.slug && data.slug !== category.slug) {
            const existingSlug = await db_1.prisma.category.findUnique({
                where: { slug: data.slug },
            });
            if (existingSlug) {
                throw new Error("Category with this slug already exists");
            }
        }
        return db_1.prisma.category.update({
            where: { id },
            data,
        });
    }
    static async deleteCategory(id) {
        const category = await db_1.prisma.category.findUnique({ where: { id } });
        if (!category) {
            throw new Error("Category not found");
        }
        return db_1.prisma.category.delete({
            where: { id },
        });
    }
}
exports.CategoryService = CategoryService;
//# sourceMappingURL=category.service.js.map