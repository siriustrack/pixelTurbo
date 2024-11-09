import { User } from "../types";
import UserModel from "../models/user";
import { validationResult } from "express-validator";
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";
import RefreshTokenModel from "../models/refreshtoken";
import crypto from "crypto";
import Logger from "../utils/logger";

const tokenStore = new Map<string, { userId: string; expiresAt: number }>();

class UserService {
  private readonly saltRounds = 10000; // Número de iterações de hash para aumentar a segurança
  private readonly keyLength = 64; // Comprimento do hash resultante

  async create(user: User): Promise<User> {
    const errors = validationResult(user);
    if (!errors.isEmpty()) {
      throw new Error(errors.array()[0].msg);
    }

    const hashedPassword = await this.hashPassword(user.password);

    const newUser: User = {
      ...user,
      password: hashedPassword,
    };

    return await UserModel.create(newUser);
  }

  async getAll(): Promise<User[]> {
    return await UserModel.getAll();
  }

  async getById(id: string): Promise<User | null> {
    return await UserModel.getById(id);
  }

  async getByEmail(email: string): Promise<User | null> {
    return await UserModel.getByEmail(email);
  }

  async update(id: string, user: User): Promise<User | null> {
    return await UserModel.update(id, user);
  }

  async delete(id: string): Promise<boolean> {
    return await UserModel.delete(id);
  }

  async login(
    email: string,
    password: string
  ): Promise<{ token: string; refreshToken: string } | null> {
    const user = await this.getByEmail(email);

    if (!user) {
      throw new Error("Usuário não encontrado");
    }

    const isPasswordValid = await this.verifyPassword(password, user.password);

    if (!isPasswordValid) {
      throw new Error("Senha incorreta.");
    }

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET || "", {
      expiresIn: "7d",
    });

    if (!user.id) {
      throw new Error("ID do usuário não encontrado");
    }

    // Use `await` para aguardar a resolução do refreshToken
    const refreshToken = await this.generateRefreshToken(user.id);

    return { token, refreshToken };
  }

  public async generateRefreshToken(userId: string): Promise<string> {
    const refreshToken = uuidv4();
    const expiresAt = Date.now() + 7 * 24 * 60 * 60 * 1000; // Expira em 7 dias

    // Armazena o refreshToken no banco de dados
    await RefreshTokenModel.create(userId, refreshToken, expiresAt);

    return refreshToken;
  }

  private hashPassword(password: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const salt = crypto.randomBytes(16).toString("hex"); // Gera um salt aleatório
      crypto.pbkdf2(
        password,
        salt,
        this.saltRounds,
        this.keyLength,
        "sha512",
        (err, derivedKey) => {
          if (err) reject(err);
          else resolve(`${salt}:${derivedKey.toString("hex")}`); // Concatena salt e hash para armazenar
        }
      );
    });
  }

  private verifyPassword(
    password: string,
    storedHash: string
  ): Promise<boolean> {
    return new Promise((resolve, reject) => {
      const [salt, key] = storedHash.split(":");
      crypto.pbkdf2(
        password,
        salt,
        this.saltRounds,
        this.keyLength,
        "sha512",
        (err, derivedKey) => {
          if (err) reject(err);
          else resolve(key === derivedKey.toString("hex")); // Compara o hash gerado com o hash armazenado
        }
      );
    });
  }
}

export default new UserService();
