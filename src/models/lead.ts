import { QueryResult } from "pg";
import { pool } from "../utils/pgdb";
import { Lead } from "../types";
import { v4 as uuidv4 } from "uuid";

class LeadModel {
  async create(lead: Lead): Promise<Lead> {
    const {
      domain_id,
      name,
      first_name,
      last_name,
      email,
      phone,
      ip,
      user_agent,
      city,
      state,
      zipcode,
      country_name,
      country_code,
      fbc,
      fbp,
      utm_source,
      utm_medium,
      utm_campaign,
      utm_id,
      utm_term,
      utm_content,
      first_utm_source,
      first_utm_medium,
      first_utm_campaign,
      first_utm_id,
      first_utm_term,
      first_utm_content,
    } = lead;
    const id = uuidv4();
    const created_at = new Date();
    const updated_at = new Date();

    const query = `
      INSERT INTO leads (id, domain_id, name, first_name, last_name, email, phone, ip, user_agent, city, state, zipcode, country_name, country_code, fbc, fbp, utm_source, utm_medium, utm_campaign, utm_id, utm_term, utm_content, first_utm_source, first_utm_medium, first_utm_campaign, first_utm_id, first_utm_term, first_utm_content, created_at, updated_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26, $27, $28, $29, $30)
      RETURNING *
    `;

    const values = [
      id,
      domain_id,
      name,
      first_name,
      last_name,
      email,
      phone,
      ip,
      user_agent,
      city,
      state,
      zipcode,
      country_name,
      country_code,
      fbc,
      fbp,
      utm_source,
      utm_medium,
      utm_campaign,
      utm_id,
      utm_term,
      utm_content,
      first_utm_source,
      first_utm_medium,
      first_utm_campaign,
      first_utm_id,
      first_utm_term,
      first_utm_content,
      created_at,
      updated_at,
    ];

    try {
      const result: QueryResult<Lead> = await pool.query(query, values);
      return result.rows[0];
    } catch (error: any) {
      console.error("Erro ao criar lead:", error);
      throw new Error("Erro ao criar lead.");
    }
  }

  async getAll(): Promise<Lead[]> {
    const query = "SELECT * FROM leads;";

    try {
      const result: QueryResult<Lead> = await pool.query(query);
      return result.rows;
    } catch (error) {
      console.error("Erro ao buscar todos os leads:", error);
      throw new Error("Erro ao buscar todos os leads");
    }
  }

  async getById(id: string): Promise<Lead | null> {
    const query = `SELECT * FROM leads WHERE id = $1`;

    try {
      const result: QueryResult<Lead> = await pool.query(query, [id]);
      return result.rows[0] || null;
    } catch (error) {
      console.error("Erro ao buscar lead por ID:", error);
      throw new Error("Erro ao buscar lead por ID");
    }
  }

  async getByDomainId(domainId: string): Promise<Lead[]> {
    const query = `SELECT * FROM leads WHERE domain_id = $1`;

    try {
      const result: QueryResult<Lead> = await pool.query(query, [domainId]);
      return result.rows;
    } catch (error) {
      console.error("Erro ao buscar leads por ID do domínio:", error);
      throw new Error("Erro ao buscar leads por ID do domínio");
    }
  }

  async update(id: string, lead: Lead): Promise<Lead | null> {
    const {
      domain_id,
      name,
      first_name,
      last_name,
      email,
      phone,
      ip,
      user_agent,
      city,
      state,
      zipcode,
      country_name,
      country_code,
      fbc,
      fbp,
      utm_source,
      utm_medium,
      utm_campaign,
      utm_id,
      utm_term,
      utm_content,
      first_utm_source,
      first_utm_medium,
      first_utm_campaign,
      first_utm_id,
      first_utm_term,
      first_utm_content,
    } = lead;
    const updated_at = new Date();
    const query = `
      UPDATE leads
      SET domain_id = $1, name = $2, first_name = $3, last_name = $4, email = $5, phone = $6, ip = $7, user_agent = $8, city = $9, state = $10, zipcode = $11, country_name = $12, country_code = $13, fbc = $14, fbp = $15, utm_source = $16, utm_medium = $17, utm_campaign = $18, utm_id = $19, utm_term = $20, utm_content = $21, first_utm_source = $22, first_utm_medium = $23, first_utm_campaign = $24, first_utm_id = $25, first_utm_term = $26, first_utm_content = $27, updated_at = $28
      WHERE id = $29
      RETURNING *;
    `;
    const values = [
      domain_id,
      name,
      first_name,
      last_name,
      email,
      phone,
      ip,
      user_agent,
      city,
      state,
      zipcode,
      country_name,
      country_code,
      fbc,
      fbp,
      utm_source,
      utm_medium,
      utm_campaign,
      utm_id,
      utm_term,
      utm_content,
      first_utm_source,
      first_utm_medium,
      first_utm_campaign,
      first_utm_id,
      first_utm_term,
      first_utm_content,
      updated_at,
      id,
    ];

    try {
      const result: QueryResult<Lead> = await pool.query(query, values);
      return result.rows[0] || null;
    } catch (error) {
      console.error("Erro ao atualizar lead:", error);
      throw new Error("Erro ao atualizar lead");
    }
  }

  async delete(id: string): Promise<boolean> {
    const query = "DELETE FROM leads WHERE id = $1;";

    try {
      await pool.query(query, [id]);
      return true;
    } catch (error) {
      console.error("Erro ao deletar lead:", error);
      throw new Error("Erro ao deletar lead");
    }
  }
}

export default new LeadModel();
