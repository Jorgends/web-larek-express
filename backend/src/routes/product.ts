import { Router } from 'express';
import { getProducts, createProduct } from '../controllers/product';
import { validateProductBody  } from "../middlewares/validations";

const router = Router();

router.get('/', getProducts);
router.post('/', validateProductBody, createProduct);

export default router;
