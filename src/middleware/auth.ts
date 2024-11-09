import { Request, Response, NextFunction } from "express";
import * as jwt from "jsonwebtoken";

interface TokenPayload {
  id: string;
  iat: number;
  exp: number;
}

const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
): Response | void | any => {
  const { authorization } = req.headers;

  if (!authorization) {
    return res.status(401).json({ error: "Token não fornecido" });
  }

  const parts = authorization.split(" ");

  if (parts.length !== 2) {
    return res.status(401).json({ error: "Token error" });
  }

  const [scheme, token] = parts;

  if (!/^Bearer$/i.test(scheme)) {
    return res.status(401).json({ error: "Token mal formatado" });
  }

  jwt.verify(
    token,
    process.env.JWT_SECRET || "",
    (err: any, decoded: TokenPayload) => {
      if (err) {
        return res.status(401).json({ error: "Token inválido" });
      }

      const payload = decoded as TokenPayload;
      req.user_id = payload.id;

      return next();
    }
  );
};

export default authMiddleware;
