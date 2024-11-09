import { FacebookPixel } from "../types";
import FacebookPixelModel from "../models/facebookPixel";
import { validationResult } from "express-validator";

class FacebookPixelService {
  async create(facebookPixel: FacebookPixel): Promise<FacebookPixel> {
    const errors = validationResult(facebookPixel);
    if (!errors.isEmpty()) {
      throw new Error(errors.array()[0].msg);
    }

    return await FacebookPixelModel.create(facebookPixel);
  }

  async getAll(): Promise<FacebookPixel[]> {
    return await FacebookPixelModel.getAll();
  }

  async getById(id: string): Promise<FacebookPixel | null> {
    const facebookPixel = await FacebookPixelModel.getById(id);
    if (!facebookPixel) {
      throw new Error("Facebook Pixel não encontrado");
    }
    return facebookPixel;
  }

  async getByDomainId(domainId: string): Promise<FacebookPixel[]> {
    return await FacebookPixelModel.getByDomainId(domainId);
  }

  async update(
    id: string,
    facebookPixel: FacebookPixel
  ): Promise<FacebookPixel | null> {
    const errors = validationResult(facebookPixel);
    if (!errors.isEmpty()) {
      throw new Error(errors.array()[0].msg);
    }

    const existingPixel = await FacebookPixelModel.getById(id);
    if (!existingPixel) {
      throw new Error("Facebook Pixel não encontrado");
    }

    return await FacebookPixelModel.update(id, facebookPixel);
  }

  async delete(id: string): Promise<boolean> {
    const existingPixel = await FacebookPixelModel.getById(id);
    if (!existingPixel) {
      throw new Error("Facebook Pixel não encontrado");
    }

    return await FacebookPixelModel.delete(id);
  }
}

export default new FacebookPixelService();
