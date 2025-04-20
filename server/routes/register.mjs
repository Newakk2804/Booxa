import { Router } from 'express';
import User from '../models/Users.mjs';
import { hashPassword } from '../utils/helpers.mjs';

const router = Router();

router.get('/register', (req, res) => {
  const locals = {
    title: 'Регистрация',
  };
  res.render('register', locals);
});

router.post('/register', async (req, res) => {
  const { mail, password, secondPassword } = req.body;

  const CheckUser = await User.findOne({ mail });
  if (CheckUser) return res.send(CheckUser);

  if (password !== secondPassword) throw new Error('passwords do not match');

  const hashedPassword = hashPassword(password);
  const newUser = new User({ mail, password: hashedPassword, role: 'user', imageUrl: 'img/user.jpg'});
  try {
    const savedUser = await newUser.save();
    return res.redirect('login');
  } catch (error) {
    return res.status(400).send({ msg: error });
  }
});

export default router;
