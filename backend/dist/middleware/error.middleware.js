"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorMiddleware = void 0;
const errorMiddleware = (err, req, res, next) => {
    console.error(err);
    const status = err.status || 500;
    const message = err.message || "Internal Server Error";
    const errors = err.errors || undefined;
    res.status(status).json({
        success: false,
        message,
        errors,
    });
};
exports.errorMiddleware = errorMiddleware;
//# sourceMappingURL=error.middleware.js.map