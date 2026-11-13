import pool from "../config/database";
import { Lookup } from "../types/lookup.types";
import { CUSTOM_QUERIES } from "../config/queries/custom.queries";

export class LookupService {
    constructor(private table: string) {}


    async getAll(
      filters?: {
          gender?: string;
          search?: string;
      },
      userId: string | null = null
    ): Promise<Lookup[]> {

        let query =
          CUSTOM_QUERIES[this.table]?.getAll ??
          `SELECT * FROM ${this.table} ORDER BY name`;

        const params: (string | null)[] = [];

        if (this.table === "products") {
            // $1 is reserved for the authenticated user ID
            params.push(userId);

            const conditions: string[] = [];

            if (filters?.gender?.trim()) {
                params.push(filters.gender.trim());

                conditions.push(
                  `LOWER(p.gender->>'name') = LOWER($${params.length})`
                );
            }

            if (filters?.search?.trim()) {
                params.push(`%${filters.search.trim()}%`);

                conditions.push(
                  `p.name ILIKE $${params.length}`
                );
            }

            if (conditions.length > 0) {
                query = `
                    SELECT * FROM (
                                      ${query}
                                      ) AS p
                    WHERE ${conditions.join(" AND ")}
                `;
            }
        }
        const result = await pool.query(query, params);
        return result.rows;
    }

    async getById(
      id: string,
      userId: string | null = null
    ): Promise<Lookup | null> {

        const query =
          CUSTOM_QUERIES[this.table]?.getById ??
          `SELECT * FROM ${this.table} WHERE id = $1`;

        const params =
          this.table === "products"
            ? [id, userId]
            : [id];

        const result = await pool.query(query, params);
        return result.rows[0] ?? null;
    }


    async create(name: string): Promise<Lookup> {
        const result = await pool.query<Lookup>(
            `INSERT INTO ${this.table} (name)
       VALUES ($1) RETURNING *`,
            [name]
        );

        return result.rows[0];
    }

    async update(
        id: string,
        name: string
    ): Promise<Lookup | null> {
        const result = await pool.query<Lookup>(
            `UPDATE ${this.table}
       SET name = $1
       WHERE id = $2
       RETURNING *`,
            [name, id]
        );

        return result.rows[0] || null;
    }

    async delete(id: string): Promise<boolean> {
        const result = await pool.query(
            `DELETE FROM ${this.table} WHERE id = $1`,
            [id]
        );

        return (result.rowCount ?? 0) > 0;
    }
}
