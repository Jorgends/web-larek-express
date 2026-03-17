import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';
import mongoose from 'mongoose';
import BadRequestError from '../error/bad-request-error';

const orderSchema = Joi.object({
  items: Joi.array().items(Joi.string().required()).required(),
  total: Joi.number().required(),
  payment: Joi.string().required(),
  email: Joi.string().email().required(),
  phone: Joi.string().required(),
  address: Joi.string().required(),
});

const productSchema = Joi.object({
  title: Joi.string().min(2).max(30).required(),
  image: Joi.object({
    fileName: Joi.string().required(),
    originalName: Joi.string().required(),
  }).required(),
  category: Joi.string().required(),
  description: Joi.string().allow('').optional(),
  price: Joi.number().allow(null).optional(),
});

export const validateOrderBody = (
  req: Request,
  _res: Response,
  next: NextFunction,
) => {
  const { error } = orderSchema.validate(req.body);

  if (error) {
    return next(new BadRequestError(error.message));
  }

  return next();
};

export const validateProductBody = (
  req: Request,
  _res: Response,
  next: NextFunction,
) => {
  const { error } = productSchema.validate(req.body);

  if (error) {
    return next(
      new BadRequestError('Ошибка валидации данных при создании товара'),
    );
  }

  return next();
};

export const validateObjIdArray = (
  req: Request,
  _res: Response,
  next: NextFunction,
) => {
  const { items } = req.body;

  if (!Array.isArray(items)) {
    return next(new BadRequestError('Ошибка валидации данных'));
  }

  const hasInvalidId = items.some(
    (item) => !mongoose.Types.ObjectId.isValid(item),
  );

  if (hasInvalidId) {
    return next(new BadRequestError('Ошибка валидации данных'));
  }

  return next();
};
