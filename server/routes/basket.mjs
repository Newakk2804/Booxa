import { Router } from 'express';
import Book from '../models/Books.mjs';
import Basket from '../models/Basket.mjs';

const router = Router();

router.get('/basket', async (req, res) => {
  const userId = req.session.userId;
  let totalPrice = 0;
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

    basket.items.forEach((item) => {
      totalPrice += item.price;
    });

    locals.totalPrice = totalPrice;
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
