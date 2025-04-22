import { Router } from 'express';
import User from '../models/Users.mjs';
import { hashPassword } from '../utils/helpers.mjs';
import { validate } from '../utils/middlewares/validate.mjs';
import { registerUserValidationSchema } from '../utils/validationSchema.mjs';

const router = Router();

router.get('/register', (req, res) => {
  const locals = {
    title: 'Регистрация',
    errors: {},
    formData: {},
  };
  res.render('register', locals);
});

router.post('/register', validate(registerUserValidationSchema, 'register', 'Регистрация'), async (req, res) => {
  try {
    const { mail, password } = req.body;

    const existingUser = await User.findOne({ mail });

    if (existingUser) {
      return res.status(422).render('register', {
        errors: { mail: { msg: 'Такой пользователь уже существует' } },
        formData: req.body,
        title: 'Регистрация',
      });
    }

    const hashedPassword = hashPassword(password);

    const newUser = new User({
      mail,
      password: hashedPassword,
      role: 'user',
      imageUrl: 'img/user.jpg',
    });

    await newUser.save();

    res.redirect('/login');
  } catch (error) {
    res.status(500).render('register', {
      errors: { global: { msg: 'Ошибка во время регистрации' } },
      formData: req.body,
      title: 'Регистрация',
    });
  }
});

export default router;
