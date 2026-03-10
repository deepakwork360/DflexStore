import { prisma } from "../../config/db";

export class AddressService {
  static async createAddress(userId: string, data: any) {
    const {
      fullName,
      phone,
      address1,
      address2,
      city,
      state,
      postalCode,
      country,
      isDefault,
    } = data;

    // If this is set as default, unset other defaults for this user
    if (isDefault) {
      await prisma.address.updateMany({
        where: { userId, isDefault: true },
        data: { isDefault: false },
      });
    }

    return prisma.address.create({
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

  static async getAddresses(userId: string) {
    return prisma.address.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });
  }

  static async updateAddress(id: string, userId: string, data: any) {
    const { isDefault } = data;

    if (isDefault) {
      await prisma.address.updateMany({
        where: { userId, isDefault: true, id: { not: id } },
        data: { isDefault: false },
      });
    }

    return prisma.address.update({
      where: { id, userId },
      data,
    });
  }

  static async deleteAddress(id: string, userId: string) {
    return prisma.address.delete({
      where: { id, userId },
    });
  }
}
