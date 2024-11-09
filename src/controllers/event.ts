import { Request, Response } from "express";
import EventService from "../services/event";

class EventController {
  async create(req: Request, res: Response): Promise<void> {
    try {
      const event = await EventService.create(req.body);
      res.status(201).json(event);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async getAll(req: Request, res: Response): Promise<void> {
    try {
      const events = await EventService.getAll();
      res.status(200).json(events);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async getById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const event = await EventService.getById(id);
      res.status(200).json(event);
    } catch (error: any) {
      res.status(404).json({ error: error.message });
    }
  }

  async update(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const event = await EventService.update(id, req.body);
      res.status(200).json(event);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async delete(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      await EventService.delete(id);
      res.status(204).send();
    } catch (error: any) {
      res.status(404).json({ error: error.message });
    }
  }
}

export default new EventController();
