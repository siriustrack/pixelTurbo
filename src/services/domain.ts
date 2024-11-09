import { Domain } from "../types";
import DomainModel from "../models/domain";
import { validationResult } from "express-validator";

class DomainService {
  async create(domain: Domain): Promise<Domain> {
    const errors = validationResult(domain);
    if (!errors.isEmpty()) {
      throw new Error(errors.array()[0].msg);
    }

    return await DomainModel.create(domain);
  }

  async getAll(): Promise<Domain[]> {
    return await DomainModel.getAll();
  }

  async getById(id: string): Promise<Domain | null> {
    const domain = await DomainModel.getById(id);
    if (!domain) {
      throw new Error("Domínio não encontrado");
    }
    return domain;
  }

  async getByUserId(userId: string): Promise<Domain[]> {
    return await DomainModel.getByUserId(userId);
  }

  async getByDomainName(domainName: string): Promise<Domain | null> {
    return await DomainModel.getByDomainName(domainName);
  }

  async update(id: string, domain: Domain): Promise<Domain | null> {
    const errors = validationResult(domain);
    if (!errors.isEmpty()) {
      throw new Error(errors.array()[0].msg);
    }

    const existingDomain = await DomainModel.getById(id);
    if (!existingDomain) {
      throw new Error("Domínio não encontrado");
    }

    return await DomainModel.update(id, domain);
  }

  async delete(id: string): Promise<boolean> {
    const existingDomain = await DomainModel.getById(id);
    if (!existingDomain) {
      throw new Error("Domínio não encontrado");
    }

    return await DomainModel.delete(id);
  }
}

export default new DomainService();
