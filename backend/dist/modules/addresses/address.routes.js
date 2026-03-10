"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addressRoutes = void 0;
const express_1 = require("express");
const address_controller_1 = require("./address.controller");
const auth_middleware_1 = require("../../middleware/auth.middleware");
const router = (0, express_1.Router)();
router.use(auth_middleware_1.protect);
router.post("/", address_controller_1.AddressController.createAddress);
router.get("/", address_controller_1.AddressController.getAddresses);
router.put("/:id", address_controller_1.AddressController.updateAddress);
router.delete("/:id", address_controller_1.AddressController.deleteAddress);
exports.addressRoutes = router;
//# sourceMappingURL=address.routes.js.map