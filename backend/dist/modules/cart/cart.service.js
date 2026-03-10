"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CartService = void 0;
const db_1 = require("../../config/db");
class CartService {
    static async syncCart(userId, items) {
        // 1. Ensure user has a cart
        let cart = await db_1.prisma.cart.findUnique({
            where: { userId },
            include: { items: true },
        });
        if (!cart) {
            cart = await db_1.prisma.cart.create({
                data: { userId },
                include: { items: true },
            });
        }
        // 2. We do a full replacement of cart items for simplicity
        // Delete existing
        await db_1.prisma.cartItem.deleteMany({
            where: { cartId: cart.id },
        });
        // Insert new
        if (items && items.length > 0) {
            await db_1.prisma.cartItem.createMany({
                data: items.map((item) => ({
                    cartId: cart.id,
                    variantId: item.variantId,
                    quantity: item.quantity,
                })),
            });
        }
        return db_1.prisma.cart.findUnique({
            where: { id: cart.id },
            include: {
                items: {
                    include: {
                        variant: {
                            include: { product: true },
                        },
                    },
                },
            },
        });
    }
    static async getCart(userId) {
        return db_1.prisma.cart.findUnique({
            where: { userId },
            include: {
                items: {
                    include: {
                        variant: {
                            include: {
                                product: {
                                    include: {
                                        images: true,
                                    },
                                },
                            },
                        },
                    },
                },
            },
        });
    }
}
exports.CartService = CartService;
//# sourceMappingURL=cart.service.js.map