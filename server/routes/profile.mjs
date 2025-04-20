import { Router } from 'express';
import User from '../models/Users.mjs';
import Order from '../models/Orders.mjs';
import { authMiddleware } from '../utils/middlewares.mjs';
import upload from '../utils/upload.mjs';
import moment from 'moment';
import path from 'path';
import fs from 'fs';

const router = Router();

router.get('/profile', authMiddleware, async (req, res) => {
  const userId = req.session.userId;
  const findUser = await User.findById(userId);

  if (!findUser) return res.send('Пользователь не найден');

  let orders = await Order.find({ owner: userId });

  if (!orders) {
    orders = await Order.create({ owner: userId, items: [], price: 0, status: 'В обработке' });
  }

  orders = orders.map((order) => ({
    ...order.toObject(),
    formattedDate: moment(order.createdAt).format('DD.MM.YYYY'),
  }));

  const locals = {
    title: 'Личный кабинет',
    user: findUser,
    orders: orders,
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

router.post('/profile/photo', upload.single('imageUrl'), async (req, res) => {
  const userId = req.session.userId;

  if (!req.file) {
    return res.status(400).send('Файл не загружен');
  }

  try {
    const user = await User.findById(userId);
    const newPath = 'uploads/' + req.file.filename;

    if (user.imageUrl) {
      const oldPath = path.join(process.cwd(), 'public', user.imageUrl);
      fs.unlink(oldPath, (err) => {
        if (err) {
          console.log('Не удалось удалить старое фото: ', err.message);
        }
      });
    }

    user.imageUrl = newPath;
    await user.save();

    res.redirect('/profile');
  } catch (error) {
    console.log(error);
    res.status(400).send('Ошибка при загрузке фото');
  }
});

export default router;
