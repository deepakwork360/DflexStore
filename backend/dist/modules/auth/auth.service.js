"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const db_1 = require("../../config/db");
const bcrypt_1 = require("../../utils/bcrypt");
const jwt_1 = require("../../utils/jwt");
const AppError_1 = require("../../utils/AppError");
class AuthService {
    static async register(data) {
        const { name, email, password, phone } = data;
        // Basic validation
        const errors = {};
        if (!name?.trim())
            errors.name = "Full name is required";
        if (!email?.trim())
            errors.email = "Email address is required";
        if (!password || password.length < 6)
            errors.password = "Password must be at least 6 characters long";
        if (Object.keys(errors).length > 0) {
            throw new AppError_1.AppError("Please correct the errors below", 400, errors);
        }
        // Check if user already exists
        const existingUser = await db_1.prisma.user.findFirst({
            where: {
                OR: [{ email }, ...(phone ? [{ phone }] : [])],
            },
        });
        if (existingUser) {
            if (existingUser.email === email) {
                throw new AppError_1.AppError("Email already in use", 400, {
                    email: "An account with this email already exists",
                });
            }
            if (phone && existingUser.phone === phone) {
                throw new AppError_1.AppError("Phone number already in use", 400, {
                    phone: "This phone number is already registered",
                });
            }
        }
        // Hash the password
        const hashedPassword = await (0, bcrypt_1.hashPassword)(password);
        // Create the user
        const user = await db_1.prisma.user.create({
            data: {
                name,
                email,
                phone,
                password: hashedPassword,
            },
        });
        // Generate token
        const token = (0, jwt_1.generateToken)(user.id);
        return { user, token };
    }
    static async login(data) {
        const { email, password } = data;
        // Find the user
        const user = await db_1.prisma.user.findUnique({
            where: { email },
        });
        if (!user) {
            throw new Error("Invalid credentials");
        }
        // Compare passwords
        const isValidPassword = await (0, bcrypt_1.comparePassword)(password, user.password);
        if (!isValidPassword) {
            throw new Error("Invalid credentials");
        }
        // Generate token
        const token = (0, jwt_1.generateToken)(user.id);
        return { user, token };
    }
}
exports.AuthService = AuthService;
//# sourceMappingURL=auth.service.js.map