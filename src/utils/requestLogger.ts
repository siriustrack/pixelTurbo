import { Request, Response, NextFunction } from "express";
import Logger, { requestLogger } from "../utils/logger";
import { v4 as uuidv4 } from "uuid";

export const loggerMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Add request ID for tracking
  req.id = uuidv4();

  // Log the request
  requestLogger(req);

  // Log response
  const startTime = Date.now();
  res.on("finish", () => {
    const duration = Date.now() - startTime;
    Logger.info(
      `${req.method} ${req.url} ${res.statusCode} - ${duration}ms - ReqID: ${req.id}`
    );
  });

  next();
};
