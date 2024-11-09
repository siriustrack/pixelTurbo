import { Request } from "express";

interface TokenPayload {
  id: string;
  iat: number;
  exp: number;
}

export interface RequestCustom extends Request {
  user_id?: string;
}
