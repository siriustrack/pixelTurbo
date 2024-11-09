import { QueryResult } from "pg";
import { pool } from "../utils/pgdb";

class PasswordResetTokenModel {
  async create(token: string, email: string, expiresAt: number): Promise<void> {
    const query = `
      INSERT INTO password_reset_tokens (token, email, expires_at)
      VALUES ($1, $2, $3)
    `;
    const values = [token, email, expiresAt];

    try {
      await pool.query(query, values);
    } catch (error) {
      console.error("Erro ao armazenar token de redefinição de senha:", error);
      throw new Error("Erro ao armazenar token de redefinição de senha");
    }
  }

  async getByToken(
    token: string
  ): Promise<{ email: string; expiresAt: number } | null> {
    const query = `SELECT email, expires_at AS "expiresAt" FROM password_reset_tokens WHERE token = $1`;

    try {
      const result: QueryResult<{ email: string; expiresAt: number }> =
        await pool.query(query, [token]);
      return result.rows[0] || null;
    } catch (error) {
      console.error("Erro ao buscar token de redefinição de senha:", error);
      throw new Error("Erro ao buscar token de redefinição de senha");
    }
  }

  async delete(token: string): Promise<void> {
    const query = `DELETE FROM password_reset_tokens WHERE token = $1`;

    try {
      await pool.query(query, [token]);
    } catch (error) {
      console.error("Erro ao deletar token de redefinição de senha:", error);
      throw new Error("Erro ao deletar token de redefinição de senha");
    }
  }
}

export default new PasswordResetTokenModel();
