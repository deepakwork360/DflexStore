"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.categoryRoutes = void 0;
const express_1 = require("express");
const category_controller_1 = require("./category.controller");
const auth_middleware_1 = require("../../middleware/auth.middleware");
const role_middleware_1 = require("../../middleware/role.middleware");
const multer_1 = require("../../config/multer");
const router = (0, express_1.Router)();
router
    .route("/")
    .get(category_controller_1.CategoryController.getCategories)
    .post(auth_middleware_1.protect, (0, role_middleware_1.authorizeRoles)("ADMIN"), multer_1.upload.single("image"), category_controller_1.CategoryController.createCategory);
router
    .route("/:id")
    .get(category_controller_1.CategoryController.getCategory)
    .put(auth_middleware_1.protect, (0, role_middleware_1.authorizeRoles)("ADMIN"), multer_1.upload.single("image"), category_controller_1.CategoryController.updateCategory)
    .delete(auth_middleware_1.protect, (0, role_middleware_1.authorizeRoles)("ADMIN"), category_controller_1.CategoryController.deleteCategory);
exports.categoryRoutes = router;
//# sourceMappingURL=category.routes.js.map