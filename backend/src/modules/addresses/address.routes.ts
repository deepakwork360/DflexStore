import { Router } from "express";
import { AddressController } from "./address.controller";
import { protect } from "../../middleware/auth.middleware";

const router = Router();

router.use(protect);

router.post("/", AddressController.createAddress);
router.get("/", AddressController.getAddresses);
router.put("/:id", AddressController.updateAddress);
router.delete("/:id", AddressController.deleteAddress);

export const addressRoutes = router;
