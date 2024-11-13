import clickhouseClient from "../utils/chdb";
import { InsertParams } from "@clickhouse/client";
import { Event } from "../types";
import { v4 as uuidv4 } from "uuid";
import { Readable } from "node:stream";

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

    // Query SQL para inserção e valores a serem inseridos
    const queryConfig: any = {
      query: `
        INSERT INTO Event (id, event_id, lead_id, event_name, event_time, event_url, page_id, page_title, product_id, product_name, product_value, predicted_ltv, offer_ids, content_name, traffic_source, utm_source, utm_medium, utm_campaign, utm_id, utm_term, utm_content, src, sck, geo_ip, geo_device, geo_country, geo_state, geo_city, geo_zipcode, geo_currency, first_fbc, fbc, fbp, domain_id, content_ids, currency, value, facebook_request, facebook_response, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
      values: [
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
      ],
    };

    try {
      // Executa a inserção no ClickHouse
      await clickhouseClient.insert(queryConfig);
      // Retorna o objeto do evento inserido
      const { id: _, ...eventData } = event;
      return { id, ...eventData, created_at };
    } catch (error: any) {
      console.error("Erro ao criar evento:", error);
      throw new Error("Erro ao criar evento.");
    }
  }

  // Método para buscar um evento por ID
  async getById(id: string): Promise<Event | null> {
    const queryConfig = {
      query: `SELECT * FROM Event WHERE id = ?`,
      values: [id],
    };

    try {
      // Executa a busca no ClickHouse
      const result: any = await clickhouseClient
        .query(queryConfig)
        .then((res: { json: () => any }) => res.json());

      // Verifica se o resultado contém dados e retorna o primeiro item ou null
      return result.length > 0 ? (result[0] as Event) : null;
    } catch (error) {
      console.error("Erro ao buscar evento por ID:", error);
      throw new Error("Erro ao buscar evento por ID");
    }
  }

  // Método para buscar todos os eventos por domain_id
  async getByDomainId(domain_id: string): Promise<Event[]> {
    const queryConfig = {
      query: `SELECT * FROM Event WHERE domain_id = ?`,
      values: [domain_id],
    };

    try {
      // Executa a busca no ClickHouse
      const result: any = await clickhouseClient
        .query(queryConfig)
        .then((res: { json: () => any }) => res.json());

      // Verifica se o resultado contém dados e retorna a lista de eventos ou uma lista vazia
      return result as Event[];
    } catch (error) {
      console.error("Erro ao buscar eventos por domain_id:", error);
      throw new Error("Erro ao buscar eventos por domain_id");
    }
  }

  async update(event: Event): Promise<Event> {
    try {
      // Get existing event
      const existingEvent = await this.getById(event.id);
      if (!existingEvent) {
        throw new Error("Event not found");
      }

      // Delete the existing event
      const deleteQuery = {
        query: `ALTER TABLE Event DELETE WHERE id = ?`,
        values: [event.id],
      };
      await clickhouseClient.query(deleteQuery);

      // Merge existing and new data, preserving non-null values
      const updatedEvent = {
        ...existingEvent,
        ...Object.fromEntries(
          Object.entries(event).filter(
            ([_, value]) => value !== null && value !== undefined
          )
        ),
        created_at: existingEvent.created_at, // Preserve original creation time
        updated_at: new Date(), // Add update timestamp
      };

      // Prepare values for insertion
      const insertQuery: InsertParams<Readable, unknown> = {
        table: "Event",
        values: [
          updatedEvent.id,
          updatedEvent.event_id,
          updatedEvent.lead_id,
          updatedEvent.event_name,
          updatedEvent.event_time,
          updatedEvent.event_url,
          updatedEvent.page_id,
          updatedEvent.page_title,
          updatedEvent.product_id,
          updatedEvent.product_name,
          updatedEvent.product_value,
          updatedEvent.predicted_ltv,
          updatedEvent.offer_ids,
          updatedEvent.content_name,
          updatedEvent.traffic_source,
          updatedEvent.utm_source,
          updatedEvent.utm_medium,
          updatedEvent.utm_campaign,
          updatedEvent.utm_id,
          updatedEvent.utm_term,
          updatedEvent.utm_content,
          updatedEvent.src,
          updatedEvent.sck,
          updatedEvent.geo_ip,
          updatedEvent.geo_device,
          updatedEvent.geo_country,
          updatedEvent.geo_state,
          updatedEvent.geo_city,
          updatedEvent.geo_zipcode,
          updatedEvent.geo_currency,
          updatedEvent.first_fbc,
          updatedEvent.fbc,
          updatedEvent.fbp,
          updatedEvent.domain_id,
          updatedEvent.content_ids,
          updatedEvent.currency,
          updatedEvent.value,
          updatedEvent.facebook_request,
          updatedEvent.facebook_response,
          updatedEvent.created_at,
          updatedEvent.updated_at,
        ],
        format: "JSONEachRow",
      };

      await clickhouseClient.insert(insertQuery);

      // Verify and return the updated event
      const savedEvent = await this.getById(updatedEvent.id);
      if (!savedEvent) {
        throw new Error("Event not found after update");
      }

      return savedEvent;
    } catch (error) {
      console.error("Error updating event:", error);
      throw new Error("Failed to update event");
    }
  }
}

export default new EventModel();
