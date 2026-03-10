"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentController = void 0;
const payment_service_1 = require("./payment.service");
const stripe_1 = require("../../config/stripe");
const env_1 = require("../../config/env");
class PaymentController {
    static async createCheckoutSession(req, res, next) {
        try {
            const { addressId } = req.body;
            const session = await payment_service_1.PaymentService.createCheckoutSession(req.user.id, addressId);
            res.status(200).json({
                success: true,
                data: session,
            });
        }
        catch (error) {
            if (error.message.includes("Cart is empty")) {
                res.status(400);
            }
            next(error);
        }
    }
    static async webhook(req, res, next) {
        const signature = req.headers["stripe-signature"];
        try {
            // req.body must be raw string/buffer for Stripe signature verification
            const event = stripe_1.stripe.webhooks.constructEvent(req.body, // In Express, we need a custom raw body parser for this specific route
            signature, env_1.env.STRIPE_WEBHOOK_SECRET);
            await payment_service_1.PaymentService.handleWebhook(event);
            res.status(200).json({ received: true });
        }
        catch (error) {
            res.status(400).send(`Webhook Error: ${error.message}`);
        }
    }
}
exports.PaymentController = PaymentController;
//# sourceMappingURL=payment.controller.js.map