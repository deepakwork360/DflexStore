import { Request, Response, NextFunction } from "express";
import { CategoryService } from "./category.service";
import { uploadToCloudinary } from "../../utils/cloudinaryUpload";

export class CategoryController {
  static async createCategory(req: Request, res: Response, next: NextFunction) {
    try {
      const { name, slug } = req.body;
      if (!name || !slug) {
        res
          .status(400)
          .json({ success: false, message: "Name and slug are required" });
        return;
      }

      let imageUrl: string | undefined;
      if (req.file) {
        imageUrl = await uploadToCloudinary(
          req.file.buffer,
          "d-ecom/categories",
        );
      }

      const payload: any = { name, slug };
      if (imageUrl) payload.imageUrl = imageUrl;

      const category = await CategoryService.createCategory(payload);

      res.status(201).json({
        success: true,
        data: category,
      });
    } catch (error: any) {
      if (error.message.includes("already exists")) {
        res.status(400);
      }
      next(error);
    }
  }

  static async getCategories(req: Request, res: Response, next: NextFunction) {
    try {
      const categories = await CategoryService.getAllCategories();
      res.status(200).json({
        success: true,
        count: categories.length,
        data: categories,
      });
    } catch (error: any) {
      next(error);
    }
  }

  static async getCategory(req: Request, res: Response, next: NextFunction) {
    try {
      const idStr = Array.isArray(req.params.id)
        ? req.params.id[0]
        : req.params.id;
      const category = await CategoryService.getCategoryByIdOrSlug(
        idStr as string,
      );

      if (!category) {
        res.status(404).json({ success: false, message: "Category not found" });
        return;
      }

      res.status(200).json({
        success: true,
        data: category,
      });
    } catch (error: any) {
      next(error);
    }
  }

  static async updateCategory(req: Request, res: Response, next: NextFunction) {
    try {
      const { name, slug } = req.body;
      const idStr = Array.isArray(req.params.id)
        ? req.params.id[0]
        : req.params.id;

      let imageUrl: string | undefined;
      if (req.file) {
        imageUrl = await uploadToCloudinary(
          req.file.buffer,
          "d-ecom/categories",
        );
      }

      const payload: any = { name, slug };
      if (imageUrl) payload.imageUrl = imageUrl;

      const category = await CategoryService.updateCategory(
        idStr as string,
        payload,
      );

      res.status(200).json({
        success: true,
        data: category,
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

  static async deleteCategory(req: Request, res: Response, next: NextFunction) {
    try {
      const idStr = Array.isArray(req.params.id)
        ? req.params.id[0]
        : req.params.id;
      await CategoryService.deleteCategory(idStr as string);

      res.status(200).json({
        success: true,
        data: {}, // Send empty object as per typical REST APIs for delete
      });
    } catch (error: any) {
      if (error.message.includes("not found")) {
        res.status(404);
      }
      next(error);
    }
  }
}
