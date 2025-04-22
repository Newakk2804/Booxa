import { Router } from 'express';
import User from '../models/Users.mjs';
import { loginUserValidationSchema } from '../utils/validationSchema.mjs';
import { validate } from '../utils/middlewares/validate.mjs';
import bcrypt from 'bcrypt';

const router = Router();

router.get('/login', (req, res) => {
  const locals = {
    title: 'Вход',
    errors: {},
    formData: {},
  };
  res.render('login', locals);
});

router.post('/login', validate(loginUserValidationSchema, 'login', 'Вход'), async (req, res) => {
  try {
    const { mail, password } = req.body;
    const user = await User.findOne({ mail });

    if (!user) {
      return res.render('login', {
        errors: { mail: { msg: 'Пользователь не найден' } },
        formData: req.body,
        title: 'Вход',
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.render('login', {
        errors: { password: {msg: 'Неверный пароль'}},
        formData: req.body,
        title: 'Вход',
      });
    }

    req.session.userId = user.id;

    res.redirect('/');
  } catch (error) {
    console.error(error);
    res.status(500).render('login', {
      errors: { global: { msg: 'Ошибка во время авторизации' } },
      formData: req.body,
      title: 'Вход',
    });
  }
});

router.get('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) return res.send('Ошибка выхода');
    res.redirect('/');
  });
});

export default router;
