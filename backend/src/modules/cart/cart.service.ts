import { prisma } from "../../config/db";

export class CartService {
  static async syncCart(
    userId: string,
    items: { variantId: string; quantity: number }[],
  ) {
    // 1. Ensure user has a cart
    let cart = await prisma.cart.findUnique({
      where: { userId },
      include: { items: true },
    });

    if (!cart) {
      cart = await prisma.cart.create({
        data: { userId },
        include: { items: true },
      });
    }

    // 2. We do a full replacement of cart items for simplicity
    // Delete existing
    await prisma.cartItem.deleteMany({
      where: { cartId: cart.id },
    });

    // Insert new
    if (items && items.length > 0) {
      await prisma.cartItem.createMany({
        data: items.map((item) => ({
          cartId: cart!.id,
          variantId: item.variantId,
          quantity: item.quantity,
        })),
      });
    }

    return prisma.cart.findUnique({
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

  static async getCart(userId: string) {
    return prisma.cart.findUnique({
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
