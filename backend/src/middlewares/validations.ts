import { Request, Response, NextFunction } from "express";
import Joi from "joi";
import BadRequestError from "../error/bad-request-error";
import mongoose from "mongoose";

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
  description: Joi.string().allow("").optional(),
  price: Joi.number().allow(null),
});

export const validateOrderBody = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { error } = orderSchema.validate(req.body);

  if (error) {
    return next(new BadRequestError(error.message));
  }

  next();
};

export const validateProductBody = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { error } = productSchema.validate(req.body);

  if (error) {
    return next(
      new BadRequestError("Ошибка валидации данных при создании товара")
    );
  }

  next();
};


export const validateObjIdArray = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const items = req.body.items;

  if (!Array.isArray(items)) {
    return next(new BadRequestError("Ошибка валидации данных"));
  }

  for (const id of items) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return next(new BadRequestError("Ошибка валидации данных"));
    }
  }

  next();
};