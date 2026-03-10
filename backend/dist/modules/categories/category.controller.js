"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoryController = void 0;
const category_service_1 = require("./category.service");
const cloudinaryUpload_1 = require("../../utils/cloudinaryUpload");
class CategoryController {
    static async createCategory(req, res, next) {
        try {
            const { name, slug } = req.body;
            if (!name || !slug) {
                res
                    .status(400)
                    .json({ success: false, message: "Name and slug are required" });
                return;
            }
            let imageUrl;
            if (req.file) {
                imageUrl = await (0, cloudinaryUpload_1.uploadToCloudinary)(req.file.buffer, "d-ecom/categories");
            }
            const payload = { name, slug };
            if (imageUrl)
                payload.imageUrl = imageUrl;
            const category = await category_service_1.CategoryService.createCategory(payload);
            res.status(201).json({
                success: true,
                data: category,
            });
        }
        catch (error) {
            if (error.message.includes("already exists")) {
                res.status(400);
            }
            next(error);
        }
    }
    static async getCategories(req, res, next) {
        try {
            const categories = await category_service_1.CategoryService.getAllCategories();
            res.status(200).json({
                success: true,
                count: categories.length,
                data: categories,
            });
        }
        catch (error) {
            next(error);
        }
    }
    static async getCategory(req, res, next) {
        try {
            const idStr = Array.isArray(req.params.id)
                ? req.params.id[0]
                : req.params.id;
            const category = await category_service_1.CategoryService.getCategoryByIdOrSlug(idStr);
            if (!category) {
                res.status(404).json({ success: false, message: "Category not found" });
                return;
            }
            res.status(200).json({
                success: true,
                data: category,
            });
        }
        catch (error) {
            next(error);
        }
    }
    static async updateCategory(req, res, next) {
        try {
            const { name, slug } = req.body;
            const idStr = Array.isArray(req.params.id)
                ? req.params.id[0]
                : req.params.id;
            let imageUrl;
            if (req.file) {
                imageUrl = await (0, cloudinaryUpload_1.uploadToCloudinary)(req.file.buffer, "d-ecom/categories");
            }
            const payload = { name, slug };
            if (imageUrl)
                payload.imageUrl = imageUrl;
            const category = await category_service_1.CategoryService.updateCategory(idStr, payload);
            res.status(200).json({
                success: true,
                data: category,
            });
        }
        catch (error) {
            if (error.message.includes("not found")) {
                res.status(404);
            }
            else if (error.message.includes("already exists")) {
                res.status(400);
            }
            next(error);
        }
    }
    static async deleteCategory(req, res, next) {
        try {
            const idStr = Array.isArray(req.params.id)
                ? req.params.id[0]
                : req.params.id;
            await category_service_1.CategoryService.deleteCategory(idStr);
            res.status(200).json({
                success: true,
                data: {}, // Send empty object as per typical REST APIs for delete
            });
        }
        catch (error) {
            if (error.message.includes("not found")) {
                res.status(404);
            }
            next(error);
        }
    }
}
exports.CategoryController = CategoryController;
//# sourceMappingURL=category.controller.js.map