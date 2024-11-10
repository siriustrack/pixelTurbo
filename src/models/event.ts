import clickhouseClient from "../utils/chdb";
import { Event } from "../types";
import { v4 as uuidv4 } from "uuid";

class EventModel {
  // Método para inserir um novo evento no banco de dados
  async create(event: Event): Promise<Event> {
    const {
      lead_id,
      domain_id,
      event_name,
      event_time,
      event_url,
      content_ids,
      currency,
      value,
      facebook_request,
      facebook_response,
    } = event;

    // Gera um novo UUID para o evento
    const id = uuidv4();
    const created_at = new Date();

    // Query SQL para inserção
    const query = `
      INSERT INTO events (id, lead_id, domain_id, event_name, event_time, event_url, content_ids, currency, value, facebook_request, facebook_response, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    // Valores a serem inseridos
    const values = [
      id,
      lead_id,
      domain_id,
      event_name,
      event_time,
      event_url,
      content_ids,
      currency,
      value,
      facebook_request,
      facebook_response,
      created_at,
    ];

    try {
      // Executa a inserção no ClickHouse
      await clickhouseClient.insert(query, values).toPromise();
      // Retorna o objeto do evento inserido
      return { id, ...event, created_at };
    } catch (error: any) {
      console.error("Erro ao criar evento:", error);
      throw new Error("Erro ao criar evento.");
    }
  }

  // Método para buscar um evento por ID
  async getById(id: string): Promise<Event | null> {
    const query = `SELECT * FROM events WHERE id = ?`;

    try {
      // Executa a busca no ClickHouse
      const result = await clickhouseClient.query(query, [id]).toPromise();
      // Retorna o primeiro resultado ou null se não existir
      return result.data[0] || null;
    } catch (error) {
      console.error("Erro ao buscar evento por ID:", error);
      throw new Error("Erro ao buscar evento por ID");
    }
  }
}

export default new EventModel();
