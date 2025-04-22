import { Router } from 'express';
import User from '../models/Users.mjs';
import { hashPassword } from '../utils/helpers.mjs';
import { checkSchema, validationResult } from 'express-validator';
import { registerUserValidationSchema } from '../utils/validationSchema.mjs';

const router = Router();

router.get('/register', (req, res) => {
  const locals = {
    title: 'Регистрация',
    errors: {},
    oldInput: {},
  };
  res.render('register', locals);
});

router.post('/register', checkSchema(registerUserValidationSchema), async (req, res) => {
  const errors = validationResult(req);
  const { mail, password, secondPassword } = req.body;

  if (!errors.isEmpty()) {
    return res.status(422).render('register', { errors: errors.mapped(), oldInput: req.body, title: 'Регистрация'});
  }

  const CheckUser = await User.findOne({ mail });

  if (CheckUser) {
    return res.status(422).render('register', {
      errors: { mail: { msg: 'Такой пользователь уже существует' } },
      oldInput: req.body,
      title: 'Регистрация'
    });
  }

  const hashedPassword = hashPassword(password);
  const newUser = new User({
    mail,
    password: hashedPassword,
    role: 'user',
    imageUrl: 'img/user.jpg',
  });
  try {
    await newUser.save();
    return res.redirect('login');
  } catch (error) {
    return res.status(400).send({ msg: error });
  }
});

export default router;
