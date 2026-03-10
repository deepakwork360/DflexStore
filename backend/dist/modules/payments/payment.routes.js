"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.paymentRoutes = void 0;
const express_1 = require("express");
const express_2 = __importDefault(require("express"));
const payment_controller_1 = require("./payment.controller");
const auth_middleware_1 = require("../../middleware/auth.middleware");
const router = (0, express_1.Router)();
// Endpoint for creating the checkout session (protected by auth)
router.post("/create-checkout-session", auth_middleware_1.protect, payment_controller_1.PaymentController.createCheckoutSession);
// Webhook endpoint (Requires RAW body, not JSON)
// We mount express.raw() specifically on this route to bypass the global express.json()
router.post("/webhook", express_2.default.raw({ type: "application/json" }), payment_controller_1.PaymentController.webhook);
exports.paymentRoutes = router;
//# sourceMappingURL=payment.routes.js.map