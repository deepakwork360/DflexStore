"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddressService = void 0;
const db_1 = require("../../config/db");
class AddressService {
    static async createAddress(userId, data) {
        const { fullName, phone, address1, address2, city, state, postalCode, country, isDefault, } = data;
        // If this is set as default, unset other defaults for this user
        if (isDefault) {
            await db_1.prisma.address.updateMany({
                where: { userId, isDefault: true },
                data: { isDefault: false },
            });
        }
        return db_1.prisma.address.create({
            data: {
                userId,
                fullName,
                phone,
                address1,
                address2,
                city,
                state,
                postalCode,
                country,
                isDefault: isDefault || false,
            },
        });
    }
    static async getAddresses(userId) {
        return db_1.prisma.address.findMany({
            where: { userId },
            orderBy: { createdAt: "desc" },
        });
    }
    static async updateAddress(id, userId, data) {
        const { isDefault } = data;
        if (isDefault) {
            await db_1.prisma.address.updateMany({
                where: { userId, isDefault: true, id: { not: id } },
                data: { isDefault: false },
            });
        }
        return db_1.prisma.address.update({
            where: { id, userId },
            data,
        });
    }
    static async deleteAddress(id, userId) {
        return db_1.prisma.address.delete({
            where: { id, userId },
        });
    }
}
exports.AddressService = AddressService;
//# sourceMappingURL=address.service.js.map