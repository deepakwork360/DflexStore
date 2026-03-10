import { Request, Response, NextFunction } from "express";
import { CartService } from "./cart.service";

export class CartController {
  static async getCart(req: Request, res: Response, next: NextFunction) {
    try {
      const cart = await CartService.getCart(req.user.id);
      res.status(200).json({
        success: true,
        data: cart || { items: [] },
      });
    } catch (error: any) {
      next(error);
    }
  }

  static async syncCart(req: Request, res: Response, next: NextFunction) {
    try {
      const { items } = req.body;
      const cart = await CartService.syncCart(req.user.id, items || []);

      res.status(200).json({
        success: true,
        data: cart,
      });
    } catch (error: any) {
      next(error);
    }
  }
}
