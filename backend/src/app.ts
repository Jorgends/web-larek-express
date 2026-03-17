import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import path from 'path';
import { errors } from 'celebrate';
import orderRoutes from './routes/order';
import productRoutes from './routes/product';
import errorHandler from './middlewares/error-handler';
import { requestLogger, errorLogger } from './middlewares/logger';

const { PORT = 3000 } = process.env;
const { DB_ADDRESS = "mongodb://127.0.0.1:27017/weblarek" } = process.env

const app = express();
app.use(express.json());

mongoose.connect(DB_ADDRESS);
app.use(express.static(path.join(__dirname, './public')));

app.use(cors());
app.use(requestLogger)

app.use('/product', productRoutes);
app.use('/order', orderRoutes);

app.use(errors());
app.use(errorLogger)
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server listen to ${PORT} port`);
});
