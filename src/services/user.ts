import { User } from "../types";
import UserModel from "../models/user";
import * as bcrypt from "bcryptjs"; // Para hash de senhas
import { validationResult } from "express-validator";
import jwt from "jsonwebtoken";

class UserService {
  async create(user: User): Promise<User> {
    const errors = validationResult(user);
    if (!errors.isEmpty()) {
      throw new Error(errors.array()[0].msg); // Lança o primeiro erro de validação
    }

    const hashedPassword = await bcrypt.hash(user.password, 10); // Hash da senha

    const newUser: User = {
      ...user,
      password: hashedPassword, // Salva o hash da senha, não a senha em texto plano
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
    // Aqui você pode adicionar lógica adicional, como verificar se o email já existe para outro usuário
    return await UserModel.update(id, user);
  }

  async delete(id: string): Promise<boolean> {
    return await UserModel.delete(id);
  }

  async login(email: string, password: string): Promise<string | null> {
    const user = await this.getByEmail(email);

    if (!user) {
      throw new Error("Usuário não encontrado");
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new Error("Senha incorreta.");
    }

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET || "", {
      expiresIn: "7d", // Tempo de expiração (7 dias) - configure conforme necessário
    });

    return token;
  }
}

export default new UserService();
