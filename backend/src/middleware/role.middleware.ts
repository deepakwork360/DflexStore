import { Request, Response, NextFunction } from "express";

export const authorizeRoles = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user || !roles.includes(req.user.role)) {
      res.status(403).json({
        success: false,
        message: `Role (${req.user?.role || "UNKNOWN"}) is not allowed to access this resource`,
      });
      return;
    }
    next();
  };
};
