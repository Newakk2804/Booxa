import { Router } from 'express';
import { displayPageAbout } from '../controllers/aboutController.mjs';

const router = Router();

router.get('/about', displayPageAbout);

export default router;
