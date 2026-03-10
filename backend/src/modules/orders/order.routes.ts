import { Router } from "express";
import { OrderController } from "./order.controller";
import { protect } from "../../middleware/auth.middleware";

const router = Router();

router.use(protect);

router.post("/", OrderController.createOrder);
router.get("/", OrderController.getOrders);
router.get("/:id", OrderController.getOrder);

export const orderRoutes = router;
