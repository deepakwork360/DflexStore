import { Request, Response, NextFunction } from "express";
import { ProductService } from "./product.service";
import { uploadToCloudinary } from "../../utils/cloudinaryUpload";

export class ProductController {
  static async createProduct(req: Request, res: Response, next: NextFunction) {
    try {
      const files = req.files as Express.Multer.File[];
      const imageUrls: string[] = [];

      // Upload files to Cloudinary
      if (files && files.length > 0) {
        for (const file of files) {
          const url = await uploadToCloudinary(file.buffer, "d-ecom/products");
          imageUrls.push(url);
        }
      }

      const product = await ProductService.createProduct(req.body, imageUrls);

      res.status(201).json({
        success: true,
        data: product,
      });
    } catch (error: any) {
      if (
        error.message.includes("already exists") ||
        error.message.includes("not found")
      ) {
        res.status(400);
      }
      next(error);
    }
  }

  static async getProducts(req: Request, res: Response, next: NextFunction) {
    try {
      const category = req.query.category as string | undefined;
      const products = await ProductService.getAllProducts(category);

      res.status(200).json({
        success: true,
        count: products.length,
        data: products,
      });
    } catch (error: any) {
      next(error);
    }
  }

  static async getProduct(req: Request, res: Response, next: NextFunction) {
    try {
      const idStr = Array.isArray(req.params.id)
        ? req.params.id[0]
        : req.params.id;
      const product = await ProductService.getProductBySlugOrId(
        idStr as string,
      );

      if (!product) {
        res.status(404).json({ success: false, message: "Product not found" });
        return;
      }

      res.status(200).json({
        success: true,
        data: product,
      });
    } catch (error: any) {
      next(error);
    }
  }

  static async updateProduct(req: Request, res: Response, next: NextFunction) {
    try {
      const idStr = Array.isArray(req.params.id)
        ? req.params.id[0]
        : req.params.id;

      const product = await ProductService.updateProduct(
        idStr as string,
        req.body,
      );

      res.status(200).json({
        success: true,
        data: product,
      });
    } catch (error: any) {
      if (error.message.includes("not found")) {
        res.status(404);
      } else if (error.message.includes("already exists")) {
        res.status(400);
      }
      next(error);
    }
  }

  static async deleteProduct(req: Request, res: Response, next: NextFunction) {
    try {
      const idStr = Array.isArray(req.params.id)
        ? req.params.id[0]
        : req.params.id;

      await ProductService.deleteProduct(idStr as string);

      res.status(200).json({
        success: true,
        data: {},
      });
    } catch (error: any) {
      if (error.message.includes("not found")) {
        res.status(404);
      }
      next(error);
    }
  }
}
