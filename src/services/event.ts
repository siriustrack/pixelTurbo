import { Event } from "../types";
import EventModel from "../models/event";

class EventService {
  // Método para criar um novo evento chamando o modelo
  async create(event: Event): Promise<Event> {
    return await EventModel.create(event);
  }

  // Método para buscar um evento por ID chamando o modelo
  async getById(id: string): Promise<Event | null> {
    const event = await EventModel.getById(id);
    if (!event) {
      throw new Error("Evento não encontrado");
    }
    return event;
  }

  // Método para buscar todos os eventos por domain_id chamando o modelo
  async getByDomainId(domain_id: string): Promise<Event[]> {
    return await EventModel.getByDomainId(domain_id);
  }
}

export default new EventService();
