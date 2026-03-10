import { Router } from "express";
import express from "express";
import { PaymentController } from "./payment.controller";
import { protect } from "../../middleware/auth.middleware";

const router = Router();

// Endpoint for creating the checkout session (protected by auth)
router.post(
  "/create-checkout-session",
  protect,
  PaymentController.createCheckoutSession,
);

// Webhook endpoint (Requires RAW body, not JSON)
// We mount express.raw() specifically on this route to bypass the global express.json()
router.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  PaymentController.webhook,
);

export const paymentRoutes = router;
