import { Request, Response, NextFunction } from "express";
import Logger from "../utils/logger";

interface CustomError extends Error {
  status?: number;
  code?: string;
}

export const errorHandler = (
  err: CustomError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const status = err.status || 500;
  const message = err.message || "Internal Server Error";

  // Log error with additional context
  Logger.error({
    message: `Error: ${message}`,
    error: {
      name: err.name,
      message: err.message,
      stack: err.stack,
      code: err.code,
    },
    request: {
      id: req.id,
      method: req.method,
      url: req.url,
      ip: req.ip,
      headers: req.headers,
    },
  });

  res.status(status).json({
    error: {
      message,
      status,
      requestId: req.id,
      timestamp: new Date().toISOString(),
    },
  });
};

export const notFoundHandler = (req: Request, res: Response) => {
  Logger.warn(`404 - Not Found: ${req.method} ${req.url}`);

  res.status(404).json({
    error: {
      message: "Resource not found",
      status: 404,
      requestId: req.id,
      timestamp: new Date().toISOString(),
    },
  });
};
