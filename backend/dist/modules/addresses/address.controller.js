"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddressController = void 0;
const address_service_1 = require("./address.service");
class AddressController {
    static async createAddress(req, res, next) {
        try {
            const address = await address_service_1.AddressService.createAddress(req.user.id, req.body);
            res.status(201).json({ success: true, data: address });
        }
        catch (error) {
            next(error);
        }
    }
    static async getAddresses(req, res, next) {
        try {
            const addresses = await address_service_1.AddressService.getAddresses(req.user.id);
            res
                .status(200)
                .json({ success: true, count: addresses.length, data: addresses });
        }
        catch (error) {
            next(error);
        }
    }
    static async updateAddress(req, res, next) {
        try {
            const { id } = req.params;
            const address = await address_service_1.AddressService.updateAddress(id, req.user.id, req.body);
            res.status(200).json({ success: true, data: address });
        }
        catch (error) {
            next(error);
        }
    }
    static async deleteAddress(req, res, next) {
        try {
            const { id } = req.params;
            await address_service_1.AddressService.deleteAddress(id, req.user.id);
            res
                .status(200)
                .json({ success: true, message: "Address deleted successfully" });
        }
        catch (error) {
            next(error);
        }
    }
}
exports.AddressController = AddressController;
//# sourceMappingURL=address.controller.js.map