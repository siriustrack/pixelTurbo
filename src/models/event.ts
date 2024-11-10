import clickhouseClient from "../utils/chdb";
import { Event } from "../types";
import { v4 as uuidv4 } from "uuid";

class EventModel {
  // Método para inserir um novo evento no banco de dados
  async create(event: Event): Promise<Event> {
    const {
      event_id,
      lead_id,
      event_name,
      event_time,
      event_url,
      page_id,
      page_title,
      product_id,
      product_name,
      product_value,
      predicted_ltv,
      offer_ids,
      content_name,
      traffic_source,
      utm_source,
      utm_medium,
      utm_campaign,
      utm_id,
      utm_term,
      utm_content,
      src,
      sck,
      geo_ip,
      geo_device,
      geo_country,
      geo_state,
      geo_city,
      geo_zipcode,
      geo_currency,
      first_fbc,
      fbc,
      fbp,
      domain_id,
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
      INSERT INTO events (id, event_id, lead_id, event_name, event_time, event_url, page_id, page_title, product_id, product_name, product_value, predicted_ltv, offer_ids, content_name, traffic_source, utm_source, utm_medium, utm_campaign, utm_id, utm_term, utm_content, src, sck, geo_ip, geo_device, geo_country, geo_state, geo_city, geo_zipcode, geo_currency, first_fbc, fbc, fbp, domain_id, content_ids, currency, value, facebook_request, facebook_response, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    // Valores a serem inseridos
    const values = [
      id,
      event_id,
      lead_id,
      event_name,
      event_time,
      event_url,
      page_id,
      page_title,
      product_id,
      product_name,
      product_value,
      predicted_ltv,
      offer_ids,
      content_name,
      traffic_source,
      utm_source,
      utm_medium,
      utm_campaign,
      utm_id,
      utm_term,
      utm_content,
      src,
      sck,
      geo_ip,
      geo_device,
      geo_country,
      geo_state,
      geo_city,
      geo_zipcode,
      geo_currency,
      first_fbc,
      fbc,
      fbp,
      domain_id,
      content_ids,
      currency,
      value,
      facebook_request,
      facebook_response,
      created_at,
    ];

    try {
      // Executa a inserção no ClickHouse
      await clickhouseClient.insert(query, values);
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
      const result = await clickhouseClient.query(query, [id]);

      // Verifica se o resultado contém dados e retorna o primeiro item ou null
      if (result && result.data && result.data.length > 0) {
        return result.data[0] as Event;
      } else {
        return null;
      }
    } catch (error) {
      console.error("Erro ao buscar evento por ID:", error);
      throw new Error("Erro ao buscar evento por ID");
    }
  }

  // Método para buscar todos os eventos por domain_id
  async getByDomainId(domain_id: string): Promise<Event[]> {
    const query = `SELECT * FROM events WHERE domain_id = ?`;

    try {
      // Executa a busca no ClickHouse
      const result = await clickhouseClient.query(query, [domain_id]);

      // Verifica se o resultado contém dados e retorna a lista de eventos ou uma lista vazia
      return result && result.data ? (result.data as Event[]) : [];
    } catch (error) {
      console.error("Erro ao buscar eventos por domain_id:", error);
      throw new Error("Erro ao buscar eventos por domain_id");
    }
  }
}

export default new EventModel();
