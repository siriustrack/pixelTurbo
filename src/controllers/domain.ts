import { Request, Response } from "express";
import { RequestCustom } from "../interfaces/RequestCustom"; // Importe a interface customizada
import DomainService from "../services/domain";
import { Domain } from "../types"; // Importe a interface Domain

class DomainController {
  async create(req: Request, res: Response): Promise<Response> {
    try {
      const domain = await DomainService.create(req.body as Domain); // Type assertion para Domain
      return res.status(201).json(domain);
    } catch (error: any) {
      console.error("Erro ao criar domínio:", error);
      if (error.message === "Este domínio já está cadastrado.") {
        return res.status(400).send({ error: error.message }); // Bad Request para domínio duplicado
      }
      return res.status(500).send("Erro ao criar domínio");
    }
  }

  async getAll(req: RequestCustom, res: Response): Promise<Response> {
    try {
      const domains = await DomainService.getAll();
      return res.status(200).json(domains);
    } catch (error) {
      console.error("Erro ao buscar domínios:", error);
      return res.status(500).send("Erro ao buscar domínios");
    }
  }

  async getById(req: Request, res: Response): Promise<Response> {
    try {
      const id = req.params.id;
      const domain = await DomainService.getById(id);

      if (!domain) {
        return res.status(404).send("Domínio não encontrado");
      }

      return res.json(domain);
    } catch (error) {
      console.error("Erro ao buscar domínio por ID:", error);
      return res.status(500).send("Erro ao buscar domínio");
    }
  }

  async update(req: Request, res: Response): Promise<Response> {
    const id = req.params.id;
    const updatedDomain = req.body as Domain;

    try {
      const domain = await DomainService.update(id, updatedDomain);
      if (!domain) {
        return res.status(404).send("Domínio não encontrado");
      }
      return res.status(200).json(domain);
    } catch (error) {
      console.error("Erro ao atualizar domínio:", error);
      return res.status(500).send("Erro ao atualizar domínio");
    }
  }

  async delete(req: Request, res: Response): Promise<Response> {
    try {
      const id = req.params.id;
      const deleted = await DomainService.delete(id);

      if (!deleted) {
        return res.status(404).send("Domínio não encontrado");
      }
      return res.status(204).send(); // No Content
    } catch (error) {
      console.error("Erro ao deletar domínio:", error);
      return res.status(500).send("Erro ao deletar domínio");
    }
  }
}

export default new DomainController();
