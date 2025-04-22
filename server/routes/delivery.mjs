import { Router } from 'express';
import { displayPageDelivery } from '../controllers/deliveryContact.mjs';

const router = Router();

router.get('/delivery', displayPageDelivery);

export default router;
