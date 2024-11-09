import { Request, Response, NextFunction } from 'express';

interface CustomError extends Error {
  status?: number;
}

export const errorHandler = (
  err: CustomError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const status = err.status || 500;
  const message = err.message || 'Internal Server Error';

  console.error(`[Error] ${status} - ${message}`);
  console.error(err.stack);

  res.status(status).json({
    error: {
      message,
      status,
      timestamp: new Date().toISOString(),
    },
  });
};

export const notFoundHandler = (req: Request, res: Response) => {
  res.status(404).json({
    error: {
      message: 'Resource not found',
      status: 404,
      timestamp: new Date().toISOString(),
    },
  });
};