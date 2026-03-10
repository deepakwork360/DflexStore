"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderController = void 0;
const order_service_1 = require("./order.service");
class OrderController {
    static async createOrder(req, res, next) {
        try {
            const order = await order_service_1.OrderService.createOrder(req.user.id, req.body);
            res.status(201).json({ success: true, data: order });
        }
        catch (error) {
            next(error);
        }
    }
    static async getOrders(req, res, next) {
        try {
            const orders = await order_service_1.OrderService.getOrders(req.user.id);
            res
                .status(200)
                .json({ success: true, count: orders.length, data: orders });
        }
        catch (error) {
            next(error);
        }
    }
    static async getOrder(req, res, next) {
        try {
            const { id } = req.params;
            const order = await order_service_1.OrderService.getOrderById(id, req.user.id);
            if (!order) {
                res.status(404).json({ success: false, message: "Order not found" });
                return;
            }
            res.status(200).json({ success: true, data: order });
        }
        catch (error) {
            next(error);
        }
    }
}
exports.OrderController = OrderController;
//# sourceMappingURL=order.controller.js.map