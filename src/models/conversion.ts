import { Pool, QueryResult } from "pg";
import { Conversion } from "../types";
import { v4 as uuidv4 } from "uuid";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

class ConversionModel {
  async create(conversion: Conversion): Promise<Conversion> {
    const {
      domain_id,
      title,
      scope,
      scope_value,
      trigger,
      trigger_value,
      event_name,
      product_name,
      product_id,
      offer_ids,
      product_value,
      currency,
    } = conversion;
    const id = uuidv4();
    const created_at = new Date();
    const updated_at = new Date();
    const active = true;

    const query = `
      INSERT INTO conversions (id, domain_id, title, scope, scope_value, trigger, trigger_value, event_name, product_name, product_id, offer_ids, product_value, currency, created_at, updated_at, active)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)
      RETURNING *
    `;

    const values = [
      id,
      domain_id,
      title,
      scope,
      scope_value,
      trigger,
      trigger_value,
      event_name,
      product_name,
      product_id,
      offer_ids,
      product_value,
      currency,
      created_at,
      updated_at,
      active,
    ];

    try {
      const result: QueryResult<Conversion> = await pool.query(query, values);
      return result.rows[0];
    } catch (error: any) {
      console.error("Erro ao criar conversão:", error);
      throw new Error("Erro ao criar conversão.");
    }
  }

  async getAll(): Promise<Conversion[]> {
    const query = "SELECT * FROM conversions;";

    try {
      const result: QueryResult<Conversion> = await pool.query(query);
      return result.rows;
    } catch (error) {
      console.error("Erro ao buscar todas as conversões:", error);
      throw new Error("Erro ao buscar todas as conversões");
    }
  }

  async getById(id: string): Promise<Conversion | null> {
    const query = `SELECT * FROM conversions WHERE id = $1`;

    try {
      const result: QueryResult<Conversion> = await pool.query(query, [id]);
      return result.rows[0] || null;
    } catch (error) {
      console.error("Erro ao buscar conversão por ID:", error);
      throw new Error("Erro ao buscar conversão por ID");
    }
  }

  async getByDomainId(domainId: string): Promise<Conversion[]> {
    const query = `SELECT * FROM conversions WHERE domain_id = $1`;

    try {
      const result: QueryResult<Conversion> = await pool.query(query, [
        domainId,
      ]);
      return result.rows;
    } catch (error) {
      console.error("Erro ao buscar conversões por ID do domínio:", error);
      throw new Error("Erro ao buscar conversões por ID do domínio");
    }
  }

  async update(id: string, conversion: Conversion): Promise<Conversion | null> {
    const {
      domain_id,
      title,
      scope,
      scope_value,
      trigger,
      trigger_value,
      event_name,
      product_name,
      product_id,
      offer_ids,
      product_value,
      currency,
      active,
    } = conversion;
    const updated_at = new Date();
    const query = `
      UPDATE conversions
      SET domain_id = $1, title = $2, scope = $3, scope_value = $4, trigger = $5, trigger_value = $6, event_name = $7, product_name = $8, product_id = $9, offer_ids = $10, product_value = $11, currency = $12, updated_at = $13, active = $14
      WHERE id = $15
      RETURNING *;
    `;
    const values = [
      domain_id,
      title,
      scope,
      scope_value,
      trigger,
      trigger_value,
      event_name,
      product_name,
      product_id,
      offer_ids,
      product_value,
      currency,
      updated_at,
      active,
      id,
    ];

    try {
      const result: QueryResult<Conversion> = await pool.query(query, values);
      return result.rows[0] || null;
    } catch (error) {
      console.error("Erro ao atualizar conversão:", error);
      throw new Error("Erro ao atualizar conversão");
    }
  }

  async delete(id: string): Promise<boolean> {
    const query = "DELETE FROM conversions WHERE id = $1;";

    try {
      await pool.query(query, [id]);
      return true;
    } catch (error) {
      console.error("Erro ao deletar conversão:", error);
      throw new Error("Erro ao deletar conversão");
    }
  }
}

export default new ConversionModel();
