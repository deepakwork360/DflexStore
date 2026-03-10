"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const auth_service_1 = require("./auth.service");
class AuthController {
    static async register(req, res, next) {
        try {
            const { user, token } = await auth_service_1.AuthService.register(req.body);
            // Don't send the password back
            const { password, ...userWithoutPassword } = user;
            res.status(201).json({
                success: true,
                message: "User registered successfully",
                data: {
                    user: userWithoutPassword,
                    token,
                },
            });
        }
        catch (error) {
            // Pass the error to the global error handler
            next(error);
        }
    }
    static async login(req, res, next) {
        try {
            const { user, token } = await auth_service_1.AuthService.login(req.body);
            // Don't send the password back
            const { password, ...userWithoutPassword } = user;
            res.status(200).json({
                success: true,
                message: "Login successful",
                data: {
                    user: userWithoutPassword,
                    token,
                },
            });
        }
        catch (error) {
            next(error);
        }
    }
}
exports.AuthController = AuthController;
//# sourceMappingURL=auth.controller.js.map