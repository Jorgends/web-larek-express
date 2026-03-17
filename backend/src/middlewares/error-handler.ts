import { Request, Response, NextFunction } from 'express';
import { isCelebrateError } from 'celebrate';
import AppError from '../error/app-error';

const errorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (isCelebrateError(err)) {
    return next(err);
  }

  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      message: err.message,
    });
  }

  return res.status(500).json({
    message: 'Ошибка сервера',
  });
};

export default errorHandler;
