import { Request, Response } from "express";
import DomainService from "../services/domain";
import { Domain } from "../types"; // Importe a interface Domain

class DomainController {
  async create(req: Request, res: Response): Promise<Response | any> {
    try {
      const { domain_name } = req.body;
      const user_id = req.user_id; // Pegue o user_id da requisição

      // Verifique se o user_id está presente
      if (!user_id) {
        return res.status(400).json({ error: "User ID não fornecido" });
      }

      // Passe o user_id explicitamente para o serviço
      const domain = await DomainService.create({
        domain_name,
        user_id,
      } as Domain);
      return res.status(201).json(domain);
    } catch (error: any) {
      console.error("Erro ao criar domínio:", error);
      if (error.message === "Este domínio já está cadastrado.") {
        return res.status(400).send({ error: error.message }); // Bad Request para domínio duplicado
      }
      return res.status(500).send("Erro ao criar domínio");
    }
  }

  async getAll(req: Request, res: Response): Promise<Response | any> {
    try {
      const domains = await DomainService.getAll();
      return res.status(200).json(domains);
    } catch (error) {
      console.error("Erro ao buscar domínios:", error);
      return res.status(500).send("Erro ao buscar domínios");
    }
  }

  async getById(req: Request, res: Response): Promise<Response | any> {
    try {
      const id = req.params.id;
      const user_id = req.user_id; // Pegue o user_id da requisição

      // Verifique se o user_id está presente
      if (!user_id) {
        return res.status(400).json({ error: "User ID não fornecido" });
      }

      // Passe o user_id explicitamente para o serviço
      const domain = await DomainService.getById(id, user_id);

      if (!domain) {
        return res.status(404).send("Domínio não encontrado");
      }

      return res.json(domain);
    } catch (error) {
      console.error("Erro ao buscar domínio por ID:", error);
      return res.status(500).send("Erro ao buscar domínio");
    }
  }

  async update(req: Request, res: Response): Promise<Response | any> {
    try {
      const id = req.params.id;
      const { domain_name } = req.body;
      const user_id = req.user_id; // Pegue o user_id da requisição

      // Verifique se o user_id está presente
      if (!user_id) {
        return res.status(400).json({ error: "User ID não fornecido" });
      }

      // Passe o user_id explicitamente como o terceiro argumento
      const domain = await DomainService.update(
        id,
        { domain_name, user_id } as Domain,
        user_id
      );

      if (!domain) {
        return res.status(404).send("Domínio não encontrado");
      }

      return res.status(200).json(domain);
    } catch (error) {
      console.error("Erro ao atualizar domínio:", error);
      return res.status(500).send("Erro ao atualizar domínio");
    }
  }

  async delete(req: Request, res: Response): Promise<Response | any> {
    try {
      const id = req.params.id;
      const user_id = req.user_id; // Pegue o user_id da requisição

      // Verifique se o user_id está presente
      if (!user_id) {
        return res.status(400).json({ error: "User ID não fornecido" });
      }

      // Passe o user_id explicitamente para o serviço
      const deleted = await DomainService.delete(id, user_id);

      if (!deleted) {
        return res.status(404).send("Domínio não encontrado");
      }

      return res.status(204).send("Domínio excluído com sucesso"); // No Content
    } catch (error) {
      console.error("Erro ao deletar domínio:", error);
      return res.status(500).send("Erro ao deletar domínio");
    }
  }
  // Novo método para validar o CNAME
  async validateCname(req: Request, res: Response): Promise<Response | any> {
    try {
      const { domain_id } = req.params;
      const user_id = req.user_id;

      if (!user_id) {
        return res.status(400).json({ error: "User ID não fornecido" });
      }

      // Chama o serviço para validar o CNAME
      const isValid = await DomainService.validateDomainCname(
        domain_id,
        user_id
      );

      if (isValid) {
        return res.status(200).json({ message: "CNAME validado com sucesso" });
      } else {
        return res
          .status(400)
          .json({ error: "CNAME não aponta para o destino esperado" });
      }
    } catch (error) {
      console.error("Erro ao validar CNAME do domínio:", error);
      return res.status(500).send("Erro ao validar CNAME do domínio");
    }
  }
}

export default new DomainController();
