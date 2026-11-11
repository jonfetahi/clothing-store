
import { Request } from "express";

export type UserRole =
  | "Admin"
  | "Advanced User"
  | "Simple User";

export interface AuthUser {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  role: UserRole;
}

export interface AuthRequest extends Request {
  user?: AuthUser;
}
