import { Router } from 'express';
import { validate } from '../utils/middlewares/validate.mjs';
import { registerUserValidationSchema } from '../utils/validationSchema.mjs';
import { displayPageRegister, register } from '../controllers/registerController.mjs';

const router = Router();

router.get('/register', displayPageRegister);
router.post('/register', validate(registerUserValidationSchema, 'register', 'Регистрация'), register);

export default router;
