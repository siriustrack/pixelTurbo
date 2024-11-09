import { Request, Response } from "express";
import UserService from "../services/user";
import Logger from "../utils/logger";
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";

// Store for refresh tokens and password reset tokens (in production, use Redis/DB)
const tokenStore = new Map<string, { userId: string; expiresAt: number }>();
const passwordResetTokens = new Map<
  string,
  { email: string; expiresAt: number }
>();

class AuthController {
  async register(req: Request, res: Response): Promise<Response | any> {
    try {
      const user = await UserService.create(req.body);

      const loginResult = await UserService.login(
        req.body.email,
        req.body.password
      );

      if (!loginResult) {
        return res
          .status(401)
          .json({ error: "Erro ao gerar token de autenticação" });
      }

      const { token, refreshToken } = loginResult;

      return res.status(201).json({
        token,
        refreshToken,
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
      const loginResult = await UserService.login(email, password);

      if (!loginResult) {
        return res.status(401).json({ error: "Credenciais inválidas" });
      }

      const { token, refreshToken } = loginResult;
      const user = await UserService.getByEmail(email);

      if (!user) {
        return res.status(404).json({ error: "Usuário não encontrado" });
      }

      return res.status(200).json({
        token,
        refreshToken,
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

  async refreshToken(req: Request, res: Response): Promise<Response | any> {
    try {
      const { refreshToken } = req.body;

      // Log para verificar o token recebido
      Logger.info("Refresh token recebido:", refreshToken);

      const storedToken = tokenStore.get(refreshToken);

      // Log para verificar se o token está armazenado
      Logger.info("Token encontrado no tokenStore:", storedToken);

      if (!storedToken) {
        return res.status(401).json({ error: "Invalid refresh token" });
      }

      if (Date.now() > storedToken.expiresAt) {
        tokenStore.delete(refreshToken);
        return res.status(401).json({ error: "Refresh token expired" });
      }

      const user = await UserService.getById(storedToken.userId);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      const newAccessToken = jwt.sign(
        { id: user.id },
        process.env.JWT_SECRET || "",
        { expiresIn: "1h" }
      );

      const newRefreshToken = UserService.generateRefreshToken(user.id!);
      tokenStore.delete(refreshToken); // Invalidate old refresh token

      return res.status(200).json({
        token: newAccessToken,
        refreshToken: newRefreshToken,
      });
    } catch (error) {
      Logger.error("Refresh token error:", error);
      return res.status(500).json({ error: "Error refreshing token" });
    }
  }

  async forgotPassword(req: Request, res: Response): Promise<Response | any> {
    try {
      const { email } = req.body;
      const user = await UserService.getByEmail(email);

      if (!user) {
        // Return 200 even if user not found for security
        return res.status(200).json({
          message: "If an account exists, a password reset email will be sent",
        });
      }

      const resetToken = uuidv4();
      passwordResetTokens.set(resetToken, {
        email: user.email,
        expiresAt: Date.now() + 3600000, // 1 hour expiry
      });

      // In production, send email with reset link
      Logger.info(`Password reset token for ${email}: ${resetToken}`);

      return res.status(200).json({
        message: "If an account exists, a password reset email will be sent",
      });
    } catch (error) {
      Logger.error("Forgot password error:", error);
      return res.status(500).json({ error: "Error processing request" });
    }
  }

  async resetPassword(req: Request, res: Response): Promise<Response | any> {
    try {
      const { token, password } = req.body;
      const storedToken = passwordResetTokens.get(token);

      if (!storedToken || Date.now() > storedToken.expiresAt) {
        return res
          .status(400)
          .json({ error: "Invalid or expired reset token" });
      }

      const user = await UserService.getByEmail(storedToken.email);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      await UserService.update(user.id!, { ...user, password });
      passwordResetTokens.delete(token);

      return res.status(200).json({ message: "Password reset successful" });
    } catch (error) {
      Logger.error("Reset password error:", error);
      return res.status(500).json({ error: "Error resetting password" });
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

  async logout(req: Request, res: Response): Promise<Response | any> {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader) {
        return res.status(401).json({ error: "No token provided" });
      }

      const [, token] = authHeader.split(" ");
      const decoded = jwt.verify(token, process.env.JWT_SECRET || "") as {
        id: string;
      };

      // Remove all refresh tokens for this user
      for (const [key, value] of tokenStore.entries()) {
        if (value.userId === decoded.id) {
          tokenStore.delete(key);
        }
      }

      return res.status(200).json({ message: "Successfully logged out" });
    } catch (error) {
      Logger.error("Logout error:", error);
      return res.status(500).json({ error: "Error during logout" });
    }
  }
}
export default new AuthController();
