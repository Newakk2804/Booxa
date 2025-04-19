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

export default router;
