import { Request, Response } from "express";
import EventService from "../services/event";

class EventController {
  // Método para criar um novo evento
  async create(req: Request, res: Response): Promise<void> {
    try {
      const event = await EventService.create(req.body);
      res.status(201).json(event);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  // Método para buscar um evento por ID
  async getById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const event = await EventService.getById(id);
      res.status(200).json(event);
    } catch (error: any) {
      res.status(404).json({ error: error.message });
    }
  }

  // Método para buscar todos os eventos por domain_id
  async getByDomainId(req: Request, res: Response): Promise<void> {
    try {
      const { domain_id } = req.params;
      const events = await EventService.getByDomainId(domain_id);
      res.status(200).json(events);
    } catch (error: any) {
      res.status(404).json({ error: error.message });
    }
  }
}

export default new EventController();
