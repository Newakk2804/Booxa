import User from '../models/Users.mjs';
import Order from '../models/Orders.mjs';
import { checkPassword, hashPassword } from '../utils/helpers.mjs';
import moment from 'moment';
import path from 'path';
import fs from 'fs';

export const displayPageProfile = async (req, res) => {
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
};

export const updateSurname_Ajax = async (req, res) => {
  const { value } = req.query;
  const userId = req.session.userId;

  try {
    const updateUser = await User.findByIdAndUpdate(userId, { surname: value }, { new: true });
    res.json(updateUser);
  } catch (error) {
    console.log(error);
    res.send('Ошибка');
  }
};

export const updateName_Ajax = async (req, res) => {
  const { value } = req.query;
  const userId = req.session.userId;

  try {
    const updateUser = await User.findByIdAndUpdate(userId, { name: value }, { new: true });
    res.json(updateUser);
  } catch (error) {
    console.log(error);
    res.send('Ошибка');
  }
};

export const updateAddress_Ajax = async (req, res) => {
  const { value } = req.query;
  const userId = req.session.userId;

  try {
    const updateUser = await User.findByIdAndUpdate(userId, { address: value }, { new: true });
    res.json(updateUser);
  } catch (error) {
    console.log(error);
    res.send('Ошибка');
  }
};

export const updatePhoto = async (req, res) => {
  const userId = req.session.userId;

  if (!req.file) {
    return res.status(400).send('Файл не загружен');
  }

  try {
    const user = await User.findById(userId);
    const newPath = 'uploads/' + req.file.filename;

    if (user.imageUrl && user.imageUrl !== 'img/user.jpg') {
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
};

export const displayPageCheckUser = (req, res) => {
  const locals = {
    title: 'Проверка пользователя',
    errors: {},
    formData: {},
  };

  res.render('check_user', locals);
};

export const checkUser = async (req, res) => {
  const { checkUser } = req.body;

  try {
    const findUser = await User.findOne({ mail: checkUser });

    if (!findUser) {
      return res.status(422).render('check_user', {
        errors: { checkUser: { msg: 'Такого пользователя не существует' } },
        formData: req.body,
        title: 'Проверка пользователя',
      });
    }

    req.session.TempUserId = findUser._id;

    res.redirect('/profile/change-password');
  } catch (error) {
    console.error(error);
    res.status(500).render('change_password', {
      errors: { global: { msg: 'Ошибка во время проверки пользователя' } },
      formData: req.body,
      title: 'Изменение пароля',
    });
  }
};

export const displayPageChangePassword = (req, res) => {
  const locals = {
    title: 'Изменение пароля',
    errors: {},
    formData: {},
  };

  res.render('change_password', locals);
};

export const changePassword = async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  const userId = req.session.TempUserId || req.session.userId;

  try {
    const findUser = await User.findById(userId);
    const checkOldPassword = checkPassword(oldPassword, findUser.password);

    if (!checkOldPassword) {
      return res.status(400).render('change_password', {
        errors: { oldPassword: { msg: 'Старый пароль неверен' } },
        formData: req.body,
        title: 'Изменение пароля',
      });
    }

    const hashedPassword = hashPassword(newPassword);

    await User.updateOne({ _id: userId }, { $set: { password: hashedPassword } });

    res.redirect('/profile');
  } catch (error) {
    console.error(error);
    res.status(500).render('change_password', {
      errors: { global: { msg: 'Ошибка при изменении' } },
      formData: req.body,
      title: 'Изменение пароля',
    });
  }
};

export const displayPageAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate('owner', 'mail').populate('items');

    const locals = {
      title: 'Все заказы',
      orders,
    };

    res.render('all_orders', locals);
  } catch (err) {
    console.error('Ошибка при получении заказов:', err);
    res.status(500).send('Ошибка сервера');
  }
};

export const changeStatusForOrder_Ajax = async (req, res) => {
  let { status } = req.body;
  const { id } = req.params;

  if (!status || typeof status !== 'string') {
    return res.status(400).json({ message: 'Статус должен быть строкой и не может быть пустым' });
  }

  status = status.trim();

  const validStatuses = [
    'В обработке',
    'Собирается на складе',
    'В пути до получателя',
    'Доставлен',
    'Отменен',
  ];

  if (!validStatuses.includes(status)) {
    console.log(`Получен некорректный статус: "${status}"`);
    return res.status(400).json({ message: 'Неверный статус' });
  }

  try {
    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).json({ message: 'Заказ не найден' });
    }

    order.status = status;
    await order.save();

    res.status(200).json({ message: 'Статус заказа обновлён успешно' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Произошла ошибка при обновлении статуса' });
  }
};

export const getAllBooksOrderForUser_Ajax = async (req, res) => {
  const orderId = req.params.id;
  const order = await Order.findById(orderId).populate('items');
  if (!order) {
    return res.status(404).json({ message: 'Заказ не найден' });
  }

  const books = order.items.map((book) => ({
    title: book.title,
    price: book.price,
    imageUrl: book.imageUrl,
  }));

  res.json({ books });
};

export const updateStatusForOrderUser_Ajax = async (req, res) => {
  const orderId = req.params.id;
  const userId = req.session.userId;

  try {
    const order = await Order.findOne({ _id: orderId, owner: userId });

    if (!order) {
      return res.status(404).json({ message: 'Заказ не найден' });
    }

    if (order.status !== 'В обработке') {
      return res
        .status(400)
        .json({ message: 'Отменить можно только заказ в статусе "В обработке"' });
    }

    order.status = 'Отменен';
    await order.save();

    res.json({ message: 'Заказ отменён' });
  } catch (error) {
    console.error('Ошибка при отмене заказа:', error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
};
