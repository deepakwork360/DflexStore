"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductController = void 0;
const product_service_1 = require("./product.service");
const cloudinaryUpload_1 = require("../../utils/cloudinaryUpload");
class ProductController {
    static async createProduct(req, res, next) {
        try {
            const files = req.files;
            const imageUrls = [];
            // Upload files to Cloudinary
            if (files && files.length > 0) {
                for (const file of files) {
                    const url = await (0, cloudinaryUpload_1.uploadToCloudinary)(file.buffer, "d-ecom/products");
                    imageUrls.push(url);
                }
            }
            const product = await product_service_1.ProductService.createProduct(req.body, imageUrls);
            res.status(201).json({
                success: true,
                data: product,
            });
        }
        catch (error) {
            if (error.message.includes("already exists") ||
                error.message.includes("not found")) {
                res.status(400);
            }
            next(error);
        }
    }
    static async getProducts(req, res, next) {
        try {
            const category = req.query.category;
            const products = await product_service_1.ProductService.getAllProducts(category);
            res.status(200).json({
                success: true,
                count: products.length,
                data: products,
            });
        }
        catch (error) {
            next(error);
        }
    }
    static async getProduct(req, res, next) {
        try {
            const idStr = Array.isArray(req.params.id)
                ? req.params.id[0]
                : req.params.id;
            const product = await product_service_1.ProductService.getProductBySlugOrId(idStr);
            if (!product) {
                res.status(404).json({ success: false, message: "Product not found" });
                return;
            }
            res.status(200).json({
                success: true,
                data: product,
            });
        }
        catch (error) {
            next(error);
        }
    }
    static async updateProduct(req, res, next) {
        try {
            const idStr = Array.isArray(req.params.id)
                ? req.params.id[0]
                : req.params.id;
            const product = await product_service_1.ProductService.updateProduct(idStr, req.body);
            res.status(200).json({
                success: true,
                data: product,
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
    static async deleteProduct(req, res, next) {
        try {
            const idStr = Array.isArray(req.params.id)
                ? req.params.id[0]
                : req.params.id;
            await product_service_1.ProductService.deleteProduct(idStr);
            res.status(200).json({
                success: true,
                data: {},
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
exports.ProductController = ProductController;
//# sourceMappingURL=product.controller.js.map