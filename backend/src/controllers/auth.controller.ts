
import { Request, Response } from "express";
import { AuthRequest } from "../types/auth.types";
import { AuthService } from "../services/auth.service";

const service = new AuthService();

export const AuthController = {
  register: async (req: Request, res: Response) => {
    const {
      first_name,
      last_name,
      email,
      password
    } = req.body ?? {};

    if (
      [first_name, last_name, email, password].some(
        value => typeof value !== "string" ||
          !value.trim()
      )
    ) {
      res.status(400).json({
        message: "All required fields must be provided"
      });
      return;
    }

    if (
      first_name.trim().length > 100 ||
      last_name.trim().length > 100 ||
      email.trim().length > 255 ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()) ||
      password.length < 8 ||
      Buffer.byteLength(password, "utf8") > 72
    ) {
      res.status(400).json({
        message: "Invalid email, name, or password length"
      });
      return;
    }

    try {
      const result = await service.register({
        first_name,
        last_name,
        email,
        password
      });

      res.status(201).json(result);
    } catch (error: any) {
      if (error.code === "23505") {
        res.status(409).json({
          message: "Email already registered"
        });
        return;
      }

      console.error(error);
      res.status(500).json({
        message: "Internal server error"
      });
    }
  },

  login: async (req: Request, res: Response) => {
    const { email, password } = req.body ?? {};

    if (
      typeof email !== "string" ||
      typeof password !== "string" ||
      !email.trim() ||
      !password
    ) {
      res.status(400).json({
        message: "Email and password are required"
      });
      return;
    }

    try {
      const result = await service.login(email, password);

      if (!result) {
        res.status(401).json({
          message: "Invalid email or password"
        });
        return;
      }

      res.status(200).json(result);
    } catch (error) {
      console.error(error);
      res.status(500).json({
        message: "Internal server error"
      });
    }
  },

  me: (req: AuthRequest, res: Response) => {
    res.status(200).json(req.user);
  },

  logout: (_req: Request, res: Response) => {
    res.status(200).json({
      message: "Discard your access token to log out"
    });
  }
};
