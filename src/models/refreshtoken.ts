import { QueryResult } from "pg";
import { pool } from "../utils/pgdb";

class RefreshTokenModel {
  async create(
    userId: string,
    refreshToken: string,
    expiresAt: number
  ): Promise<void> {
    const query = `
      INSERT INTO refresh_tokens (user_id, refresh_token, expires_at)
      VALUES ($1, $2, $3)
    `;
    const values = [userId, refreshToken, expiresAt];

    try {
      await pool.query(query, values);
    } catch (error) {
      console.error("Erro ao armazenar refresh token:", error);
      throw new Error("Erro ao armazenar refresh token");
    }
  }

  async getByToken(
    refreshToken: string
  ): Promise<{ userId: string; expiresAt: number } | null> {
    const query = `SELECT user_id AS "userId", expires_at AS "expiresAt" FROM refresh_tokens WHERE refresh_token = $1`;

    try {
      const result: QueryResult<{ userId: string; expiresAt: number }> =
        await pool.query(query, [refreshToken]);
      return result.rows[0] || null;
    } catch (error) {
      console.error("Erro ao buscar refresh token:", error);
      throw new Error("Erro ao buscar refresh token");
    }
  }

  async delete(refreshToken: string): Promise<void> {
    const query = `DELETE FROM refresh_tokens WHERE refresh_token = $1`;

    try {
      await pool.query(query, [refreshToken]);
    } catch (error) {
      console.error("Erro ao deletar refresh token:", error);
      throw new Error("Erro ao deletar refresh token");
    }
  }
}

export default new RefreshTokenModel();
