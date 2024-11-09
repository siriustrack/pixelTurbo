import { Event } from "../types";
import EventModel from "../models/event";

class EventService {
  async create(event: Event): Promise<Event> {
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

  async getByDomainId(domainId: string): Promise<Event[]> {
    return await EventModel.getByDomainId(domainId);
  }

  async getByLeadId(leadId: string): Promise<Event[]> {
    return await EventModel.getByLeadId(leadId);
  }

  async getByConversionId(conversionId: string): Promise<Event[]> {
    return await EventModel.getByConversionId(conversionId);
  }

  async update(id: string, event: Partial<Event>): Promise<Event | null> {
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

  async deleteByDomainId(domainId: string): Promise<boolean> {
    return await EventModel.deleteByDomainId(domainId);
  }
}

export default new EventService();
