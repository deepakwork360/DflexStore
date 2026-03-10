import { Router } from "express";
import { CartController } from "./cart.controller";
import { protect } from "../../middleware/auth.middleware";

const router = Router();

router.use(protect); // Ensure user is logged in for all cart operations

router.route("/").get(CartController.getCart).post(CartController.syncCart);

export const cartRoutes = router;
