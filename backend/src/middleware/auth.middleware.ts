import { Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { AuthRequest, UserRole } from "../types/auth.types";
import { AuthService } from "../services/auth.service";

const authService = new AuthService();

export async function authenticate(
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  const authorization = req.headers.authorization;

  if (!authorization?.startsWith("Bearer")) {
    res.status(401).json({
      message: "Authentication required"
    });
    return;
  }

  const token = authorization.slice(7);
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    res.status(500).json({
      message: "Authentication is not configured"
    });
    return;
  }

  try {
    const decoded = jwt.verify(token, secret, {
      algorithms: ["HS256"]
    }) as JwtPayload;

    if (typeof decoded.sub !== "string") {
      res.status(401).json({
        message: "Invalid token"
      });
      return;
    }

    const user = await authService.getById(decoded.sub);

    if (!user) {
      res.status(401).json({
        message: "User no longer exists"
      });
      return;
    }

    req.user = user;
    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      res.status(401).json({
        message: "Invalid or expired token"
      });
      return;
    }

    next(error);
  }
}

export function authorize(...roles: UserRole[]) {
  return (
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ): void => {
    if (!req.user) {
      res.status(401).json({
        message: "Authentication required"
      });
      return;
    }

    if (!roles.includes(req.user.role)) {
      res.status(403).json({
        message: "Access denied"
      });
      return;
    }

    next();
  };
}
