import { Router } from 'express';
import { loginUserValidationSchema } from '../utils/validationSchema.mjs';
import { validate } from '../utils/middlewares/validate.mjs';
import { displayPageLogin, login, logout } from '../controllers/loginController.mjs';

const router = Router();

router.get('/login', displayPageLogin);
router.post('/login', validate(loginUserValidationSchema, 'login', 'Вход'), login);
router.get('/logout', logout);

export default router;
