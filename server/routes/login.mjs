import { Router } from 'express';
import User from '../models/Users.mjs';
import { loginUserValidationSchema } from '../utils/validationSchema.mjs';
import { validationResult, checkSchema } from 'express-validator';
import bcrypt from 'bcrypt';

const router = Router();

router.get('/login', (req, res) => {
  const locals = {
    title: 'Вход',
    errors: {},
    oldInput: {},
  };
  res.render('login', locals);
});

router.post('/login', checkSchema(loginUserValidationSchema), async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.render('login', { errors: errors.mapped(), oldInput: req.body });
  }

  try {
    const { mail, password } = req.body;
    const user = await User.findOne({ mail });

    if (!user) {
      return res.render('login', {
        errors: { mail: { msg: 'Пользователь не найден' } },
        oldInput: req.body,
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.render('login', {
        errors: errors.mapped(),
        oldInput: req.body,
      });
    }

    req.session.userId = user.id;

    res.redirect('/');
  } catch (error) {
    console.error(error);
    res.status(500).send('Ошибка сервера');
  }
});

router.get('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) return res.send('Ошибка выхода');
    res.redirect('/');
  });
});

export default router;
