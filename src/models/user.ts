import { Pool, QueryResult } from "pg";
import { User } from "../types";
import { v4 as uuidv4 } from "uuid";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

class UserModel {
  async create(user: User): Promise<User> {
    const { name, email, phone, password } = user;
    const id = uuidv4();
    const created_at = new Date();
    const updated_at = new Date();

    const query = `
      INSERT INTO users (id, name, email, phone, password, created_at, updated_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *
    `;

    const values = [id, name, email, phone, password, created_at, updated_at];

    try {
      const result: QueryResult<User> = await pool.query(query, values);
      return result.rows[0];
    } catch (error: any) {
      if (error.code === "23505" && error.constraint === "users_email_key") {
        // Verifica se o erro é de email duplicado
        console.error("Email duplicado:", error);
        throw new Error("Este email já está cadastrado."); // Lança um erro específico
      }
      console.error("Erro ao criar usuário:", error);
      throw new Error("Erro ao criar usuário."); // Lança um erro genérico para outros erros de banco
    }
  }

  async getAll(): Promise<User[]> {
    const query = "SELECT * FROM users;";

    try {
      const result: QueryResult<User> = await pool.query(query);
      return result.rows;
    } catch (error) {
      console.error("Erro ao buscar todos os usuários:", error);
      throw new Error("Erro ao buscar todos os usuários");
    }
  }

  async getById(id: string): Promise<User | null> {
    const query = `SELECT * FROM users WHERE id = $1`;

    try {
      const result: QueryResult<User> = await pool.query(query, [id]);
      return result.rows[0] || null;
    } catch (error) {
      console.error("Erro ao buscar usuário por ID:", error);
      throw new Error("Erro ao buscar usuário por ID");
    }
  }

  async getByEmail(email: string): Promise<User | null> {
    const query = `SELECT * FROM users WHERE email = $1`;

    try {
      const result: QueryResult<User> = await pool.query(query, [email]);
      return result.rows[0] || null;
    } catch (error) {
      console.error("Erro ao buscar usuário por email:", error);
      throw new Error("Erro ao buscar usuário por email");
    }
  }

  async update(id: string, user: User): Promise<User | null> {
    const { name, email, phone, password } = user;
    const updated_at = new Date();
    const query = `
      UPDATE users
      SET name = $1, email = $2, phone = $3, password = $4, updated_at = $5
      WHERE id = $6
      RETURNING *;
    `;
    const values = [name, email, phone, password, updated_at, id];

    try {
      const result: QueryResult<User> = await pool.query(query, values);
      return result.rows[0] || null;
    } catch (error) {
      console.error("Erro ao atualizar usuário:", error);
      throw new Error("Erro ao atualizar usuário");
    }
  }

  async delete(id: string): Promise<boolean> {
    const query = "DELETE FROM users WHERE id = $1;";

    try {
      await pool.query(query, [id]);
      return true;
    } catch (error) {
      console.error("Erro ao deletar usuário:", error);
      throw new Error("Erro ao deletar usuário");
    }
  }
}

export default new UserModel();
