import AppError from './app-error';

export default class ServerError extends AppError {
  constructor(message: string) {
    super(message, 500);
  }
}
