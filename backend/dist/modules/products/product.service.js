"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductService = void 0;
const db_1 = require("../../config/db");
class ProductService {
    static async createProduct(data, imageUrls) {
        const { title, description, slug, brand, categoryId, variants } = data;
        // Check if category exists
        const category = await db_1.prisma.category.findUnique({
            where: { id: categoryId },
        });
        if (!category) {
            throw new Error("Category not found");
        }
        // Check if slug exists
        const existing = await db_1.prisma.product.findUnique({
            where: { slug },
        });
        if (existing) {
            throw new Error("Product with this slug already exists");
        }
        // Parse variants if they come as JSON string from multipart/form-data
        let parsedVariants = [];
        if (typeof variants === "string") {
            try {
                parsedVariants = JSON.parse(variants);
            }
            catch (e) {
                throw new Error("Invalid variants format");
            }
        }
        else if (Array.isArray(variants)) {
            parsedVariants = variants;
        }
        // Transaction to ensure atomicity
        return db_1.prisma.$transaction(async (tx) => {
            // 1. Create product
            const product = await tx.product.create({
                data: {
                    title,
                    description,
                    slug,
                    brand,
                    categoryId,
                },
            });
            // 2. Create images
            if (imageUrls && imageUrls.length > 0) {
                await tx.productImage.createMany({
                    data: imageUrls.map((url) => ({
                        productId: product.id,
                        url,
                    })),
                });
            }
            // 3. Create variants
            if (parsedVariants && parsedVariants.length > 0) {
                await tx.productVariant.createMany({
                    data: parsedVariants.map((v) => ({
                        productId: product.id,
                        sku: v.sku,
                        price: parseFloat(v.price),
                        stock: parseInt(v.stock, 10),
                        size: v.size || null,
                        color: v.color || null,
                    })),
                });
            }
            // 4. Return complete product
            return tx.product.findUnique({
                where: { id: product.id },
                include: {
                    images: true,
                    variants: true,
                    category: true,
                },
            });
        });
    }
    static async getAllProducts(categorySlug) {
        const query = {
            include: {
                images: true,
                variants: true,
                category: true,
            },
            orderBy: { createdAt: "desc" },
        };
        if (categorySlug) {
            query.where = {
                category: {
                    slug: categorySlug,
                },
            };
        }
        return db_1.prisma.product.findMany(query);
    }
    static async getProductBySlugOrId(identifier) {
        return db_1.prisma.product.findFirst({
            where: {
                OR: [{ id: identifier }, { slug: identifier }],
            },
            include: {
                images: true,
                variants: true,
                category: true,
                reviews: {
                    include: {
                        user: {
                            select: { name: true },
                        },
                    },
                },
            },
        });
    }
    static async updateProduct(idStr, data) {
        const { title, description, slug, brand, categoryId } = data;
        const existingProduct = await db_1.prisma.product.findFirst({
            where: { OR: [{ id: idStr }, { slug: idStr }] },
        });
        if (!existingProduct) {
            throw new Error("Product not found");
        }
        if (slug && slug !== existingProduct.slug) {
            const slugExists = await db_1.prisma.product.findUnique({
                where: { slug },
            });
            if (slugExists) {
                throw new Error("Product with this slug already exists");
            }
        }
        if (categoryId) {
            const category = await db_1.prisma.category.findUnique({
                where: { id: categoryId },
            });
            if (!category) {
                throw new Error("Category not found");
            }
        }
        return db_1.prisma.product.update({
            where: { id: existingProduct.id },
            data: {
                ...(title && { title }),
                ...(description && { description }),
                ...(slug && { slug }),
                ...(brand && { brand }),
                ...(categoryId && { categoryId }),
            },
            include: {
                category: true,
            },
        });
    }
    static async deleteProduct(idStr) {
        const existingProduct = await db_1.prisma.product.findFirst({
            where: { OR: [{ id: idStr }, { slug: idStr }] },
        });
        if (!existingProduct) {
            throw new Error("Product not found");
        }
        return db_1.prisma.$transaction(async (tx) => {
            await tx.productImage.deleteMany({
                where: { productId: existingProduct.id },
            });
            await tx.productVariant.deleteMany({
                where: { productId: existingProduct.id },
            });
            await tx.review.deleteMany({ where: { productId: existingProduct.id } });
            await tx.wishlist.deleteMany({
                where: { productId: existingProduct.id },
            });
            return tx.product.delete({
                where: { id: existingProduct.id },
            });
        });
    }
}
exports.ProductService = ProductService;
//# sourceMappingURL=product.service.js.map