import { Request } from "express";
import * as jwt from "jsonwebtoken";

interface TokenPayload {
  id: string;
  iat: number;
  exp: number;
}

export interface RequestCustom extends Request {
  user_id: string | jwt.JwtPayload | string[] | undefined;
}
