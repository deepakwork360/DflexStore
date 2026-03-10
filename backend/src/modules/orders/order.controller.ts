import { Request, Response, NextFunction } from "express";
import { OrderService } from "./order.service";

export class OrderController {
  static async createOrder(req: Request, res: Response, next: NextFunction) {
    try {
      const order = await OrderService.createOrder(
        (req as any).user.id,
        req.body,
      );
      res.status(201).json({ success: true, data: order });
    } catch (error) {
      next(error);
    }
  }

  static async getOrders(req: Request, res: Response, next: NextFunction) {
    try {
      const orders = await OrderService.getOrders((req as any).user.id);
      res
        .status(200)
        .json({ success: true, count: orders.length, data: orders });
    } catch (error) {
      next(error);
    }
  }

  static async getOrder(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const order = await OrderService.getOrderById(
        id! as string,
        (req as any).user.id,
      );
      if (!order) {
        res.status(404).json({ success: false, message: "Order not found" });
        return;
      }
      res.status(200).json({ success: true, data: order });
    } catch (error) {
      next(error);
    }
  }
}
