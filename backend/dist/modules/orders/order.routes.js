"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.orderRoutes = void 0;
const express_1 = require("express");
const order_controller_1 = require("./order.controller");
const auth_middleware_1 = require("../../middleware/auth.middleware");
const router = (0, express_1.Router)();
router.use(auth_middleware_1.protect);
router.post("/", order_controller_1.OrderController.createOrder);
router.get("/", order_controller_1.OrderController.getOrders);
router.get("/:id", order_controller_1.OrderController.getOrder);
exports.orderRoutes = router;
//# sourceMappingURL=order.routes.js.map