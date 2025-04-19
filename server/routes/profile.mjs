import { Router } from 'express';
import User from '../models/Users.mjs';
import { authMiddleware } from '../utils/middlewares.mjs';

const router = Router();

router.get('/profile', authMiddleware, async (req, res) => {
  const findUser = await User.findById(req.session.userId);

  if (!findUser) return res.send('Пользователь не найден');

  const locals = {
    title: 'Личный кабинет',
    user: findUser,
  };
  res.render('profile', locals);
});

router.get('/updateSurnameProfile', async (req, res) => {
  const { value } = req.query;
  const userId = req.session.userId;

  try {
    const updateUser = await User.findByIdAndUpdate(userId, { surname: value }, { new: true });
    res.json(updateUser);
  } catch (error) {
    console.log(error);
    res.send('Ошибка');
  }
});

router.get('/updateNameProfile', async (req, res) => {
  const { value } = req.query;
  const userId = req.session.userId;

  try {
    const updateUser = await User.findByIdAndUpdate(userId, { name: value }, { new: true });
    res.json(updateUser);
  } catch (error) {
    console.log(error);
    res.send('Ошибка');
  }
});

router.get('/updateAddressProfile', async (req, res) => {
  const { value } = req.query;
  const userId = req.session.userId;

  try {
    const updateUser = await User.findByIdAndUpdate(userId, { address: value }, { new: true });
    res.json(updateUser);
  } catch (error) {
    console.log(error);
    res.send('Ошибка');
  }
});

export default router;
