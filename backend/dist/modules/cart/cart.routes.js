"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cartRoutes = void 0;
const express_1 = require("express");
const cart_controller_1 = require("./cart.controller");
const auth_middleware_1 = require("../../middleware/auth.middleware");
const router = (0, express_1.Router)();
router.use(auth_middleware_1.protect); // Ensure user is logged in for all cart operations
router.route("/").get(cart_controller_1.CartController.getCart).post(cart_controller_1.CartController.syncCart);
exports.cartRoutes = router;
//# sourceMappingURL=cart.routes.js.map