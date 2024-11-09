import { Request, Response } from "express";
import FacebookPixelService from "../services/facebookPixel";

class FacebookPixelController {
  async create(req: Request, res: Response): Promise<void> {
    try {
      const facebookPixel = await FacebookPixelService.create(req.body);
      res.status(201).json(facebookPixel);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async getAll(req: Request, res: Response): Promise<void> {
    try {
      const facebookPixels = await FacebookPixelService.getAll();
      res.status(200).json(facebookPixels);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async getById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const facebookPixel = await FacebookPixelService.getById(id);
      if (!facebookPixel) {
        res.status(404).json({ error: "Facebook Pixel não encontrado" });
        return;
      }
      res.status(200).json(facebookPixel);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async getByDomainId(req: Request, res: Response): Promise<void> {
    try {
      const { domainId } = req.params;
      const facebookPixels = await FacebookPixelService.getByDomainId(domainId);
      res.status(200).json(facebookPixels);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async update(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const facebookPixel = await FacebookPixelService.update(id, req.body);
      if (!facebookPixel) {
        res.status(404).json({ error: "Facebook Pixel não encontrado" });
        return;
      }
      res.status(200).json(facebookPixel);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async delete(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const success = await FacebookPixelService.delete(id);
      if (!success) {
        res.status(404).json({ error: "Facebook Pixel não encontrado" });
        return;
      }
      res.status(204).send();
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
}

export default new FacebookPixelController();
