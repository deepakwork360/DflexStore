import express from "express";
import cors from "cors";

import { errorMiddleware } from "./middleware/error.middleware";
import mainRouter from "./routes";

const app = express();

app.use(cors());

// Exclude webhook route from express.json() to preserve raw body for Stripe
app.use((req, res, next) => {
  if (req.originalUrl === "/api/payments/webhook") {
    next();
  } else {
    express.json()(req, res, next);
  }
});

app.get("/", (req, res) => {
  res.send("API Running 🚀");
});

app.use("/api", mainRouter);

app.use(errorMiddleware);

export default app;
