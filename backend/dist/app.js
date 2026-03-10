"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const error_middleware_1 = require("./middleware/error.middleware");
const routes_1 = __importDefault(require("./routes"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
// Exclude webhook route from express.json() to preserve raw body for Stripe
app.use((req, res, next) => {
    if (req.originalUrl === "/api/payments/webhook") {
        next();
    }
    else {
        express_1.default.json()(req, res, next);
    }
});
app.get("/", (req, res) => {
    res.send("API Running 🚀");
});
app.use("/api", routes_1.default);
app.use(error_middleware_1.errorMiddleware);
exports.default = app;
//# sourceMappingURL=app.js.map