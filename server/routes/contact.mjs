import { Router } from 'express';
import { displayPageContact } from '../controllers/contactController.mjs';

const router = Router();

router.get('/contact', displayPageContact);

export default router;
