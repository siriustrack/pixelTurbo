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

  async update(id: string, event: Event): Promise<Event | null> {
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
    const query = `
      UPDATE events
      SET lead_id = $1, conversion_id = $2, domain_id = $3, event_name = $4, event_time = $5, event_source_url = $6, content_ids = $7, currency = $8, value = $9, facebook_request = $10, facebook_response = $11
      WHERE id = $12
      RETURNING *;
    `;
    const values = [
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
      id,
    ];

    try {
      const result: QueryResult<Event> = await pool.query(query, values);
      return result.rows[0] || null;
    } catch (error) {
      console.error("Erro ao atualizar evento:", error);
      throw new Error("Erro ao atualizar evento");
    }
  }

  async delete(id: string): Promise<boolean> {
    const query = "DELETE FROM events WHERE id = $1;";

    try {
      await pool.query(query, [id]);
      return true;
    } catch (error) {
      console.error("Erro ao deletar evento:", error);
      throw new Error("Erro ao deletar evento");
    }
  }
}

export default new EventModel();
