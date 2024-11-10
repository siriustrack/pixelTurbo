import { Request, Response } from "express";
import LeadService from "../services/lead";

class LeadController {
  // Método para criar um novo lead
  async create(req: Request, res: Response): Promise<void> {
    try {
      const lead = await LeadService.create(req.body);
      res.status(201).json(lead);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  // Método para buscar um lead específico pelo ID
  async getById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const lead = await LeadService.getById(id);
      res.status(200).json(lead);
    } catch (error: any) {
      res.status(404).json({ error: error.message });
    }
  }

  // Método para buscar todos os leads associados a um domainId
  async getByDomainId(req: Request, res: Response): Promise<void> {
    try {
      const { domainId } = req.params;
      const leads = await LeadService.getByDomainId(domainId);
      res.status(200).json(leads);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
}

export default new LeadController();
