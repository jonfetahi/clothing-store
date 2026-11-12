
import pool from "../config/database";
import crypto from "crypto";

export class RefreshTokenService {
  private hash(token: string) {
    return crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");
  }

  async create(userId: string) {
    const token = crypto.randomBytes(32).toString("hex");
    const tokenHash = this.hash(token);

    await pool.query(`
            INSERT INTO refresh_tokens (
                user_id, token_hash, expires_at
            )
            VALUES ($1, $2, NOW() + INTERVAL '7 days')
        `, [userId, tokenHash]);

    return token;
  }

  async rotate(token: string) {
    const tokenHash = this.hash(token);
    const newToken = crypto.randomBytes(32).toString("hex");
    const newHash = this.hash(newToken);

    const result = await pool.query(`
            UPDATE refresh_tokens
            SET token_hash = $2,
                expires_at = NOW() + INTERVAL '7 days'
            WHERE token_hash = $1
              AND revoked_at IS NULL
              AND expires_at > NOW()
            RETURNING user_id
        `, [tokenHash, newHash]);

    if (!result.rows[0]) {
      return null;
    }

    return {
      userId: result.rows[0].user_id as string,
      token: newToken
    };
  }

  async revoke(token: string) {
    await pool.query(`
            UPDATE refresh_tokens
            SET revoked_at = NOW()
            WHERE token_hash = $1
              AND revoked_at IS NULL
        `, [this.hash(token)]);
  }
}
