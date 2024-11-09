import { Lead } from "../types";
import LeadModel from "../models/lead";
import { validationResult } from "express-validator";

class LeadService {
  async create(lead: Lead): Promise<Lead> {
    const errors = validationResult(lead);
    if (!errors.isEmpty()) {
      throw new Error(errors.array()[0].msg);
    }

    return await LeadModel.create(lead);
  }

  async getAll(): Promise<Lead[]> {
    return await LeadModel.getAll();
  }

  async getById(id: string): Promise<Lead | null> {
    const lead = await LeadModel.getById(id);
    if (!lead) {
      throw new Error("Lead não encontrado");
    }
    return lead;
  }

  async getByDomainId(domainId: string): Promise<Lead[]> {
    return await LeadModel.getByDomainId(domainId);
  }

  async update(id: string, lead: Lead): Promise<Lead | null> {
    const errors = validationResult(lead);
    if (!errors.isEmpty()) {
      throw new Error(errors.array()[0].msg);
    }

    const existingLead = await LeadModel.getById(id);
    if (!existingLead) {
      throw new Error("Lead não encontrado");
    }

    return await LeadModel.update(id, lead);
  }

  async delete(id: string): Promise<boolean> {
    const existingLead = await LeadModel.getById(id);
    if (!existingLead) {
      throw new Error("Lead não encontrado");
    }

    return await LeadModel.delete(id);
  }
}

export default new LeadService();
