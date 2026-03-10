import { Router } from "express";
import { authRoutes } from "../modules/auth/auth.routes";
import { categoryRoutes } from "../modules/categories/category.routes";
import { productRoutes } from "../modules/products/product.routes";
import { cartRoutes } from "../modules/cart/cart.routes";
import { paymentRoutes } from "../modules/payments/payment.routes";
import { addressRoutes } from "../modules/addresses/address.routes";
import { orderRoutes } from "../modules/orders/order.routes";

const router = Router();

router.use("/auth", authRoutes);
router.use("/categories", categoryRoutes);
router.use("/products", productRoutes);
router.use("/cart", cartRoutes);
router.use("/payments", paymentRoutes);
router.use("/addresses", addressRoutes);
router.use("/orders", orderRoutes);

export default router;
