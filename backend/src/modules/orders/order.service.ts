import { prisma } from "../../config/db";

export class OrderService {
  static async createOrder(userId: string, data: any) {
    const { addressId, couponId } = data;

    // 1. Fetch user's cart
    const cart = await prisma.cart.findUnique({
      where: { userId },
      include: {
        items: {
          include: {
            variant: true,
          },
        },
      },
    });

    if (!cart || cart.items.length === 0) {
      throw new Error("Cart is empty");
    }

    // 2. Validate address
    const address = await prisma.address.findUnique({
      where: { id: addressId, userId },
    });
    if (!address) {
      throw new Error("Invalid address");
    }

    // 3. Calculate total amount
    let totalAmount = cart.items.reduce((total, item) => {
      return total + item.variant.price * item.quantity;
    }, 0);

    // TODO: Apply coupon if exists
    if (couponId) {
      const coupon = await prisma.coupon.findUnique({
        where: { id: couponId },
      });
      if (coupon) {
        totalAmount -= coupon.discount;
      }
    }

    // 4. Atomic Database Transaction
    return prisma.$transaction(async (tx: any) => {
      // Create Order
      const order = await tx.order.create({
        data: {
          userId,
          addressId,
          totalAmount,
          status: "PENDING",
          couponId: couponId || null,
        },
      });

      // Create OrderItems and decrement stock
      for (const item of cart.items) {
        await tx.orderItem.create({
          data: {
            orderId: order.id,
            variantId: item.variantId,
            quantity: item.quantity,
            price: item.variant.price,
          },
        });

        // Decrement stock
        await tx.productVariant.update({
          where: { id: item.variantId },
          data: { stock: { decrement: item.quantity } },
        });
      }

      // Clear user's cart
      await tx.cartItem.deleteMany({
        where: { cartId: cart.id },
      });

      return order;
    });
  }

  static async getOrders(userId: string) {
    return prisma.order.findMany({
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
        address: true,
        payment: true,
      },
      orderBy: { createdAt: "desc" },
    });
  }

  static async getOrderById(id: string, userId: string) {
    return prisma.order.findUnique({
      where: { id, userId },
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
        address: true,
        payment: true,
      },
    });
  }
}
