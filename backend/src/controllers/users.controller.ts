
import { Request, Response } from "express";
// @ts-ignore
import { validate as isUUID } from 'uuid';
import pool from "../config/database";

const USER_FIELDS = `
    u.id,
    u.first_name,
    u.last_name,
    u.email,
    u.phone,
    u.address,
    r.name AS role,
    u.created_at
`;

export const UsersController = {
  getAll: async (_req: Request, res: Response) => {
    try {
      const result = await pool.query(`
                SELECT ${USER_FIELDS}
                FROM users u
                JOIN roles r ON r.id = u.role_id
                ORDER BY u.created_at DESC
            `);

      res.status(200).json(result.rows);
    } catch (error) {
      console.error(error);
      res.status(500).json({
        message: "Internal server error"
      });
    }
  },

  getById: async (req: Request, res: Response) => {
    const id = String(req.params.id);

    if (!isUUID(id)) {
      res.status(400).json({ message: "Invalid user ID" });
      return;
    }

    try {
      const result = await pool.query(`
                SELECT ${USER_FIELDS}
                FROM users u
                JOIN roles r ON r.id = u.role_id
                WHERE u.id = $1
            `, [id]);

      if (!result.rows[0]) {
        res.status(404).json({ message: "User not found" });
        return;
      }

      res.status(200).json(result.rows[0]);
    } catch (error) {
      console.error(error);
      res.status(500).json({
        message: "Internal server error"
      });
    }
  },

  update: async (req: Request, res: Response) => {
    const id = String(req.params.id);
    const { first_name, last_name, phone, address } =
    req.body ?? {};

    if (
      !isUUID(id) ||
      typeof first_name !== "string" ||
      !first_name.trim() ||
      first_name.trim().length > 100 ||
      typeof last_name !== "string" ||
      !last_name.trim() ||
      last_name.trim().length > 100 ||
      (phone != null && typeof phone !== "string") ||
      (address != null && typeof address !== "string")
    ) {
      res.status(400).json({
        message: "Invalid user information"
      });
      return;
    }

    try {
      const result = await pool.query(`
                UPDATE users
                SET first_name = $1,
                    last_name = $2,
                    phone = $3,
                    address = $4,
                    updated_at = NOW()
                WHERE id = $5
                RETURNING id
            `, [
        first_name.trim(),
        last_name.trim(),
        phone ?? null,
        address ?? null,
        id
      ]);

      if (!result.rows[0]) {
        res.status(404).json({ message: "User not found" });
        return;
      }

      const updated = await pool.query(`
                SELECT ${USER_FIELDS}
                FROM users u
                JOIN roles r ON r.id = u.role_id
                WHERE u.id = $1
            `, [id]);

      res.status(200).json(updated.rows[0]);
    } catch (error) {
      console.error(error);
      res.status(500).json({
        message: "Internal server error"
      });
    }
  },

  updateRole: async (req: Request, res: Response) => {
    const id = String(req.params.id);
    const { role } = req.body ?? {};

    const allowedRoles = [
      "Admin",
      "Advanced User",
      "Simple User"
    ];

    if (!isUUID(id) || !allowedRoles.includes(role)) {
      res.status(400).json({
        message: "Invalid user ID or role"
      });
      return;
    }

    try {
      const result = await pool.query(`
                UPDATE users u
                SET role_id = r.id,
                    updated_at = NOW()
                FROM roles r
                WHERE u.id = $1
                  AND r.name = $2
                RETURNING u.id
            `, [id, role]);

      if (!result.rows[0]) {
        res.status(404).json({
          message: "User or role not found"
        });
        return;
      }

      res.status(200).json({
        message: "User role updated",
        user_id: id,
        role
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        message: "Internal server error"
      });
    }
  }
};
