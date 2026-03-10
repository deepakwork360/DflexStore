"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentService = void 0;
const db_1 = require("../../config/db");
const stripe_1 = require("../../config/stripe");
const env_1 = require("../../config/env");
class PaymentService {
    static async createCheckoutSession(userId, addressId) {
        // 1. Fetch user's cart
        const cart = await db_1.prisma.cart.findUnique({
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
        if (!cart || cart.items.length === 0) {
            throw new Error("Cart is empty");
        }
        // 2. Format line items for Stripe
        const lineItems = cart.items.map((item) => {
            const imageUrls = item.variant.product.images?.[0]?.url
                ? [item.variant.product.images[0].url]
                : [];
            return {
                price_data: {
                    currency: "usd",
                    product_data: {
                        name: item.variant.product.title,
                        description: `Variant SKU: ${item.variant.sku} ${item.variant.size ? `| Size: ${item.variant.size}` : ""}`,
                        images: imageUrls,
                    },
                    unit_amount: Math.round(item.variant.price * 100), // Stripe uses cents
                },
                quantity: item.quantity,
            };
        });
        const totalAmount = cart.items.reduce((total, item) => total + item.variant.price * item.quantity, 0);
        // 3. Create Order in PENDING status first
        const order = await db_1.prisma.$transaction(async (tx) => {
            // Create Order
            const newOrder = await tx.order.create({
                data: {
                    userId,
                    addressId,
                    totalAmount,
                    status: "PENDING",
                },
            });
            // Create Order Items
            for (const item of cart.items) {
                await tx.orderItem.create({
                    data: {
                        orderId: newOrder.id,
                        variantId: item.variantId,
                        quantity: item.quantity,
                        price: item.variant.price,
                    },
                });
            }
            return newOrder;
        });
        // 4. Create Stripe Checkout Session
        const user = await db_1.prisma.user.findUnique({ where: { id: userId } });
        if (!user)
            throw new Error("User not found");
        const session = await stripe_1.stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            mode: "payment",
            success_url: `${env_1.env.FRONTEND_URL}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${env_1.env.FRONTEND_URL}/cart`,
            customer_email: user.email,
            client_reference_id: userId,
            line_items: lineItems,
            metadata: {
                userId,
                addressId,
                orderId: order.id,
            },
        });
        return { url: session.url };
    }
    static async handleWebhook(event) {
        if (event.type === "checkout.session.completed") {
            const session = event.data.object;
            const orderId = session.metadata?.orderId;
            const userId = session.metadata?.userId;
            if (!orderId || !userId)
                return;
            const totalAmount = session.amount_total ? session.amount_total / 100 : 0;
            await db_1.prisma.$transaction(async (tx) => {
                // 1. Update Order Status
                await tx.order.update({
                    where: { id: orderId },
                    data: { status: "CONFIRMED" },
                });
                // 2. Decrement Stock for each item in the order
                const orderItems = await tx.orderItem.findMany({
                    where: { orderId },
                });
                for (const item of orderItems) {
                    await tx.productVariant.update({
                        where: { id: item.variantId },
                        data: { stock: { decrement: item.quantity } },
                    });
                }
                // 3. Create Payment tracking record
                await tx.payment.create({
                    data: {
                        orderId,
                        provider: "STRIPE",
                        transactionId: session.id,
                        amount: totalAmount,
                        status: "SUCCESS",
                    },
                });
                // 4. Clear user's cart
                const cart = await tx.cart.findUnique({ where: { userId } });
                if (cart) {
                    await tx.cartItem.deleteMany({
                        where: { cartId: cart.id },
                    });
                }
            });
        }
    }
}
exports.PaymentService = PaymentService;
//# sourceMappingURL=payment.service.js.map