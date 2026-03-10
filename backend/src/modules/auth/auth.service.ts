import { prisma } from "../../config/db";
import { hashPassword, comparePassword } from "../../utils/bcrypt";
import { generateToken } from "../../utils/jwt";
import { AppError } from "../../utils/AppError";

export class AuthService {
  static async register(data: any) {
    const { name, email, password, phone } = data;

    // Basic validation
    const errors: Record<string, string> = {};
    if (!name?.trim()) errors.name = "Full name is required";
    if (!email?.trim()) errors.email = "Email address is required";
    if (!password || password.length < 6)
      errors.password = "Password must be at least 6 characters long";

    if (Object.keys(errors).length > 0) {
      throw new AppError("Please correct the errors below", 400, errors);
    }

    // Check if user already exists
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ email }, ...(phone ? [{ phone }] : [])],
      },
    });

    if (existingUser) {
      if (existingUser.email === email) {
        throw new AppError("Email already in use", 400, {
          email: "An account with this email already exists",
        });
      }
      if (phone && existingUser.phone === phone) {
        throw new AppError("Phone number already in use", 400, {
          phone: "This phone number is already registered",
        });
      }
    }

    // Hash the password
    const hashedPassword = await hashPassword(password);

    // Create the user
    const user = await prisma.user.create({
      data: {
        name,
        email,
        phone,
        password: hashedPassword,
      },
    });

    // Generate token
    const token = generateToken(user.id);

    return { user, token };
  }

  static async login(data: any) {
    const { email, password } = data;

    // Find the user
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new Error("Invalid credentials");
    }

    // Compare passwords
    const isValidPassword = await comparePassword(password, user.password);

    if (!isValidPassword) {
      throw new Error("Invalid credentials");
    }

    // Generate token
    const token = generateToken(user.id);

    return { user, token };
  }
}
