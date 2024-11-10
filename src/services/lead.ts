import { Lead } from "../types";
import LeadModel from "../models/lead";
import { validationResult } from "express-validator";

class LeadService {
  // Cria um novo lead ou atualiza se o ID existir
  async create(lead: Lead): Promise<Lead> {
    const errors = validationResult(lead);
    if (!errors.isEmpty()) {
      throw new Error(errors.array()[0].msg);
    }

    return await LeadModel.create(lead);
  }

  // Busca um lead específico pelo ID
  async getById(id: string): Promise<Lead | null> {
    const lead = await LeadModel.getById(id);
    if (!lead) {
      throw new Error("Lead não encontrado");
    }
    return lead;
  }

  // Busca todos os leads associados a um domainId
  async getByDomainId(domainId: string): Promise<Lead[]> {
    const leads = await LeadModel.getByDomainId(domainId);
    if (leads.length === 0) {
      throw new Error("Nenhum lead encontrado para este domainId");
    }
    return leads;
  }
}

export default new LeadService();
