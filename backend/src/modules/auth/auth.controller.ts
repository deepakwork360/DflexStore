import { Request, Response, NextFunction } from "express";
import { AuthService } from "./auth.service";

export class AuthController {
  static async register(req: Request, res: Response, next: NextFunction) {
    try {
      const { user, token } = await AuthService.register(req.body);

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
    } catch (error: any) {
      // Pass the error to the global error handler
      next(error);
    }
  }

  static async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { user, token } = await AuthService.login(req.body);

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
    } catch (error: any) {
      next(error);
    }
  }
}
