import { Event } from "../types";
import EventModel from "../models/event";
import axios from "axios";

class EventService {
  async create(event: Event): Promise<Event> {
    // Enviar para a Facebook Conversion API
    try {
      const facebookResponse = await axios.post(
        "https://graph.facebook.com/v12.0/<PIXEL_ID>/events",
        {
          data: {
            event_name: event.event_name,
            event_time: Math.floor(event.event_time.getTime() / 1000),
            event_source_url: event.event_source_url,
            user_data: {
              client_ip_address: event.facebook_request?.client_ip_address,
              client_user_agent: event.facebook_request?.client_user_agent,
            },
            custom_data: {
              currency: event.currency,
              value: event.value,
            },
          },
          access_token: "<ACCESS_TOKEN>",
        }
      );

      event.facebook_response = facebookResponse.data;
    } catch (error) {
      console.error(
        "Erro ao enviar evento para Facebook Conversion API:",
        error
      );
      throw new Error("Erro ao enviar evento para Facebook Conversion API.");
    }

    return await EventModel.create(event);
  }

  async getAll(): Promise<Event[]> {
    return await EventModel.getAll();
  }

  async getById(id: string): Promise<Event | null> {
    const event = await EventModel.getById(id);
    if (!event) {
      throw new Error("Evento não encontrado");
    }
    return event;
  }

  async update(id: string, event: Event): Promise<Event | null> {
    const existingEvent = await EventModel.getById(id);
    if (!existingEvent) {
      throw new Error("Evento não encontrado");
    }

    return await EventModel.update(id, event);
  }

  async delete(id: string): Promise<boolean> {
    const existingEvent = await EventModel.getById(id);
    if (!existingEvent) {
      throw new Error("Evento não encontrado");
    }

    return await EventModel.delete(id);
  }
}

export default new EventService();
