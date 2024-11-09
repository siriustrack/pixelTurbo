import { Pool, QueryResult } from "pg";
import { Domain } from "../types";
import { v4 as uuidv4 } from "uuid";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

class DomainModel {
  async create(domain: Domain): Promise<Domain> {
    const { user_id, domain_name } = domain;
    const id = uuidv4();
    const created_at = new Date();
    const updated_at = new Date();

    const query = `
      INSERT INTO domains (id, user_id, domain_name, created_at, updated_at)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `;

    const values = [id, user_id, domain_name, created_at, updated_at];

    try {
      const result: QueryResult<Domain> = await pool.query(query, values);
      return result.rows[0];
    } catch (error: any) {
      if (
        error.code === "23505" &&
        error.constraint === "domains_domain_name_key"
      ) {
        console.error("Domínio duplicado:", error);
        throw new Error("Este domínio já está cadastrado.");
      }
      console.error("Erro ao criar domínio:", error);
      throw new Error("Erro ao criar domínio.");
    }
  }

  async getAll(): Promise<Domain[]> {
    const query = "SELECT * FROM domains;";

    try {
      const result: QueryResult<Domain> = await pool.query(query);
      return result.rows;
    } catch (error) {
      console.error("Erro ao buscar todos os domínios:", error);
      throw new Error("Erro ao buscar todos os domínios");
    }
  }

  async getById(id: string): Promise<Domain | null> {
    const query = `SELECT * FROM domains WHERE id = $1`;

    try {
      const result: QueryResult<Domain> = await pool.query(query, [id]);
      return result.rows[0] || null;
    } catch (error) {
      console.error("Erro ao buscar domínio por ID:", error);
      throw new Error("Erro ao buscar domínio por ID");
    }
  }

  async getByUserId(userId: string): Promise<Domain[]> {
    const query = `SELECT * FROM domains WHERE user_id = $1`;

    try {
      const result: QueryResult<Domain> = await pool.query(query, [userId]);
      return result.rows;
    } catch (error) {
      console.error("Erro ao buscar domínios por ID do usuário:", error);
      throw new Error("Erro ao buscar domínios por ID do usuário");
    }
  }

  async getByDomainName(domainName: string): Promise<Domain | null> {
    const query = `SELECT * FROM domains WHERE domain_name = $1`;

    try {
      const result: QueryResult<Domain> = await pool.query(query, [domainName]);
      return result.rows[0] || null;
    } catch (error) {
      console.error("Erro ao buscar domínio por nome:", error);
      throw new Error("Erro ao buscar domínio por nome");
    }
  }

  async update(id: string, domain: Domain): Promise<Domain | null> {
    const { user_id, domain_name } = domain;
    const updated_at = new Date();
    const query = `
      UPDATE domains
      SET user_id = $1, domain_name = $2, updated_at = $3
      WHERE id = $4
      RETURNING *;
    `;
    const values = [user_id, domain_name, updated_at, id];

    try {
      const result: QueryResult<Domain> = await pool.query(query, values);
      return result.rows[0] || null;
    } catch (error) {
      console.error("Erro ao atualizar domínio:", error);
      throw new Error("Erro ao atualizar domínio");
    }
  }

  async delete(id: string): Promise<boolean> {
    const query = "DELETE FROM domains WHERE id = $1;";

    try {
      await pool.query(query, [id]);
      return true;
    } catch (error) {
      console.error("Erro ao deletar domínio:", error);
      throw new Error("Erro ao deletar domínio");
    }
  }
}

export default new DomainModel();
