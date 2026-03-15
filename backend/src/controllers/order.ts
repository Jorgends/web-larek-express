import { NextFunction, Request, Response } from "express";
import productModel from "../models/product";
import { faker } from "@faker-js/faker";
import Joi from "joi";
import BadRequestError from "../error/bad-request-error";
import NotFoundError from "../error/not-found-error";

enum EPayment {
  "card",
  "online",
}
interface IOrder {
  items: string[];
  total: number;
  payment: EPayment;
  email: string;
  phone: string;
  address: string;
}

async function validOrder(order: IOrder) {
  let total: number = 0;
  if (order.items.length <= 0) {
    throw new BadRequestError("Ошибка валидации данных при оформлении заказа");
  }

  const products = await productModel.find({
    _id: { $in: order.items },
  });

  if (products.length !== order.items.length) {
    throw new NotFoundError("Ошибка валидации данных при оформлении заказа");
  }
  for (const item of products) {
    if (item.price === null) {
      throw new BadRequestError(
        "Ошибка валидации данных при оформлении заказа"
      );
    }
    total += item.price as number;
  }
  if (total !== order.total) {
    throw new BadRequestError("Ошибка валидации данных при оформлении заказа");
  }
  return true;
}

/**
 * Функция для создания нового заказа в системе.
 *
 *   - Заказ проходит валидацию через функцию `validOrder`.
 *
 * 1. В случае успеха:
 *    - Возвращается статус 201 (Created).
 *    - Возвращается объект с двумя свойствами:
 *      - id: уникальный идентификатор заказа, генерируемый с помощью библиотеки `faker`.
 *      - total: общая сумма заказа из данных, переданных в запросе.
 *
 * 2. В случае ошибки:
 *    - Ошибка определенного класса передаётся в следующий middleware для централизованной обработки.
 *    - **(уточнение: класс ошибки определяется в функции validOrder)**
 *
 * Используемые функции:
 * - `validOrder` для проверки корректности данных заказа.
 * - `faker` для генерации уникального идентификатора.
 *
 * @param {Request} req - HTTP запрос, содержащий данные заказа.
 * @param {Response} res - HTTP ответ, который будет отправлен клиенту.
 * @param {NextFunction} next - Функция в следующий middleware.
 */
export const createOrder = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const order: IOrder = req.body;

  try {
    await validOrder(order);
    res.status(201).json({
      id: faker.string.uuid(),
      total: order.total,
    });
  } catch (error) {
    next(error);
  }
};
