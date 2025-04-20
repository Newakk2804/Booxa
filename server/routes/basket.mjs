import { Router } from 'express';
import Basket from '../models/Basket.mjs';

const router = Router();

router.get('/basket', async (req, res) => {
  const userId = req.session.userId;
  let basket;
  try {
    basket = await Basket.findOne({ owner: userId }).populate('items');

    if (!basket) {
      basket = await Basket.create({ owner: userId, items: [] });
    }

    const locals = {
      title: 'Корзина',
      items: basket.items,
    };

    res.render('basket', locals);
  } catch (error) {
    console.log(error);
    res.send('Ошибка получения корзины');
  }
});

router.get('/basket/count', async (req, res) => {
  try {
    const userId = req.session.userId;
    const basket = await Basket.findOne({ owner: userId });
    const count = basket ? basket.items.length : 0;
    res.json({ count });
  } catch (err) {
    res.status(500).json({ count: 0 });
  }
});

router.get('/basket/total', async (req, res) => {
  try {
    const userId = req.session.userId;
    const basket = await Basket.findOne({ owner: userId }).populate('items');

    if (!basket) return res.json({ total: 0 });

    const total = basket.items.reduce((sum, item) => (sum + item.price), 0);
    res.json({ total });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Ошибка при подсчете общей стоимости' });
  }
});

router.delete('/basket/:id', async (req, res) => {
  const userId = req.session.userId;
  const bookId = req.params.id;

  try {
    const basket = await Basket.findOne({ owner: userId });

    basket.items = basket.items.filter((item) => item.toString() !== bookId);

    await basket.save();
    return res.json({ message: 'Товар удален из корзины' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Ошибка сервера' });
  }
});

router.get('/basket/:id', async (req, res) => {
  const userId = req.session.userId;
  const bookId = req.params.id;

  try {
    let basket = await Basket.findOne({ owner: userId });

    if (!basket) {
      basket = await Basket.create({ owner: userId, items: [bookId] });
    } else {
      if (!basket.items.includes(bookId)) {
        basket.items.push(bookId);
        await basket.save();
      }
    }

    res.json(basket);
  } catch (error) {
    console.log(error);
    res.send('Ошибка добавления в корзину');
  }
});

export default router;
