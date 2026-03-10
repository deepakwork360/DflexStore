"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.productRoutes = void 0;
const express_1 = require("express");
const product_controller_1 = require("./product.controller");
const auth_middleware_1 = require("../../middleware/auth.middleware");
const role_middleware_1 = require("../../middleware/role.middleware");
const multer_1 = require("../../config/multer");
const router = (0, express_1.Router)();
router.route("/").get(product_controller_1.ProductController.getProducts).post(auth_middleware_1.protect, (0, role_middleware_1.authorizeRoles)("ADMIN"), multer_1.upload.array("images", 5), // allow up to 5 images
product_controller_1.ProductController.createProduct);
router
    .route("/:id")
    .get(product_controller_1.ProductController.getProduct)
    .put(auth_middleware_1.protect, (0, role_middleware_1.authorizeRoles)("ADMIN"), product_controller_1.ProductController.updateProduct)
    .delete(auth_middleware_1.protect, (0, role_middleware_1.authorizeRoles)("ADMIN"), product_controller_1.ProductController.deleteProduct);
exports.productRoutes = router;
//# sourceMappingURL=product.routes.js.map