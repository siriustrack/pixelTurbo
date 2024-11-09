import { Request, Response } from "express";
import { RequestCustom } from "./interfaces/RequestCustom"; // Importe a interface customizada
import UserService from "./services/user";
import { User } from "./types"; // Importe a interface User

class UserController {
  async create(req: Request, res: Response): Promise<Response> {
    try {
      const user = await UserService.create(req.body as User); // Type assertion para User
      res.status(201).json(user);
    } catch (error: any) {
      // Lidar com erros e retornar status 500
      console.error(error);
      if (error.message === "Este email já está cadastrado.") {
        return res.status(400).send({ error: error.message }); // Bad Request para email duplicado
      }
      return res.status(500).send("Erro ao criar usuário");
    }
  }

  async getAll(req: RequestCustom, res: Response): Promise<Response> {
    try {
      const users = await UserService.getAll();
      res.status(200).json(users);
    } catch (error) {
      // Lidar com erros e retornar status 500
      console.error(error);
      return res.status(500).send("Erro ao buscar usuários");
    }
  }

  async getById(req: Request, res: Response): Promise<Response> {
    try {
      const id = req.params.id;
      const user = await UserService.getById(id);

      if (!user) {
        return res.status(404).send("Usuário não encontrado");
      }

      res.json(user);
    } catch (error) {
      console.error("Erro ao buscar usuário por ID:", error);
      return res.status(500).send("Erro ao buscar usuário");
    }
  }

  async update(req: Request, res: Response): Promise<Response> {
    const id = req.params.id;
    const updatedUser = req.body as User;

    try {
      const user = await UserService.update(id, updatedUser);
      if (!user) {
        return res.status(404).send("Usuário não encontrado");
      }
      return res.status(200).json(user);
    } catch (err) {
      console.error("Erro ao atualizar o usuário:", err);
      return res.status(500).send("Erro ao atualizar o usuário");
    }
  }

  async delete(req: Request, res: Response): Promise<Response> {
    try {
      const id = req.params.id;
      const deleted = await UserService.delete(id);

      if (!deleted) {
        return res.status(404).send("Usuário não encontrado");
      }
      return res.status(204).send(); // No Content
    } catch (error) {
      console.error("Erro ao deletar usuário:", error);
      return res.status(500).send("Erro ao deletar usuário");
    }
  }
}

export default new UserController();
