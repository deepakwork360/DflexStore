"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CartController = void 0;
const cart_service_1 = require("./cart.service");
class CartController {
    static async getCart(req, res, next) {
        try {
            const cart = await cart_service_1.CartService.getCart(req.user.id);
            res.status(200).json({
                success: true,
                data: cart || { items: [] },
            });
        }
        catch (error) {
            next(error);
        }
    }
    static async syncCart(req, res, next) {
        try {
            const { items } = req.body;
            const cart = await cart_service_1.CartService.syncCart(req.user.id, items || []);
            res.status(200).json({
                success: true,
                data: cart,
            });
        }
        catch (error) {
            next(error);
        }
    }
}
exports.CartController = CartController;
//# sourceMappingURL=cart.controller.js.map