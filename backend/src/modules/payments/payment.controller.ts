import { Request, Response, NextFunction } from "express";
import { PaymentService } from "./payment.service";
import { stripe } from "../../config/stripe";
import { env } from "../../config/env";

export class PaymentController {
  static async createCheckoutSession(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const { addressId } = req.body;
      const session = await PaymentService.createCheckoutSession(
        (req as any).user.id,
        addressId,
      );

      res.status(200).json({
        success: true,
        data: session,
      });
    } catch (error: any) {
      if (error.message.includes("Cart is empty")) {
        res.status(400);
      }
      next(error);
    }
  }

  static async webhook(req: Request, res: Response, next: NextFunction) {
    const signature = req.headers["stripe-signature"];

    try {
      // req.body must be raw string/buffer for Stripe signature verification
      const event = stripe.webhooks.constructEvent(
        req.body, // In Express, we need a custom raw body parser for this specific route
        signature as string,
        env.STRIPE_WEBHOOK_SECRET,
      );

      await PaymentService.handleWebhook(event);

      res.status(200).json({ received: true });
    } catch (error: any) {
      res.status(400).send(`Webhook Error: ${error.message}`);
    }
  }
}
