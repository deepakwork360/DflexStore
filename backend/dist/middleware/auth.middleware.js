"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.protect = void 0;
const jwt_1 = require("../utils/jwt");
const db_1 = require("../config/db");
const protect = async (req, res, next) => {
    try {
        let token;
        if (req.headers.authorization &&
            req.headers.authorization.startsWith("Bearer")) {
            token = req.headers.authorization.split(" ")[1];
        }
        if (!token) {
            res
                .status(401)
                .json({ success: false, message: "Not authorized, no token" });
            return;
        }
        const decoded = (0, jwt_1.verifyToken)(token);
        const user = await db_1.prisma.user.findUnique({
            where: { id: decoded.userId },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
            },
        });
        if (!user) {
            res
                .status(401)
                .json({ success: false, message: "Not authorized, user not found" });
            return;
        }
        req.user = user;
        next();
    }
    catch (error) {
        if (error.name === "TokenExpiredError") {
            res
                .status(401)
                .json({ success: false, message: "Not authorized, token expired" });
            return;
        }
        res
            .status(401)
            .json({ success: false, message: "Not authorized, token failed" });
    }
};
exports.protect = protect;
//# sourceMappingURL=auth.middleware.js.map