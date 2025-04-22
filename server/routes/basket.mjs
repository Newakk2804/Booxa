import { Router } from 'express';
import {
  addItemInBasket_Ajax,
  countItemInBasket_Ajax,
  deleteItemInBasket_Ajax,
  displayUserBasket,
  placingAnOrder_Ajax,
  totalPriceForBasket_Ajax,
} from '../controllers/basketController.mjs';

const router = Router();

router.get('/basket', displayUserBasket);
router.get('/basket/count', countItemInBasket_Ajax);
router.get('/basket/total', totalPriceForBasket_Ajax);
router.get('/basket/order', placingAnOrder_Ajax);
router.delete('/basket/:id', deleteItemInBasket_Ajax);
router.get('/basket/:id', addItemInBasket_Ajax);

export default router;
