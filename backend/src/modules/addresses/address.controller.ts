import { Request, Response, NextFunction } from "express";
import { AddressService } from "./address.service";

export class AddressController {
  static async createAddress(req: Request, res: Response, next: NextFunction) {
    try {
      const address = await AddressService.createAddress(
        (req as any).user.id,
        req.body,
      );
      res.status(201).json({ success: true, data: address });
    } catch (error) {
      next(error);
    }
  }

  static async getAddresses(req: Request, res: Response, next: NextFunction) {
    try {
      const addresses = await AddressService.getAddresses((req as any).user.id);
      res
        .status(200)
        .json({ success: true, count: addresses.length, data: addresses });
    } catch (error) {
      next(error);
    }
  }

  static async updateAddress(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const address = await AddressService.updateAddress(
        id! as string,
        (req as any).user.id,
        req.body,
      );
      res.status(200).json({ success: true, data: address });
    } catch (error) {
      next(error);
    }
  }

  static async deleteAddress(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      await AddressService.deleteAddress(id! as string, (req as any).user.id);
      res
        .status(200)
        .json({ success: true, message: "Address deleted successfully" });
    } catch (error) {
      next(error);
    }
  }
}
