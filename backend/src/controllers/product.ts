import { Request, Response, NextFunction } from 'express';
import productModel from '../models/product';
import ConflictError from '../error/conflict-error';
import BadRequestError from '../error/bad-request-error';

/**
 * Функция для получения списка всех товаров из базы данных.
 *
 * 1. В случае успеха:
 *    - Возвращается статус 200 (OK).
 *    - Отправляется объект с двумя свойствами:
 *      - items: массив всех найденных товаров.
 *      - total: общее количество товаров.
 *
 * 2. В случае ошибки:
 *    - Ошибка передаётся в следующий middleware для централизованной обработки.
 *    - Так как HTTP запрос не содержит параметров для фильтрации,
 *      ответ ошибки всегда будет со статусом 500
 *      (Internal Server Error)
 *
 * Используемая модель:
 * - productModel для взаимодействия с базой данных.
 *
 * @param {Request} req - HTTP запрос (не содержит параметров для фильтрации).
 * @param {Response} res - HTTP ответ, который будет отправлен клиенту.
 * @param {NextFunction} next - Функция в следующий middleware.
 */
export const getProducts = (
  _req: Request,
  res: Response,
  next: NextFunction,
) => {
  productModel
    .find({})
    .select('-__v')
    .then((products) => {
      res.status(200).send({ items: products, total: products.length });
    })
    .catch(next);
};

/**
 * Функция для создания нового товара в базе данных.
 *
 * 1. В случае успеха:
 *    - Создает в базе данных новый товар.
 *    - Возвращается статус 201 (Created).
 *    - Возвращается сообщение "ok".
 *
 * 2. В случае ошибки:
 *    - Если ошибка связана с конфликтом данных
 *      (дублирование уникального/уникальных поля/полей),
 *      создается ошибка типа ConflictError с пояснением проблемы.
 *    - Если ошибка вызвана неправильным запросом пользователя
 *      (некорректные данные),
 *      создается ошибка типа BadRequestError с пояснением проблемы.
 *
 * Используемая модель:
 * - productModel для взаимодействия с базой данных.
 *
 * @param {Request} req - HTTP запрос, содержащий данные товара.
 * @param {Response} res - HTTP ответ, который будет отправлен клиенту.
 * @param {NextFunction} next - Функция в следующий middleware.
 */
export const createProduct = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const product = req.body;

  productModel
    .create({
      title: product.title,
      image: product.image,
      category: product.category,
      description: product.description,
      price: product.price,
    })
    .then((createdProduct) => {
      res.status(201).send({
        id: createdProduct._id,
        name: createdProduct.title,
        price: createdProduct.price,
        description: createdProduct.description,
      });
    })
    .catch((error) => {
      if (error.code === 11000) {
        return next(
          new ConflictError(
            'Ошибка валидации данных при создании товара',
          ),
        );
      }

      return next(
        new BadRequestError(
          'Ошибка валидации данных при создании товара',
        ),
      );
    });
};
