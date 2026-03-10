import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/jwt";
import { prisma } from "../config/db";

declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

export const protect = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    let token: string | undefined;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      res
        .status(401)
        .json({ success: false, message: "Not authorized, no token" });
      return;
    }

    const decoded = verifyToken(token) as { userId: string };

    const user = await prisma.user.findUnique({
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
  } catch (error: any) {
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
