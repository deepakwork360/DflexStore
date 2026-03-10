import { Router } from "express";
import { ProductController } from "./product.controller";
import { protect } from "../../middleware/auth.middleware";
import { authorizeRoles } from "../../middleware/role.middleware";
import { upload } from "../../config/multer";

const router = Router();

router.route("/").get(ProductController.getProducts).post(
  protect,
  authorizeRoles("ADMIN"),
  upload.array("images", 5), // allow up to 5 images
  ProductController.createProduct,
);

router
  .route("/:id")
  .get(ProductController.getProduct)
  .put(protect, authorizeRoles("ADMIN"), ProductController.updateProduct)
  .delete(protect, authorizeRoles("ADMIN"), ProductController.deleteProduct);

export const productRoutes = router;
