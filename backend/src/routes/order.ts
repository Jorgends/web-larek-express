import { Router } from "express";
import { createOrder } from "../controllers/order";
import { validateObjIdArray, validateOrderBody } from "../middlewares/validations";

const router = Router();

router.post("/", validateObjIdArray, validateOrderBody, createOrder);

export default router;
