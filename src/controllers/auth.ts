import { Request, Response } from "express";
import UserService from "../services/user";
import Logger from "../utils/logger";

class AuthController {
  async register(req: Request, res: Response): Promise<Response | any> {
    try {
      const user = await UserService.create(req.body);
      const token = await UserService.login(req.body.email, req.body.password);

      return res.status(201).json({
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
        },
      });
    } catch (error: any) {
      Logger.error("Registration error:", error);
      if (error.message === "Este email já está cadastrado.") {
        return res.status(400).json({ error: error.message });
      }
      return res.status(500).json({ error: "Erro ao registrar usuário" });
    }
  }

  async login(req: Request, res: Response): Promise<Response | any> {
    try {
      const { email, password } = req.body;
      const token = await UserService.login(email, password);
      const user = await UserService.getByEmail(email);

      if (!user) {
        return res.status(404).json({ error: "Usuário não encontrado" });
      }

      return res.status(200).json({
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
        },
      });
    } catch (error: any) {
      Logger.error("Login error:", error);
      return res.status(401).json({ error: "Credenciais inválidas" });
    }
  }

  async getCurrentUser(req: Request, res: Response): Promise<Response | any> {
    try {
      const userId = req.user_id;

      if (!userId) {
        return res.status(401).json({ error: "Não autorizado" });
      }

      const user = await UserService.getById(userId);

      if (!user) {
        return res.status(404).json({ error: "Usuário não encontrado" });
      }

      return res.status(200).json({
        id: user.id,
        name: user.name,
        email: user.email,
      });
    } catch (error: any) {
      Logger.error("Get current user error:", error);
      return res.status(500).json({ error: "Erro ao buscar usuário" });
    }
  }
}

export default new AuthController();
