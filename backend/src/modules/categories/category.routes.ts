import { Router } from "express";
import { CategoryController } from "./category.controller";
import { protect } from "../../middleware/auth.middleware";
import { authorizeRoles } from "../../middleware/role.middleware";
import { upload } from "../../config/multer";

const router = Router();

router
  .route("/")
  .get(CategoryController.getCategories)
  .post(
    protect,
    authorizeRoles("ADMIN"),
    upload.single("image"),
    CategoryController.createCategory,
  );

router
  .route("/:id")
  .get(CategoryController.getCategory)
  .put(
    protect,
    authorizeRoles("ADMIN"),
    upload.single("image"),
    CategoryController.updateCategory,
  )
  .delete(protect, authorizeRoles("ADMIN"), CategoryController.deleteCategory);

export const categoryRoutes = router;
