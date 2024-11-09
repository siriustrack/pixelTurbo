import { Pool, QueryResult } from "pg";
import { Event } from "../types";
import { v4 as uuidv4 } from "uuid";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

class EventModel {
  async create(event: Event): Promise<Event> {
    const {
      lead_id,
      conversion_id,
      domain_id,
      event_name,
      event_time,
      event_source_url,
      content_ids,
      currency,
      value,
      facebook_request,
      facebook_response,
    } = event;
    const id = uuidv4();
    const created_at = new Date();

    const query = `
      INSERT INTO events (id, lead_id, conversion_id, domain_id, event_name, event_time, event_source_url, content_ids, currency, value, facebook_request, facebook_response, created_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
      RETURNING *
    `;

    const values = [
      id,
      lead_id,
      conversion_id,
      domain_id,
      event_name,
      event_time,
      event_source_url,
      content_ids,
      currency,
      value,
      facebook_request,
      facebook_response,
      created_at,
    ];

    try {
      const result: QueryResult<Event> = await pool.query(query, values);
      return result.rows[0];
    } catch (error: any) {
      console.error("Erro ao criar evento:", error);
      throw new Error("Erro ao criar evento.");
    }
  }

  async getAll(): Promise<Event[]> {
    const query = "SELECT * FROM events;";

    try {
      const result: QueryResult<Event> = await pool.query(query);
      return result.rows;
    } catch (error) {
      console.error("Erro ao buscar todos os eventos:", error);
      throw new Error("Erro ao buscar todos os eventos");
    }
  }

  async getById(id: string): Promise<Event | null> {
    const query = `SELECT * FROM events WHERE id = $1`;

    try {
      const result: QueryResult<Event> = await pool.query(query, [id]);
      return result.rows[0] || null;
    } catch (error) {
      console.error("Erro ao buscar evento por ID:", error);
      throw new Error("Erro ao buscar evento por ID");
    }
  }

  async getByDomainId(domainId: string): Promise<Event[]> {
    const query = `SELECT * FROM events WHERE domain_id = $1`;

    try {
      const result: QueryResult<Event> = await pool.query(query, [domainId]);
      return result.rows;
    } catch (error) {
      console.error("Erro ao buscar eventos por domain_id:", error);
      throw new Error("Erro ao buscar eventos por domain_id");
    }
  }

  async getByLeadId(leadId: string): Promise<Event[]> {
    const query = `SELECT * FROM events WHERE lead_id = $1`;

    try {
      const result: QueryResult<Event> = await pool.query(query, [leadId]);
      return result.rows;
    } catch (error) {
      console.error("Erro ao buscar eventos por lead_id:", error);
      throw new Error("Erro ao buscar eventos por lead_id");
    }
  }

  async getByConversionId(conversionId: string): Promise<Event[]> {
    const query = `SELECT * FROM events WHERE conversion_id = $1`;

    try {
      const result: QueryResult<Event> = await pool.query(query, [
        conversionId,
      ]);
      return result.rows;
    } catch (error) {
      console.error("Erro ao buscar eventos por conversion_id:", error);
      throw new Error("Erro ao buscar eventos por conversion_id");
    }
  }

  async deleteByDomainId(domainId: string): Promise<boolean> {
    const query = "DELETE FROM events WHERE domain_id = $1;";

    try {
      await pool.query(query, [domainId]);
      return true;
    } catch (error) {
      console.error("Erro ao deletar eventos por domain_id:", error);
      throw new Error("Erro ao deletar eventos por domain_id");
    }
  }

  async delete(id: string): Promise<boolean> {
    const query = "DELETE FROM events WHERE id = $1;";

    try {
      await pool.query(query, [id]);
      return true;
    } catch (error) {
      console.error("Erro ao deletar event:", error);
      throw new Error("Erro ao deletar domínio");
    }
  }

  // Ajuste no método update para aceitar atualizações parciais
  async update(id: string, event: Partial<Event>): Promise<Event | null> {
    const fields = Object.keys(event).filter(
      (key): key is keyof Event =>
        key in event && event[key as keyof Event] !== undefined
    );
    const values = fields.map((field) => event[field as keyof Event]);

    const setClause = fields
      .map((field, index) => `${field} = $${index + 1}`)
      .join(", ");
    const query = `
      UPDATE events
      SET ${setClause}
      WHERE id = $${fields.length + 1}
      RETURNING *;
    `;

    try {
      const result: QueryResult<Event> = await pool.query(query, [
        ...values,
        id,
      ]);
      return result.rows[0] || null;
    } catch (error) {
      console.error("Erro ao atualizar evento:", error);
      throw new Error("Erro ao atualizar evento");
    }
  }
}

export default new EventModel();
