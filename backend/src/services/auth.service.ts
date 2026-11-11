
import pool from "../config/database";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { AuthUser } from "../types/auth.types";

type RegisterDTO = {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
};

type UserRow = AuthUser & {
  password_hash: string;
};

const PUBLIC_USER_FIELDS = `
    u.id,
    u.first_name,
    u.last_name,
    u.email,
    r.name AS role
`;

export class AuthService {
  private generateToken(userId: string): string {
    const secret = process.env.JWT_SECRET;

    if (!secret) {
      throw new Error("JWT_SECRET is not configured");
    }

    return jwt.sign(
      { sub: userId },
      secret,
      {
        expiresIn: "15m",
        algorithm: "HS256"
      }
    );
  }

  async register(data: RegisterDTO) {
    const passwordHash = await bcrypt.hash(
      data.password,
      12
    );

    const result = await pool.query<AuthUser>(`
            INSERT INTO users (
                first_name,
                last_name,
                email,
                password_hash,
                role_id
            )
            SELECT $1, $2, $3, $4, r.id
            FROM roles r
            WHERE r.name = 'Simple User'
            RETURNING
                id, first_name, last_name, email
        `, [
      data.first_name.trim(),
      data.last_name.trim(),
      data.email.trim().toLowerCase(),
      passwordHash
    ]);

    if (!result.rows[0]) {
      throw new Error("Simple User role is missing");
    }

    const user = await this.getById(result.rows[0].id);

    if (!user) {
      throw new Error("Registered user not found");
    }

    return {
      user,
      token: this.generateToken(user.id)
    };
  }

  async login(email: string, password: string) {
    const result = await pool.query<UserRow>(`
            SELECT
                ${PUBLIC_USER_FIELDS},
                u.password_hash
            FROM users u
            JOIN roles r ON r.id = u.role_id
            WHERE LOWER(u.email) = LOWER($1)
        `, [email.trim()]);

    const user = result.rows[0];

    if (!user) {
      return null;
    }

    const validPassword = await bcrypt.compare(
      password,
      user.password_hash
    );

    if (!validPassword) {
      return null;
    }

    const { password_hash, ...publicUser } = user;

    return {
      user: publicUser,
      token: this.generateToken(user.id)
    };
  }

  async getById(id: string): Promise<AuthUser | null> {
    const result = await pool.query<AuthUser>(`
            SELECT ${PUBLIC_USER_FIELDS}
            FROM users u
            JOIN roles r ON r.id = u.role_id
            WHERE u.id = $1
        `, [id]);

    return result.rows[0] ?? null;
  }
}
