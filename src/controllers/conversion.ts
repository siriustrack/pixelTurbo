import { Request, Response } from "express";
import ConversionService from "../services/conversion";

class ConversionController {
  async create(req: Request, res: Response): Promise<void> {
    try {
      const conversion = await ConversionService.create(req.body);
      res.status(201).json(conversion);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async getAll(req: Request, res: Response): Promise<void> {
    try {
      const conversions = await ConversionService.getAll();
      res.status(200).json(conversions);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async getById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const conversion = await ConversionService.getById(id);
      res.status(200).json(conversion);
    } catch (error: any) {
      res.status(404).json({ error: error.message });
    }
  }

  async getByDomainId(req: Request, res: Response): Promise<void> {
    try {
      const { domainId } = req.params;
      const conversions = await ConversionService.getByDomainId(domainId);
      res.status(200).json(conversions);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async update(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const conversion = await ConversionService.update(id, req.body);
      res.status(200).json(conversion);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async delete(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      await ConversionService.delete(id);
      res.status(204).send();
    } catch (error: any) {
      res.status(404).json({ error: error.message });
    }
  }
}

export default new ConversionController();
