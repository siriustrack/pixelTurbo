import { Express } from "express-serve-static-core";

declare global {
  namespace Express {
    interface Request {
      id?: string;
      user_id?: string;
    }
  }
}
