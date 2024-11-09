import { Conversion } from "../types";
import ConversionModel from "../models/conversion";
import { validationResult } from "express-validator";

class ConversionService {
  async create(conversion: Conversion): Promise<Conversion> {
    const errors = validationResult(conversion);
    if (!errors.isEmpty()) {
      throw new Error(errors.array()[0].msg);
    }

    return await ConversionModel.create(conversion);
  }

  async getAll(): Promise<Conversion[]> {
    return await ConversionModel.getAll();
  }

  async getById(id: string): Promise<Conversion | null> {
    const conversion = await ConversionModel.getById(id);
    if (!conversion) {
      throw new Error("Conversão não encontrada");
    }
    return conversion;
  }

  async getByDomainId(domainId: string): Promise<Conversion[]> {
    return await ConversionModel.getByDomainId(domainId);
  }

  async update(id: string, conversion: Conversion): Promise<Conversion | null> {
    const errors = validationResult(conversion);
    if (!errors.isEmpty()) {
      throw new Error(errors.array()[0].msg);
    }

    const existingConversion = await ConversionModel.getById(id);
    if (!existingConversion) {
      throw new Error("Conversão não encontrada");
    }

    return await ConversionModel.update(id, conversion);
  }

  async delete(id: string): Promise<boolean> {
    const existingConversion = await ConversionModel.getById(id);
    if (!existingConversion) {
      throw new Error("Conversão não encontrada");
    }

    return await ConversionModel.delete(id);
  }
}

export default new ConversionService();
